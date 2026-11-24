// Validates supplied schematic primitives and their optional named-part motion.

import { z } from "zod";
import { motionSchema } from "./motion-definition";

const label = z.string().min(1).max(100);
const explanation = z.string().min(10).max(700);

const vector = z.tuple([
  z.number().min(-8).max(8),
  z.number().min(-8).max(8),
  z.number().min(-8).max(8),
]);

const size = z.tuple([
  z.number().min(0.03).max(5),
  z.number().min(0.03).max(5),
  z.number().min(0.03).max(5),
]);

export const assemblySchema = z
  .strictObject({
    description: explanation,
    motion: motionSchema.optional(),
    parts: z
      .array(
        z.strictObject({
          id: z.string().regex(/^[a-z][a-z0-9-]*$/),
          label,
          explanation,
          shape: z.enum(["box", "cylinder", "sphere", "ring"]),
          position: vector,
          separation: vector,
          size,
          color: z.enum(["ink", "amber", "teal", "paper"]),
        }),
      )
      .min(2)
      .max(16),
  })
  .superRefine((value, ctx) => {
    if (new Set(value.parts.map((p) => p.id)).size !== value.parts.length)
      ctx.addIssue({ code: "custom", message: "Assembly part IDs must be unique" });

    if (value.motion?.tracks.some((track) => !value.parts.some((part) => part.id === track.partId)))
      ctx.addIssue({ code: "custom", message: "Motion references an unknown part" });
  });

export type Assembly = z.infer<typeof assemblySchema>;
