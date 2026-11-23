import { getPreparedStory } from "@/content/prepared-stories";
import type { Lesson } from "@/content/lessons";
import type { StorySummary } from "@/content/catalog";
import { validateSceneProgram } from "./scene-schema";
export function buildSceneProgram(story: StorySummary, lesson: Lesson, index: number) {
  const program = getPreparedStory(story.slug)?.programs[index];
  if (!program) throw new Error("Prepared scene program is missing");
  return validateSceneProgram(program, lesson.scenes[index].text.length, lesson.sources.length);
}
