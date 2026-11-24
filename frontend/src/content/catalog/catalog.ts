// Discovery queries over prepared metadata without importing complete lesson bundles.

import { preparedSummaries } from "./prepared-catalog";
import { topicNames } from "@/features/lesson/contracts/taxonomy";
import type { StorySummary, Topic } from "@/features/lesson/contracts/catalog";

// Prepared catalog fixtures for the static frontend. Counts and availability do not represent a live service.
export const stories: readonly StorySummary[] = preparedSummaries;
export const topics: readonly Topic[] = topicNames;

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export function getSceneCount(story: StorySummary) {
  return story.sceneCount ?? story.chapters.length;
}
