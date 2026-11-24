import { z } from "zod";

export const motionSchema = z
  .strictObject({
    duration: z.number().min(2).max(12),
    description: z.string().min(20).max(700),
    tracks: z
      .array(
        z.strictObject({
          partId: z.string().regex(/^[a-z][a-z0-9-]*$/),
          property: z.enum(["position", "rotation"]),
          axis: z.enum(["x", "y", "z"]),
          keys: z
            .array(
              z.strictObject({
                at: z.number().min(0).max(1),
                value: z.number().min(-6).max(6),
              }),
            )
            .min(2)
            .max(8),
        }),
      )
      .min(1)
      .max(8),
    cues: z
      .array(
        z.strictObject({
          at: z.number().min(0).max(1),
          label: z.string().min(1).max(80),
          explanation: z.string().min(10).max(350),
        }),
      )
      .min(2)
      .max(6),
  })
  .superRefine((motion, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    const tracks = motion.tracks.map((t) => `${t.partId}:${t.property}:${t.axis}`);
    if (new Set(tracks).size !== tracks.length) fail("A motion property needs one track");
    for (const track of motion.tracks) {
      if (
        track.keys[0].at !== 0 ||
        track.keys.at(-1)!.at !== 1 ||
        track.keys.some((key, i) => i > 0 && key.at <= track.keys[i - 1].at)
      )
        fail("Motion keys must increase from zero to one");
    }
    if (
      motion.cues[0].at !== 0 ||
      motion.cues.some((cue, i) => i > 0 && cue.at <= motion.cues[i - 1].at)
    )
      fail("Motion cues must start at zero and increase");
  });
export type PartMotion = z.infer<typeof motionSchema>;

export function trackValue(keys: PartMotion["tracks"][number]["keys"], position: number) {
  const t = Math.max(0, Math.min(1, position));
  const right = keys.findIndex((key) => key.at >= t);
  if (right <= 0) return keys[0].value;
  const a = keys[right - 1],
    b = keys[right];
  return a.value + ((t - a.at) / (b.at - a.at)) * (b.value - a.value);
}
export function motionCue(motion: PartMotion, position: number) {
  return motion.cues.findLast((cue) => cue.at <= position) ?? motion.cues[0];
}
