// Validated local product previews: account, membership, learning trails and community drafts.

import { z } from "zod";

export const trailSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120),
  question: z.string().max(600),
  lessons: z.array(z.string()).max(30),
  questions: z.array(z.string()).max(30).default([]),
  notes: z.string().max(3000).default(""),
  updatedAt: z.number(),
});

export const reviewSchema = z.object({
  liked: z.boolean().default(false),
  ratings: z
    .object({
      clarity: z.number().int().min(0).max(5),
      presentation: z.number().int().min(0).max(5),
      interaction: z.number().int().min(0).max(5),
    })
    .default({ clarity: 0, presentation: 0, interaction: 0 }),
  comments: z
    .array(
      z.object({
        id: z.string(),
        body: z.string().min(1).max(2000),
        author: z.string().max(80),
        createdAt: z.number(),
        edited: z.boolean().default(false),
      }),
    )
    .max(100)
    .default([]),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  verified: z.boolean(),
});

export const productSchema = z.object({
  profile: profileSchema.nullable().default(null).catch(null),
  membership: z.enum(["free", "premium", "canceling"]).default("free"),
  usage: z
    .object({
      lessons: z.number().int().min(0),
      questions: z.number().int().min(0),
      paused: z.boolean(),
    })
    .default({ lessons: 0, questions: 0, paused: false }),
  interests: z.array(z.string()).max(20).default([]),
  trails: z.array(trailSchema).max(30).default([]),
  reviews: z.record(z.string(), reviewSchema).default({}),
  sharing: z
    .record(
      z.string(),
      z.object({
        visibility: z.enum(["private", "link", "public"]),
        token: z.string(),
        submitted: z.boolean().default(false),
      }),
    )
    .default({}),
  reports: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().max(200),
        reason: z.string(),
        detail: z.string().max(2000),
        createdAt: z.number(),
      }),
    )
    .max(100)
    .default([]),
  models: z
    .object({
      writing: z.enum(["default", "openai", "openrouter"]),
      imagery: z.enum(["default", "openai"]),
      narration: z.enum(["default", "gemini"]),
    })
    .default({ writing: "default", imagery: "default", narration: "default" }),
});

export const productInitial = productSchema.parse({});

export type ProductState = z.infer<typeof productSchema>;

export type Trail = z.infer<typeof trailSchema>;
