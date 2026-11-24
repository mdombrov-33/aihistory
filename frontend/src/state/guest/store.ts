"use client";

// Single guest-state owner: validated loading, React subscription and best-effort persistence.

import { useSyncExternalStore } from "react";
import { initial, stateSchema, storageKey, type JourneyState } from "./schema";

let state = initial;
let loaded = false;
const listeners = new Set<() => void>();

export function getJourneySnapshot() {
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

export function writeJourney(next: JourneyState) {
  state = next;

  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    /* In-memory interaction still works when storage is unavailable. */
  }

  listeners.forEach((listener) => listener());
}

export function useJourney() {
  return useSyncExternalStore(subscribe, getJourneySnapshot, () => initial);
}

export function updateJourney(update: (current: JourneyState) => JourneyState) {
  writeJourney(update(getJourneySnapshot()));
}
