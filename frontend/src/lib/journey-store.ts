"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

const progressSchema = z.object({
  scene: z.number().int().min(0).max(99),
  passage: z.number().int().min(0).max(20),
  finished: z.boolean(),
  updatedAt: z.number(),
});
const bookmarkSchema = z.object({
  id: z.string(),
  story: z.string(),
  scene: z.number().int().min(0).max(99),
  passage: z.number().int().min(0).max(20),
  label: z.string(),
  createdAt: z.number(),
});
const creationSchema = z.object({
  id: z.string(),
  question: z.string().max(600),
  scope: z.string().max(200),
  status: z.enum(["preparing", "ready"]),
  createdAt: z.number(),
});
const stateSchema = z.object({
  progress: z.record(z.string(), progressSchema),
  bookmarks: z.array(bookmarkSchema),
  saved: z.array(z.string()),
  labs: z
    .record(
      z.string().max(250),
      z.record(
        z.string().max(100),
        z.union([
          z.number().finite(),
          z.boolean(),
          z.string().max(100),
          z.array(z.number().finite()).max(16),
        ]),
      ),
    )
    .default({}),
  interactions: z.record(z.string(), z.number().int().min(0).max(20)).default({}),
  creations: z.array(creationSchema),
  sound: z.object({
    master: z.number().min(0).max(100),
    narration: z.number().min(0).max(100),
    music: z.number().min(0).max(100),
    environment: z.number().min(0).max(100),
  }),
  reduceMotion: z.boolean(),
  largerText: z.boolean(),
});
export type JourneyState = z.infer<typeof stateSchema>;
export type Sound = JourneyState["sound"];
export type Bookmark = JourneyState["bookmarks"][number];
export const storageKey = "history-worlds:journey:v1";
const initial: JourneyState = {
  progress: {},
  bookmarks: [],
  saved: [],
  labs: {},
  interactions: {},
  creations: [],
  sound: { master: 80, narration: 100, music: 0, environment: 0 },
  reduceMotion: false,
  largerText: false,
};
let state = initial;
let loaded = false;
const listeners = new Set<() => void>();
function snapshot() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      const result = stateSchema.safeParse(JSON.parse(localStorage.getItem(storageKey) || "null"));
      if (result.success) state = result.data;
    } catch {
      /* Guest storage is best effort. */
    }
  }
  return state;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function emit(next: JourneyState) {
  state = next;
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    /* In-memory interaction still works when storage is unavailable. */
  }
  listeners.forEach((listener) => listener());
}
export function useJourney() {
  return useSyncExternalStore(subscribe, snapshot, () => initial);
}
export function updateJourney(update: (current: JourneyState) => JourneyState) {
  emit(update(snapshot()));
}
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
  const current = snapshot();
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
  emit({ ...initial });
}
