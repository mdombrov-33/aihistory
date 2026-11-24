// Validates bounded harmonic mixtures and their authored presets.

import { z } from "zod";

const label = z.string().min(1).max(100);
const explanation = z.string().min(10).max(700);

export const soundSchema = z.strictObject({
  fundamental: z.number().int().min(110).max(440),
  harmonics: z.array(z.number().min(0).max(1)).length(4),
  presets: z
    .array(
      z.strictObject({
        label,
        harmonics: z.array(z.number().min(0).max(1)).length(4),
        explanation,
      }),
    )
    .min(2)
    .max(5),
});

export type SoundLab = z.infer<typeof soundSchema>;
