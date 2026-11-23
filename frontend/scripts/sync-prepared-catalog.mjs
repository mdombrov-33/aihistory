import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const folder = path.join(root, "src/content/showcases");
const output = path.join(root, "src/content/showcase-catalog.generated.json");
const files = (await readdir(folder)).filter(file => file.endsWith(".json")).sort();
const summaries = await Promise.all(files.map(async file => {
  const bundle = JSON.parse(await readFile(path.join(folder, file), "utf8"));
  if (!bundle.summary || typeof bundle.summary.slug !== "string") throw new Error("Missing summary: " + file);
  return { ...bundle.summary, sceneCount: bundle.lesson.scenes.length };
}));
const contents = JSON.stringify(summaries, null, 2) + "\n";
if (process.argv.includes("--check")) {
  const current = await readFile(output, "utf8").catch(() => "");
  if (current !== contents) throw new Error("Prepared catalog is stale. Run node scripts/sync-prepared-catalog.mjs");
} else {
  await writeFile(output, contents);
}
