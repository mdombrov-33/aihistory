import {
  assemblySchema,
  experimentSchema,
  soundSchema,
  systemSchema,
} from "@/features/learning/schema";
import { z } from "zod";
import { travelerSchema } from "@/features/learning/packet-model";
import { constructionSchema } from "@/features/learning/construction-model";
import { revealSchema } from "./reveal-schema";
import { compositions, compositionIds } from "@/story/compositions";
const asset = z.string().regex(/^\/images\/[a-zA-Z0-9/_-]+\.(webp|png|jpg)$/);
const point = z.number().min(0).max(100);
const crop = z
  .strictObject({
    x: point,
    y: point,
    width: z.number().positive().max(100),
    height: z.number().positive().max(100),
  })
  .refine(
    (c) => c.x + c.width <= 100 && c.y + c.height <= 100,
    "Crop lies outside the source image",
  );
const imageFields = {
  image: asset.optional(),
  imageAlt: z.string().max(500).optional(),
  caption: z.string().max(240).optional(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
  imageFit: z.enum(["contain", "cover"]).optional(),
  focalPoint: z.tuple([point, point]).optional(),
};
const common = {
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(180),
  purpose: z.string().min(10).max(500),
  composition: z.enum(compositionIds),
  sourceIndices: z.array(z.number().int().nonnegative()).min(1),
  reuseReason: z.string().min(10).max(500).optional(),
  passageStart: z.number().int().nonnegative(),
  passageEnd: z.number().int().nonnegative(),
  ...imageFields,
};
const visual = {
  ...common,
  image: asset,
  imageAlt: z.string().min(1).max(500),
  caption: z.string().max(240),
};
const annotation = z.strictObject({
  id: z.string().min(1),
  label: z.string().min(1).max(70),
  x: point,
  y: point,
  title: z.string().max(120),
  body: z.string().max(600),
  crop: crop.optional(),
});
const side = z.strictObject({
  image: asset,
  alt: z.string().max(500),
  label: z.string().max(100),
  explanation: z.string().max(600),
});
export const sceneBeatSchema = z.discriminatedUnion("type", [
  z.strictObject({ ...common, type: z.literal("traveler"), traveler: travelerSchema }),
  z.strictObject({ ...common, type: z.literal("construction"), construction: constructionSchema }),
  z.strictObject({ ...common, type: z.literal("assembly"), assembly: assemblySchema }),
  z.strictObject({ ...common, type: z.literal("experiment"), experiment: experimentSchema }),
  z.strictObject({ ...common, type: z.literal("sound"), sound: soundSchema }),
  z.strictObject({ ...common, type: z.literal("system"), system: systemSchema }),
  z.strictObject({
    ...common,
    type: z.literal("object"),
    objectId: z.string().regex(/^[a-z0-9-]+$/),
  }),
  z.strictObject({
    ...visual,
    type: z.literal("photograph"),
    sourceUrl: z.url().startsWith("https://"),
    observation: z.string().max(600),
  }),
  z.strictObject({
    ...common,
    type: z.literal("journey"),
    stages: z
      .array(
        z.strictObject({ title: z.string().min(1), body: z.string().min(1), date: z.string() }),
      )
      .min(2)
      .max(6),
  }),
  z.strictObject({
    ...visual,
    type: z.literal("place"),
    places: z.array(annotation).min(1).max(5),
  }),
  z.strictObject({
    ...visual,
    type: z.literal("illustrated"),
    annotations: z.array(annotation).max(5),
    reveal: revealSchema.optional(),
  }),
  z.strictObject({
    ...common,
    type: z.literal("atlas"),
    map: z.strictObject({
      note: z.string().max(300),
      locations: z
        .array(
          z.strictObject({
            id: z.string().min(1),
            name: z.string().max(80),
            coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-85).max(85)]),
            description: z.string().max(600),
          }),
        )
        .min(2)
        .max(10),
      states: z
        .array(
          z.strictObject({
            label: z.string().min(1),
            description: z.string().max(600),
            activeLocations: z.array(z.string()).min(1),
          }),
        )
        .min(2)
        .max(8)
        .optional(),
    }),
  }),
  z.strictObject({
    ...common,
    type: z.literal("evidence"),
    record: z.strictObject({
      sourceIndex: z.number().int().nonnegative(),
      title: z.string().max(150),
      date: z.string().max(80),
      material: z.string().max(100),
      status: z.enum(["reconstruction", "source-record"]),
      interpretation: z.string().max(800),
      limitation: z.string().max(500),
      quote: z.string().max(200).optional(),
    }),
  }),
  z.strictObject({
    ...common,
    type: z.literal("comparison"),
    left: side,
    right: side,
    note: z.string().max(300),
  }),
  z.strictObject({
    ...common,
    type: z.literal("timeline"),
    events: z
      .array(
        z.strictObject({
          date: z.string().max(80),
          title: z.string().max(100),
          body: z.string().max(600),
          image: asset.optional(),
          imageAlt: z.string().max(500).optional(),
          caption: z.string().max(240).optional(),
        }),
      )
      .min(2)
      .max(8),
    note: z.string().max(300),
  }),
]);
export type SceneBeat = z.infer<typeof sceneBeatSchema>;
export type SceneType = SceneBeat["type"];
export const sceneProgramSchema = z.strictObject({
  sceneId: z.string().min(1),
  beats: z.array(sceneBeatSchema).min(1).max(12),
});
export type SceneProgram = z.infer<typeof sceneProgramSchema>;
export function validateSceneProgram(
  input: unknown,
  paragraphCount: number,
  sourceCount: number,
): SceneProgram {
  const program = sceneProgramSchema.parse(input);
  const ids = new Set<string>();
  let next = 0;
  for (const beat of program.beats) {
    if (ids.has(beat.id)) throw new Error("Duplicate scene beat: " + beat.id);
    ids.add(beat.id);
    if (beat.passageStart !== next || beat.passageEnd < beat.passageStart)
      throw new Error("Scene beats must cover reading passages once, in order");
    if (!compositions[beat.composition].families.includes(beat.type))
      throw new Error("Composition does not support this scene family");
    if (
      beat.composition === "layer-reveal" &&
      (beat.type !== "illustrated" || !beat.reveal || beat.annotations.length)
    )
      throw new Error("Layer reveal needs a guide without competing hotspots");
    if (beat.type === "illustrated" && beat.reveal && beat.composition !== "layer-reveal")
      throw new Error("Reveal guide needs its registered composition");
    if (
      beat.composition === "assembly-motion" &&
      (beat.type !== "assembly" || !beat.assembly.motion)
    )
      throw new Error("Moving assembly needs named-part motion");
    if (beat.type === "assembly" && beat.assembly.motion && beat.composition !== "assembly-motion")
      throw new Error("Assembly motion needs its registered composition");
    if (beat.sourceIndices.some((i) => i >= sourceCount))
      throw new Error("Scene references an unknown source");
    if (beat.type === "evidence" && beat.record.sourceIndex >= sourceCount)
      throw new Error("Evidence scene references an unknown source");
    if (beat.composition === "quotation-focus" && (beat.type !== "evidence" || !beat.record.quote))
      throw new Error("Quotation composition needs a source quotation");
    if (["document-desk", "portrait-study"].includes(beat.composition) && !beat.image)
      throw new Error("Document composition needs a source image");
    if (beat.composition === "detail-study") {
      const points =
        beat.type === "place" ? beat.places : beat.type === "illustrated" ? beat.annotations : [];
      if (!points.length || points.some((p) => !p.crop))
        throw new Error("Detail study needs explicit image crop regions");
    }
    if (beat.type === "atlas") {
      const places = new Set(beat.map.locations.map((p) => p.id));
      if (places.size !== beat.map.locations.length) throw new Error("Duplicate map location");
      if (beat.map.states?.some((s) => s.activeLocations.some((id) => !places.has(id))))
        throw new Error("Map state references unknown locations");
      if (beat.composition === "map-change" && !beat.map.states)
        throw new Error("Changing map needs states");
    }
    if (
      beat.type === "timeline" &&
      beat.composition === "timeline-gallery" &&
      beat.events.some((e) => !e.image || !e.imageAlt || !e.caption)
    )
      throw new Error("Timeline gallery needs identified images");
    next = beat.passageEnd + 1;
  }
  if (next !== paragraphCount) throw new Error("Scene reading coverage is incomplete");
  return program;
}
