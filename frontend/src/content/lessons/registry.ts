// Server-side registry of complete prepared lessons; discovery uses the lighter catalog.

import packet from "./a-packets-journey.json";
import camera from "./camera-opened-up.json";
import pendulum from "./a-swing-in-time.json";
import sound from "./shape-a-sound.json";
import logic from "./signals-and-decisions.json";
import signal from "./shape-of-a-signal.json";
import wave from "./great-wave-made-by-hand.json";
import pompeii from "./pompeii.json";
import photography from "./invention-of-photography.json";
import { parsePreparedStory } from "@/features/lesson/contracts/bundle";

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
