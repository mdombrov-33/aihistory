// Persisted guest-state envelope, defaults and unchanged local-storage identity.

import { z } from "zod";
import { constructionDraftSchema } from "@/features/lesson/interactions/logic/construction-model";

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

export const stateSchema = z.object({
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
  constructions: z.record(z.string().max(250), constructionDraftSchema).default({}).catch({}),
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

export const initial: JourneyState = {
  progress: {},
  bookmarks: [],
  saved: [],
  labs: {},
  constructions: {},
  interactions: {},
  creations: [],
  sound: { master: 80, narration: 100, music: 0, environment: 0 },
  reduceMotion: false,
  largerText: false,
};
