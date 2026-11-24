// Validated parameter choices for the registered thin-lens and pendulum models.

import { z } from "zod";

export const experimentSchema = z.discriminatedUnion("model", [
  z.strictObject({
    model: z.literal("thin-lens"),
    focalLength: z.number().min(5).max(15),
    objectDistance: z.number().min(4).max(50),
  }),
  z.strictObject({
    model: z.literal("pendulum"),
    length: z.number().min(0.25).max(2),
    gravity: z.number().min(1.6).max(20),
  }),
]);

export type Experiment = z.infer<typeof experimentSchema>;
