// Product previews preserve legacy guest data and never become paid authorization.

import { test, expect } from "@playwright/test";
import { stateSchema, initial } from "../../src/state/guest/schema";
import { productSchema, productInitial, profileSchema } from "../../src/state/guest/product";
import { remainingUsage } from "../../src/features/membership/model";
import { safeDestination } from "../../src/lib/navigation";
import { guideSuggestions, moveLesson } from "../../src/features/guide/model";
import { normalizeOutline } from "../../src/features/creation/creation-plan";
import { stories } from "../../src/content/catalog/catalog";

test("old guest data gains product defaults without losing exact saved positions", () => {
  const { product: _product, ...legacy } = initial;

  const parsed = stateSchema.parse({
    ...legacy,
    progress: { example: { scene: 2, passage: 1, finished: false, updatedAt: 100 } },
    creations: [
      {
        id: "q",
        question: "Why does this work?",
        scope: "An introduction",
        status: "preparing",
        createdAt: 100,
      },
    ],
  });

  expect(parsed.product).toEqual(productInitial);
  expect(parsed.progress.example.passage).toBe(1);
  expect(parsed.creations[0].previewStage).toBe("outline");
  expect(parsed.creations[0].outline).toEqual([]);
});
test("a damaged product preview cannot discard the guest library", () => {
  const result = stateSchema.parse({
    ...initial,
    saved: ["great-wave-made-by-hand"],
    product: { membership: "administrator" },
  });

  expect(result.saved).toEqual(["great-wave-made-by-hand"]);
  expect(result.product).toEqual(productInitial);

  const parsed = productSchema.parse({
    profile: {
      name: "Reader",
      email: "reader@example.test",
      verified: true,
      password: "must-not-be-retained",
    },
  });

  expect(parsed.profile).not.toHaveProperty("password");
  expect(
    productSchema.safeParse({ usage: { lessons: -1, questions: 0, paused: false } }).success,
  ).toBe(false);
});
test("trail ordering preserves content, respects boundaries and suggestions use chosen interests", () => {
  const items = ["first", "second", "third"];

  expect(moveLesson(items, 1, -1)).toEqual(["second", "first", "third"]);
  expect(moveLesson(items, 0, -1)).toEqual(items);
  expect(items).toEqual(["first", "second", "third"]);

  const target = stories.find((s) => s.topic === "Art & ideas")!;
  const suggestions = guideSuggestions(stories, ["Art & ideas"], []);

  expect(suggestions[0].story.slug).toBe(target.slug);
  expect(suggestions[0].reason).toContain("your interest");
  expect(
    guideSuggestions(stories, [], [target.slug]).some((s) => s.story.slug === target.slug),
  ).toBe(false);
});
test("usage stays bounded and return paths stay within the app", () => {
  expect(remainingUsage(50, 8)).toBe(0);
  expect(remainingUsage(-2, 8)).toBe(8);

  for (const bad of ["https://outside.test", "//outside.test", "/\\outside.test"])
    expect(safeDestination(bad)).toBe("/account");

  expect(safeDestination("/guide?add=example")).toBe("/guide?add=example");
  expect(normalizeOutline([" Opening ", "", " Example "])).toEqual(["Opening", "Example"]);
});

test("an invalid saved profile recovers without clearing personal trails or model choices", () => {
  expect(profileSchema.safeParse({ name: "Reader", email: "a@b", verified: false }).success).toBe(
    false,
  );

  const product = {
    ...productInitial,
    profile: { name: "Reader", email: "a@b", verified: false },
    models: { writing: "openai", imagery: "default", narration: "default" },
    trails: [
      {
        id: "trail",
        title: "A path",
        question: "How does it connect?",
        lessons: [],
        notes: "Private notes",
        updatedAt: 100,
      },
    ],
  };

  const parsed = stateSchema.parse({ ...initial, product });

  expect(parsed.product.profile).toBe(null);
  expect(parsed.product.trails[0].notes).toBe("Private notes");
  expect(parsed.product.trails[0].questions).toEqual([]);
  expect(parsed.product.models.writing).toBe("openai");
});
