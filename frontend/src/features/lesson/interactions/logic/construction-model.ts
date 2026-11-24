// Validates Boolean construction tasks/drafts and checks their behavior against a truth table.

import { z } from "zod";
import { evaluateSystem } from "./system-model";
import { systemSchema, type LogicSystem } from "./system-schema";

const id = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/)
  .max(50);

export const constructionEdgeSchema = z.strictObject({
  from: id,
  to: id,
  port: z.enum(["a", "b"]),
});

export const constructionDraftSchema = z.strictObject({
  version: z.literal(1),
  edges: z.array(constructionEdgeSchema).max(16),
  inputs: z.record(id, z.boolean()).refine((v) => Object.keys(v).length <= 3),
});

const node = z.strictObject({
  id,
  label: z.string().min(1).max(30),
  kind: z.enum(["input", "and", "or", "not", "output"]),
  explanation: z.string().min(10).max(500),
});

export const constructionSchema = z
  .strictObject({
    model: z.literal("boolean"),
    goal: z.string().min(10).max(300),
    hint: z.string().min(10).max(500),
    nodes: z.array(node).min(3).max(8),
    initialEdges: z.array(constructionEdgeSchema).max(16),
    target: z
      .array(z.strictObject({ inputs: z.array(z.boolean()).min(1).max(3), output: z.boolean() }))
      .min(2)
      .max(8),
  })
  .superRefine((value, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    const count = value.nodes.filter((n) => n.kind === "input").length;

    if (new Set(value.nodes.map((n) => n.id)).size !== value.nodes.length)
      return fail("Component IDs must be unique");

    if (count < 2 || count > 3 || value.nodes.filter((n) => n.kind === "output").length !== 1)
      return fail("Use two to three inputs and exactly one output");

    const rows = new Set(value.target.map((r) => r.inputs.map(Number).join("")));

    if (
      value.target.length !== 2 ** count ||
      rows.size !== 2 ** count ||
      value.target.some((r) => r.inputs.length !== count)
    )
      return fail("Target needs every input combination exactly once");

    const result = diagnoseConstruction(value, value.initialEdges);

    if (result.status === "invalid") fail(result.message);
  });

export type Construction = z.infer<typeof constructionSchema>;

export type ConstructionEdge = z.infer<typeof constructionEdgeSchema>;

export type ConstructionDraft = z.infer<typeof constructionDraftSchema>;

export function inputPorts(kind: Construction["nodes"][number]["kind"]): ("a" | "b")[] {
  return kind === "input" ? [] : kind === "and" || kind === "or" ? ["a", "b"] : ["a"];
}

export type ConstructionDiagnostic =
  | { status: "incomplete" | "invalid"; message: string }
  | { status: "ready"; message: string; system: LogicSystem };

export function diagnoseConstruction(
  construction: { nodes: z.infer<typeof node>[]; goal: string },
  edges: ConstructionEdge[],
): ConstructionDiagnostic {
  const invalid = (message: string): ConstructionDiagnostic => ({ status: "invalid", message });

  if (!z.array(constructionEdgeSchema).max(16).safeParse(edges).success)
    return invalid("The connection data is invalid. Reset the workbench to recover.");

  const occupied = new Set<string>();
  const pairs = new Set<string>();

  for (const e of edges) {
    const from = construction.nodes.find((n) => n.id === e.from),
      to = construction.nodes.find((n) => n.id === e.to);

    if (!from || !to)
      return invalid("A connection references a missing component. Reset to recover.");

    if (from.id === to.id || from.kind === "output" || !inputPorts(to.kind).includes(e.port))
      return invalid("Connect an input or gate output to a different component’s input.");

    if (occupied.has(`${e.to}:${e.port}`))
      return invalid("That input already has a wire. Remove it before connecting another.");

    if (pairs.has(`${e.from}:${e.to}`))
      return invalid("Use distinct sources for a gate’s two inputs.");

    occupied.add(`${e.to}:${e.port}`);
    pairs.add(`${e.from}:${e.to}`);
  }

  const remaining = new Set(construction.nodes.map((n) => n.id));

  for (let i = 0; i < construction.nodes.length; i++)
    for (const id of remaining)
      if (edges.filter((e) => e.to === id).every((e) => !remaining.has(e.from)))
        remaining.delete(id);

  if (remaining.size)
    return invalid("This connection would create a feedback loop. Keep the network acyclic.");

  const output = construction.nodes.find((n) => n.kind === "output");

  if (!output) return invalid("The workbench needs an output.");

  const used = new Set<string>();

  const visit = (id: string): string | undefined => {
    if (used.has(id)) return;

    used.add(id);

    const n = construction.nodes.find((n) => n.id === id)!;

    for (const port of inputPorts(n.kind)) {
      const e = edges.find((e) => e.to === id && e.port === port);

      if (!e) return `Connect ${n.label} · input ${port.toUpperCase()} to continue.`;

      const missing = visit(e.from);

      if (missing) return missing;
    }
  };

  const missing = visit(output.id);

  if (missing) return { status: "incomplete", message: missing };

  const system = systemSchema.parse({
    description: construction.goal,
    nodes: construction.nodes
      .filter((n) => used.has(n.id) || n.kind === "input")
      .map((n) => ({ ...n, x: 50, y: 50 })),
    edges: edges.filter((e) => used.has(e.to)).map((e) => ({ from: e.from, to: e.to })),
  });

  return {
    status: "ready",
    message: "Connected and ready. Test every input combination to check your design.",
    system,
  };
}

export function testConstruction(construction: Construction, edges: ConstructionEdge[]) {
  const result = diagnoseConstruction(construction, edges);

  if (result.status !== "ready") return result;

  const inputIds = construction.nodes.filter((n) => n.kind === "input").map((n) => n.id);
  const outputId = construction.nodes.find((n) => n.kind === "output")!.id;

  const rows = construction.target.map((row) => {
    const inputs = Object.fromEntries(inputIds.map((id, i) => [id, row.inputs[i]]));
    const actual = evaluateSystem(result.system, inputs)[outputId];

    return { inputs, expected: row.output, actual, passes: actual === row.output };
  });

  return { status: "tested" as const, rows, passes: rows.every((row) => row.passes) };
}

// Ports stay 44px apart and nodes render at 1:1; the drawing may scroll, never shrink.
export function constructionLayout(count: number, width: number) {
  const columns = width < 580 ? 2 : 3;
  const drawingWidth = Math.max(400, width);
  const step = Math.max(180, (drawingWidth - 56) / columns);

  return {
    width: drawingWidth,
    height: 70 + Math.ceil(count / columns) * 140,
    positions: Array.from({ length: count }, (_, i) => ({
      x: 28 + (i % columns) * step,
      y: 35 + Math.floor(i / columns) * 140,
    })),
  };
}
