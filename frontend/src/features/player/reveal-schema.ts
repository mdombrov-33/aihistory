import { z } from "zod";
const coordinate = z.number().min(0).max(100);
export const revealSchema = z
  .strictObject({
    label: z.string().min(1).max(80),
    description: z.string().min(20).max(350),
    marks: z
      .array(
        z.strictObject({
          id: z.string().regex(/^[a-z][a-z0-9-]*$/),
          label: z.string().min(1).max(60),
          closed: z.boolean(),
          points: z
            .array(z.tuple([coordinate, coordinate]))
            .min(2)
            .max(20),
        }),
      )
      .min(1)
      .max(5),
  })
  .superRefine((reveal, ctx) => {
    if (new Set(reveal.marks.map((mark) => mark.id)).size !== reveal.marks.length)
      ctx.addIssue({ code: "custom", message: "Reveal mark IDs must be unique" });
    if (reveal.marks.some((m) => m.closed && m.points.length < 3))
      ctx.addIssue({ code: "custom", message: "Closed reveal marks need three points" });
  });
export type ImageReveal = z.infer<typeof revealSchema>;
