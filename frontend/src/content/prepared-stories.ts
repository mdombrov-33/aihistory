import packet from "./showcases/a-packets-journey.json";
import camera from "./showcases/camera-opened-up.json";
import pendulum from "./showcases/a-swing-in-time.json";
import sound from "./showcases/shape-a-sound.json";
import logic from "./showcases/signals-and-decisions.json";
import signal from "./showcases/shape-of-a-signal.json";
import wave from "./showcases/great-wave-made-by-hand.json";
import pompeii from "./showcases/pompeii.json";
import photography from "./showcases/invention-of-photography.json";
import { parsePreparedStory } from "@/story/prepared-story";

// Complete bundles are consumed by server-side content routes and tests.
export const preparedStories = [
  packet,
  camera,
  pendulum,
  sound,
  logic,
  wave,
  signal,
  pompeii,
  photography,
].map(parsePreparedStory);
const bySlug = new Map(preparedStories.map((story) => [story.summary.slug, story]));
if (bySlug.size !== preparedStories.length) throw new Error("Duplicate prepared story slug");
export function getPreparedStory(slug: string) {
  return bySlug.get(slug);
}
