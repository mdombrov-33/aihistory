// Loads and validates the prepared screen program selected by a route.

import { getPreparedStory } from "@/content/lessons/registry";
import type { Lesson } from "@/features/lesson/contracts/lesson";
import type { StorySummary } from "@/features/lesson/contracts/catalog";
import { validateSceneProgram } from "../contracts/scene";

export function buildSceneProgram(story: StorySummary, lesson: Lesson, index: number) {
  const program = getPreparedStory(story.slug)?.programs[index];

  if (!program) throw new Error("Prepared scene program is missing");

  return validateSceneProgram(program, lesson.scenes[index].text.length, lesson.sources.length);
}
