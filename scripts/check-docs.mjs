import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const errors = [];
const label = (file) => path.relative(root, file).split(path.sep).join("/");

async function markdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(file)));
    else if (entry.name.endsWith(".md")) files.push(file);
  }
  return files.sort();
}

function withoutCode(text) {
  const lines = [];
  let fence;
  for (const line of text.split("\n")) {
    const match = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) {
        fence = undefined;
      }
      continue;
    }
    lines.push(fence ? "" : line);
  }
  return lines.join("\n");
}

function headingAnchors(text) {
  const anchors = new Set();
  for (const match of text.matchAll(/^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/gm)) {
    const base = match[1]
      .replace(/<[^>]*>/g, "")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, "")
      .trim()
      .replace(/\s/g, "-");
    let anchor = base;
    let suffix = 0;
    while (anchors.has(anchor)) anchor = `${base}-${++suffix}`;
    anchors.add(anchor);
  }
  return anchors;
}

function destinations(text) {
  const result = [];
  const definitions = new Map();
  for (const match of text.matchAll(/^ {0,3}\[([^\]]+)\]:\s*(<[^>]+>|\S+)/gm)) {
    definitions.set(match[1].trim().toLowerCase(), match[2]);
    result.push(match[2]);
  }
  for (const match of text.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+["'][^\n]*?["'])?\s*\)/g)) {
    result.push(match[1]);
  }
  for (const match of text.matchAll(/!?\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
    const name = (match[2] || match[1]).trim().toLowerCase();
    if (!definitions.has(name)) result.push(`UNDEFINED_REFERENCE:${name}`);
  }
  return result;
}

try {
  const files = [
    path.join(root, "AGENTS.md"),
    path.join(root, "GLOSSARY.md"),
    path.join(root, "PRODUCT.md"),
    path.join(root, "DESIGN.md"),
    path.join(root, "frontend/DEVELOPMENT.md"),
    ...(await markdownFiles(path.join(root, "docs"))),
  ];
  const documents = new Map();
  for (const file of files) {
    const text = withoutCode(await readFile(file, "utf8"));
    documents.set(file, { text, anchors: headingAnchors(text), links: new Set() });
  }

  for (const [file, document] of documents) {
    for (const raw of destinations(document.text)) {
      if (raw.startsWith("UNDEFINED_REFERENCE:")) {
        errors.push(`${label(file)}: undefined reference ${raw.split(":")[1]}`);
        continue;
      }
      const url = raw.replace(/^<|>$/g, "");
      if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) continue;
      const [destination, fragment] = url.split("#", 2);
      let target;
      let anchor;
      try {
        const decoded = decodeURIComponent(destination).split("?")[0];
        target = decoded
          ? path.resolve(decoded.startsWith("/") ? root : path.dirname(file), decoded.replace(/^\//, ""))
          : file;
        anchor = fragment === undefined ? undefined : decodeURIComponent(fragment);
      } catch {
        errors.push(`${label(file)}: invalid encoded destination ${url}`);
        continue;
      }
      const relative = path.relative(root, target);
      if (relative === ".." || relative.startsWith(`..${path.sep}`)) {
        errors.push(`${label(file)}: link escapes repository: ${url}`);
        continue;
      }
      try {
        await stat(target);
      } catch {
        errors.push(`${label(file)}: missing target ${url}`);
        continue;
      }
      if (documents.has(target)) {
        document.links.add(target);
        if (anchor && !documents.get(target).anchors.has(anchor)) {
          errors.push(`${label(file)}: missing heading ${url}`);
        }
      }
    }
  }

  const reached = new Set();
  const queue = [path.join(root, "AGENTS.md")];
  while (queue.length) {
    const file = queue.pop();
    if (reached.has(file)) continue;
    reached.add(file);
    for (const linked of documents.get(file)?.links ?? []) queue.push(linked);
  }
  for (const file of files) {
    if (!reached.has(file)) errors.push(`${label(file)}: unreachable from AGENTS.md`);
  }
  if ((await stat(path.join(root, "README.md"))).size !== 0) {
    errors.push("README.md must remain empty until the user changes that requirement");
  }

  if (errors.length) {
    process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Documentation check passed: ${files.length} Markdown files; local targets, headings, navigation, root product/design context, and empty README verified.\n`);
  }
} catch (error) {
  process.stderr.write(`Documentation check failed: ${error.message}\n`);
  process.exitCode = 1;
}
