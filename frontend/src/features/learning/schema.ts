import { z } from "zod";

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
  });
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
const systemNode = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label,
  explanation,
  kind: z.enum(["input", "and", "or", "not", "output"]),
  initial: z.boolean().optional(),
  x: z.number().min(8).max(92),
  y: z.number().min(12).max(88),
});
export const systemSchema = z
  .strictObject({
    nodes: z.array(systemNode).min(3).max(12),
    edges: z
      .array(z.strictObject({ from: label, to: label }))
      .min(2)
      .max(20),
    description: explanation,
  })
  .superRefine((value, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    const ids = new Set(value.nodes.map((n) => n.id));
    if (ids.size !== value.nodes.length) fail("System node IDs must be unique");
    const edges = new Set<string>();
    for (const e of value.edges) {
      if (!ids.has(e.from) || !ids.has(e.to) || e.from === e.to) fail("Invalid system connection");
      const key = e.from + ":" + e.to;
      if (edges.has(key)) fail("Duplicate system connection");
      edges.add(key);
    }
    for (const n of value.nodes) {
      const count = value.edges.filter((e) => e.to === n.id).length;
      if (
        (n.kind === "input" && count !== 0) ||
        (["not", "output"].includes(n.kind) && count !== 1) ||
        (["and", "or"].includes(n.kind) && (count < 2 || count > 4))
      )
        fail("Invalid system input count");
      if (n.kind !== "input" && n.initial !== undefined) fail("Only inputs have initial values");
    }
    const remaining = new Set(ids);
    for (let round = 0; round < value.nodes.length; round++) {
      for (const id of remaining)
        if (value.edges.filter((e) => e.to === id).every((e) => !remaining.has(e.from)))
          remaining.delete(id);
    }
    if (remaining.size) fail("System connections must be acyclic");
    if (
      !value.nodes.some((n) => n.kind === "input") ||
      !value.nodes.some((n) => n.kind === "output")
    )
      fail("A system needs an input and an output");
  });
export type Assembly = z.infer<typeof assemblySchema>;
export type Experiment = z.infer<typeof experimentSchema>;
export type SoundLab = z.infer<typeof soundSchema>;
export type LogicSystem = z.infer<typeof systemSchema>;
