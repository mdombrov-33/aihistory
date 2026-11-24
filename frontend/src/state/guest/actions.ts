"use client";

// Guest progress, bookmarks and saved-story actions applied through the shared store.

import { initial } from "./schema";
import { writeJourney, getJourneySnapshot, updateJourney } from "./store";

export function saveProgress(story: string, scene: number, passage: number, finished = false) {
  updateJourney((current) => ({
    ...current,
    progress: {
      ...current.progress,
      [story]: {
        scene,
        passage,
        finished: finished || current.progress[story]?.finished || false,
        updatedAt: Date.now(),
      },
    },
  }));
}

export function toggleSaved(story: string) {
  updateJourney((current) => ({
    ...current,
    saved: current.saved.includes(story)
      ? current.saved.filter((id) => id !== story)
      : [...current.saved, story],
  }));
}

export function addBookmark(story: string, scene: number, passage: number, label: string) {
  const current = getJourneySnapshot();

  if (
    current.bookmarks.some(
      (item) => item.story === story && item.scene === scene && item.passage === passage,
    )
  )
    return false;

  updateJourney((value) => ({
    ...value,
    bookmarks: [
      ...value.bookmarks,
      { id: crypto.randomUUID(), story, scene, passage, label, createdAt: Date.now() },
    ],
  }));

  return true;
}

export function removeBookmark(id: string) {
  updateJourney((current) => ({
    ...current,
    bookmarks: current.bookmarks.filter((item) => item.id !== id),
  }));
}

export function clearJourney() {
  writeJourney({ ...initial });
}
