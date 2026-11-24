// Shared catalog types derived from the bundle schema.

import type { PreparedStory } from "./bundle";

export type Topic = PreparedStory["summary"]["topic"];

export type Era = PreparedStory["summary"]["era"];

export type StorySummary = Omit<PreparedStory["summary"], "chapters"> & {
  chapters: readonly PreparedStory["summary"]["chapters"][number][];
  sceneCount?: number;
};
