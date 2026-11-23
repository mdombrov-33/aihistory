import { getPreparedStory } from "./prepared-stories";
export type Source = { name: string; title: string; url: string; type: string; supports: string };
export type LessonScene = {
  id: string;
  chapter: number;
  title: string;
  deck: string;
  text: string[];
  kind: string;
  sources: number[];
  note?: string;
};
export type Lesson = { scenes: LessonScene[]; sources: Source[]; preview?: boolean };
export function getLesson(slug: string): Lesson | undefined {
  return getPreparedStory(slug)?.lesson;
}
export function chapterScene(slug: string, chapter: number) {
  return getLesson(slug)?.scenes.findIndex((s) => s.chapter === chapter) ?? 0;
}
