// Exercises the real guest store after separating its schema, storage and actions.

import { test, expect } from "@playwright/test";
import { initial, stateSchema, storageKey } from "../../src/state/guest/schema";
import { getJourneySnapshot, updateJourney } from "../../src/state/guest/store";
import {
  addBookmark,
  clearJourney,
  saveProgress,
  toggleSaved,
} from "../../src/state/guest/actions";

test("the persisted guest envelope keeps its identity and accepts existing optional defaults", () => {
  expect(storageKey).toBe("history-worlds:journey:v1");

  const { labs, constructions, interactions, ...older } = initial;

  expect(stateSchema.parse(older)).toEqual(initial);
  expect(stateSchema.parse({ ...initial, constructions: { invalid: {} } }).constructions).toEqual(
    {},
  );
});

test("guest actions still share one snapshot, persist updates and tolerate unavailable storage", () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

  const saved = new Map<string, string>([
    [storageKey, JSON.stringify({ ...initial, saved: ["camera"] })],
  ]);

  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
    },
  });

  try {
    expect(getJourneySnapshot().saved).toEqual(["camera"]);
    saveProgress("camera", 2, 1, true);
    saveProgress("camera", 0, 0);
    expect(getJourneySnapshot().progress.camera.finished).toBe(true);
    expect(addBookmark("camera", 2, 1, "A position")).toBe(true);
    expect(addBookmark("camera", 2, 1, "Same position")).toBe(false);
    toggleSaved("camera");
    expect(getJourneySnapshot().saved).toEqual([]);
    expect(stateSchema.parse(JSON.parse(saved.get(storageKey)!))).toEqual(getJourneySnapshot());
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("Storage denied");
      },
    });
    expect(() => updateJourney((value) => ({ ...value, largerText: true }))).not.toThrow();
    expect(getJourneySnapshot().largerText).toBe(true);
    clearJourney();
    expect(getJourneySnapshot()).toEqual(initial);
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");

    if (storageDescriptor) Object.defineProperty(globalThis, "localStorage", storageDescriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
