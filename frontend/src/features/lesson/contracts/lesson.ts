// Shared narrative/source types derived from the validated prepared bundle.

import type { PreparedStory } from "./bundle";

export type Source = PreparedStory["lesson"]["sources"][number];

export type LessonScene = PreparedStory["lesson"]["scenes"][number];

export type Lesson = Omit<PreparedStory["lesson"], "preview"> & { preview?: boolean };
