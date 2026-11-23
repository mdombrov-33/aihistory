import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const app = path.join(root, ".next/server/app");
const routes = JSON.parse(await readFile(path.join(root, ".next/routes-manifest.json"), "utf8"));
const exists = async (file) => {
  await access(file);
};
async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) =>
      e.isDirectory()
        ? htmlFiles(path.join(dir, e.name))
        : e.name.endsWith(".html")
          ? [path.join(dir, e.name)]
          : [],
    ),
  );
  return nested.flat();
}
const pages = (await htmlFiles(app)).filter(
  (file) => !path.basename(file).startsWith("_global-error"),
);
let imageUses = 0,
  fontUses = 0,
  localLinks = 0;
for (const file of pages) {
  const html = await readFile(file, "utf8");
  assert(/<html[^>]*lang="en"/.test(html), `${file}: missing document language`);
  assert(/<title>[^<]+<\/title>/.test(html), `${file}: missing page title`);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /\balt="[^"]*"/);
    const src = match[0].match(/\bsrc="([^"]+)"/)?.[1];
    if (!src) continue;
    const url = new URL(src.replaceAll("&amp;", "&"), "http://local.test");
    if (url.pathname === "/_next/image") {
      const image = url.searchParams.get("url");
      assert(image?.startsWith("/images/"));
      await exists(path.join(root, "public", image));
      imageUses++;
    } else if (url.pathname.startsWith("/images/")) {
      await exists(path.join(root, "public", url.pathname));
      imageUses++;
    }
  }
  for (const match of html.matchAll(/href="(\/_next\/static\/media\/[^"?]+)(?:[^"\s]*)"/g)) {
    await exists(path.join(root, ".next", match[1].slice("/_next/".length)));
    fontUses++;
  }
  for (const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)) {
    const pathname = new URL(match[1].replaceAll("&amp;", "&"), "http://local.test").pathname;
    assert(
      routes.staticRoutes.some((r) => new RegExp(r.regex).test(pathname)) ||
        routes.dynamicRoutes.some((r) => new RegExp(r.regex).test(pathname)),
      `${path.relative(root, file)} links to missing route ${pathname}`,
    );
    localLinks++;
  }
}
assert(imageUses > 10);
assert(fontUses > 0);
assert.equal((await readFile(path.join(root, "../README.md"))).length, 0);
console.log(
  `Built HTML check passed: ${pages.length} prerendered pages, ${imageUses} image uses, ${fontUses} font references and ${localLinks} internal links. This does not verify browser interactions or layout.`,
);
