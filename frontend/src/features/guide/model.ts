// Explainable recommendations use chosen interests and visible catalog metadata only.

import type { StorySummary } from "@/features/lesson/contracts/catalog";

export function guideSuggestions(
  catalog: readonly StorySummary[],
  interests: readonly string[],
  excluded: readonly string[],
) {
  return catalog
    .filter((s) => !excluded.includes(s.slug))
    .map((story) => ({
      story,
      reason: interests.includes(story.topic)
        ? "Matches your interest in " + story.topic.toLowerCase()
        : "A starting point from the library",
      score: interests.includes(story.topic) ? 1 : 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function moveLesson(items: readonly string[], index: number, direction: -1 | 1) {
  const next = [...items],
    target = index + direction;

  if (index < 0 || target < 0 || index >= items.length || target >= items.length) return next;

  [next[index], next[target]] = [next[target], next[index]];

  return next;
}
