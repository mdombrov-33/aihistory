// Server-side access to prepared narratives and chapter starting positions.

import { getPreparedStory } from "./lessons/registry";
import type { Lesson } from "@/features/lesson/contracts/lesson";

export function getLesson(slug: string): Lesson | undefined {
  return getPreparedStory(slug)?.lesson;
}

export function chapterScene(slug: string, chapter: number) {
  return getLesson(slug)?.scenes.findIndex((s) => s.chapter === chapter) ?? 0;
}
