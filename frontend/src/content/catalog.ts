import { preparedSummaries } from "./prepared-catalog";
export type Topic =
  | "Trade & connection"
  | "Art & ideas"
  | "Science & invention"
  | "People & daily life";
export type Era = "ancient" | "medieval" | "early-modern" | "modern";
export type StorySummary = {
  slug: string;
  title: string;
  question: string;
  description: string;
  image: string;
  imageAlt: string;
  topic: Topic;
  era: Era;
  period: string;
  scope: string;
  minutes: number;
  sceneCount?: number;
  chapters: readonly { title: string; question: string }[];
  sourceLabel: string;
  sample: true;
};

// Prepared catalog fixtures for the static frontend. Counts and availability do not represent a live service.
export const stories: readonly StorySummary[] = preparedSummaries;
export const topics: readonly Topic[] = [
  "Trade & connection",
  "Art & ideas",
  "Science & invention",
  "People & daily life",
];
export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export function getSceneCount(story: StorySummary) {
  return story.sceneCount ?? story.chapters.length;
}
