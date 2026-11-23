import { topicNames, eras } from "./taxonomy";
import { z } from "zod";
import { modelAssetSchema } from "./model-asset";
import { sceneProgramSchema, validateSceneProgram } from "@/features/player/scene-schema";

const text = z.string().min(1);
const imagePath = z.string().regex(/^\/images\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|svg)$/);
const sourceUrl = z.url().startsWith("https://");

// A complete prepared story is input data, including composition choices.
// Importing it never chooses forms by slug, writes UI, or calls a provider.
export const preparedStorySchema = z.strictObject({
  version: z.literal(2),
  models: z.array(modelAssetSchema).max(10).default([]),
  summary: z.strictObject({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: text.max(120),
    question: text.max(240),
    description: text.max(800),
    image: imagePath,
    imageAlt: text.max(500),
    topic: z.enum(topicNames),
    era: z.enum(eras),
    period: text.max(120),
    scope: text.max(240),
    minutes: z.number().int().positive().max(120),
    chapters: z
      .array(z.strictObject({ title: text.max(160), question: text.max(240) }))
      .min(1)
      .max(20),
    sourceLabel: text.max(160),
    sample: z.literal(true),
  }),
  lesson: z.strictObject({
    preview: z.literal(true),
    sources: z
      .array(
        z.strictObject({
          name: text.max(200),
          title: text.max(300),
          url: sourceUrl,
          type: text.max(120),
          supports: text.max(1200),
        }),
      )
      .min(1)
      .max(40),
    scenes: z
      .array(
        z.strictObject({
          id: text.max(100),
          chapter: z.number().int().nonnegative(),
          title: text.max(180),
          deck: text.max(500),
          text: z.array(text.max(6000)).min(1).max(20),
          kind: text.max(80),
          sources: z.array(z.number().int().nonnegative()).min(1),
          note: text.max(1000).optional(),
        }),
      )
      .min(1)
      .max(60),
  }),
  assets: z
    .array(
      z.strictObject({
        src: imagePath,
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        credit: text,
        record: sourceUrl,
        license: text,
        treatment: z.enum(["historical-image", "modern-photograph", "reconstruction", "diagram"]),
      }),
    )
    .min(1)
    .max(100),
  programs: z.array(sceneProgramSchema).min(1).max(60),
});
export type PreparedStory = z.infer<typeof preparedStorySchema>;

export function parsePreparedStory(input: unknown): PreparedStory {
  const story = preparedStorySchema.parse(input);
  const assets = new Map(story.assets.map((asset) => [asset.src, asset]));
  if (assets.size !== story.assets.length) throw new Error("Duplicate prepared asset");
  if (!assets.has(story.summary.image)) throw new Error("Cover references an unregistered asset");
  if (new Set(story.models.map((m) => m.id)).size !== story.models.length)
    throw new Error("Duplicate model ID");
  for (const model of story.models)
    if (!assets.has(model.poster)) throw new Error("Model poster must be a registered image");
  const ids = new Set<string>();
  const presented = new Set<string>();
  if (story.programs.length !== story.lesson.scenes.length)
    throw new Error("Every scene needs one complete program");
  for (const [index, scene] of story.lesson.scenes.entries()) {
    if (ids.has(scene.id)) throw new Error("Duplicate prepared scene ID");
    ids.add(scene.id);
    if (!story.summary.chapters[scene.chapter])
      throw new Error("Scene references an unknown chapter");
    if (scene.sources.some((i) => !story.lesson.sources[i]))
      throw new Error("Scene references an unknown source");
    const program = validateSceneProgram(
      story.programs[index],
      scene.text.length,
      story.lesson.sources.length,
    );
    if (program.sceneId !== scene.id) throw new Error("Program and scene IDs disagree");
    for (const beat of program.beats) {
      if (beat.image && (!beat.imageAlt || !beat.caption))
        throw new Error("Scene image needs alt text and credit");
      if (
        beat.type === "timeline" &&
        beat.events.some((e) => e.image && (!e.imageAlt || !e.caption))
      )
        throw new Error("Timeline images need their own alt text and credit");
      const visual = beat.type === "object" ? beat.objectId : beat.image;
      if (visual && presented.has(visual) && !beat.reuseReason)
        throw new Error("Repeated primary media needs an editorial reuseReason");
      if (visual) presented.add(visual);

      if (beat.type === "object") {
        const model = story.models.find((m) => m.id === beat.objectId);
        if (!model) throw new Error("Scene references an unregistered model");
        if (beat.composition === "object-guided" && model.views.length < 2)
          throw new Error("Guided object needs two camera views");
      }
      const images = [
        beat.image,
        ...(beat.type === "comparison" ? [beat.left.image, beat.right.image] : []),
        ...(beat.type === "timeline" ? beat.events.map((event) => event.image) : []),
      ];
      for (const image of images)
        if (image && !assets.has(image))
          throw new Error("Scene references an unregistered asset: " + image);
      const asset = beat.image ? assets.get(beat.image) : undefined;
      if (
        (beat.imageWidth !== undefined && beat.imageWidth !== asset?.width) ||
        (beat.imageHeight !== undefined && beat.imageHeight !== asset?.height)
      )
        throw new Error("Scene image dimensions disagree with its asset");
    }
  }
  if (
    story.summary.chapters.some((_, i) => !story.lesson.scenes.some((scene) => scene.chapter === i))
  )
    throw new Error("Chapter has no scenes");
  return story;
}
