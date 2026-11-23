import signal from "./showcases/shape-of-a-signal.json";
import wave from "./showcases/great-wave-made-by-hand.json";
import pompeii from "./showcases/pompeii.json";
import photography from "./showcases/invention-of-photography.json";
import { parsePreparedStory } from "@/story/prepared-story";

// Complete bundles are consumed by server-side content routes and tests.
export const preparedStories = [wave, signal, pompeii, photography].map(parsePreparedStory);
const bySlug = new Map(preparedStories.map((story) => [story.summary.slug, story]));
if (bySlug.size !== preparedStories.length) throw new Error("Duplicate prepared story slug");
export function getPreparedStory(slug: string) {
  return bySlug.get(slug);
}
