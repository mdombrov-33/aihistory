import { test, expect } from "@playwright/test";
import {
  thinLens,
  pendulumPeriod,
  harmonicSample,
  evaluateSystem,
  assemblyEnvelope,
  systemLayout,
} from "../src/features/learning/models";
import {
  assemblySchema,
  experimentSchema,
  soundSchema,
  systemSchema,
} from "../src/features/learning/schema";
import { preparedStories } from "../src/content/prepared-stories";
import { parsePreparedStory } from "../src/story/prepared-story";

test("thin-lens states preserve sign, scale and the focal singularity", () => {
  expect(thinLens(10, 20)).toEqual({ kind: "real", imageDistance: 20, magnification: -1 });
  expect(thinLens(10, 5)).toEqual({ kind: "virtual", imageDistance: -10, magnification: 2 });
  expect(thinLens(10, 10)).toEqual({ kind: "parallel", imageDistance: null, magnification: null });
  for (let f = 5; f <= 15; f++)
    for (let u = 4; u <= 50; u++) {
      const result = thinLens(f, u);
      if (result.imageDistance !== null) {
        expect(1 / u + 1 / result.imageDistance).toBeCloseTo(1 / f, 10);
        expect(Number.isFinite(result.magnification)).toBe(true);
        expect(result.imageDistance > 0).toBe(u > f);
      }
    }
});
test("pendulum prediction has the expected dimensions and scaling", () => {
  expect(pendulumPeriod(1, 9.81)).toBeCloseTo(2.006, 3);
  expect(pendulumPeriod(2, 9.81) / pendulumPeriod(0.5, 9.81)).toBeCloseTo(2, 10);
  expect(pendulumPeriod(1, 1.62)).toBeGreaterThan(pendulumPeriod(1, 9.81));
  expect(experimentSchema.safeParse({ model: "pendulum", length: 0, gravity: -1 }).success).toBe(
    false,
  );
  expect(
    experimentSchema.safeParse({
      model: "thin-lens",
      focalLength: 10,
      objectDistance: 20,
      code: "eval()",
    }).success,
  ).toBe(false);
});
test("harmonic mixtures are bounded, periodic and silent with zero components", () => {
  for (const harmonics of [
    [1, 0, 0, 0],
    [1, 0.5, 0.33, 0.25],
    [0, 0, 0, 0],
  ]) {
    for (let t = 0; t < 10; t += 0.01) {
      expect(Math.abs(harmonicSample(t, harmonics))).toBeLessThanOrEqual(1.0000001);
      expect(harmonicSample(t, harmonics)).toBeCloseTo(
        harmonicSample(t + Math.PI * 2, harmonics),
        10,
      );
    }
  }
  expect(harmonicSample(0.7, [0, 0, 0, 0])).toBe(0);
  const sound = preparedStories
    .flatMap((b) => b.programs.flatMap((p) => p.beats))
    .find((b) => b.type === "sound")!;
  if (sound.type !== "sound") throw new Error("Missing sound example");
  expect(soundSchema.safeParse({ ...sound.sound, fundamental: 100000 }).success).toBe(false);
});
test("logic gates implement complete truth tables independent of node order", () => {
  const beats = preparedStories
    .flatMap((b) => b.programs.flatMap((p) => p.beats))
    .filter((b) => b.type === "system");
  for (const beat of beats) {
    const system = systemSchema.parse({ ...beat.system, nodes: [...beat.system.nodes].reverse() });
    for (const first of [false, true])
      for (const second of [false, true]) {
        const guarded = system.nodes.some((n) => n.kind === "not");
        const values = evaluateSystem(system, {
          request: first,
          permission: second,
          blocked: second,
        });
        const expected = guarded
          ? first && !second
          : system.nodes.some((n) => n.kind === "and")
            ? first && second
            : first || second;
        expect(values.result).toBe(expected);
      }
  }
});
test("graphs reject unknown nodes, duplicate edges, cycles and invalid gate arity", () => {
  const beat = preparedStories
    .flatMap((b) => b.programs.flatMap((p) => p.beats))
    .find((b) => b.type === "system")!;
  if (beat.type !== "system") throw new Error("Missing graph");
  const graph = beat.system;
  expect(
    systemSchema.safeParse({ ...graph, edges: [...graph.edges, graph.edges[0]] }).success,
  ).toBe(false);
  expect(
    systemSchema.safeParse({ ...graph, edges: [...graph.edges, { from: "missing", to: "result" }] })
      .success,
  ).toBe(false);
  expect(
    systemSchema.safeParse({ ...graph, edges: graph.edges.filter((e) => e.from !== "request") })
      .success,
  ).toBe(false);
  const cycle = {
    ...graph,
    nodes: graph.nodes.map((n) =>
      n.id === "request" ? { ...n, kind: "not", initial: undefined } : n,
    ),
    edges: [...graph.edges, { from: "result", to: "request" }],
  };
  expect(systemSchema.safeParse(cycle).success).toBe(false);
});
test("assemblies and complete lessons reject unsupported geometry and executable content", () => {
  const bundle = preparedStories.find((b) => b.summary.slug === "camera-opened-up")!;
  const beat = bundle.programs[0].beats[0];
  if (beat.type !== "assembly") throw new Error("Missing assembly");
  expect(
    assemblySchema.safeParse({
      ...beat.assembly,
      parts: [beat.assembly.parts[0], beat.assembly.parts[0]],
    }).success,
  ).toBe(false);
  expect(
    assemblySchema.safeParse({
      ...beat.assembly,
      parts: beat.assembly.parts.map((p) => ({ ...p, position: [Infinity, 0, 0] })),
    }).success,
  ).toBe(false);
  const copy = structuredClone(bundle) as unknown as {
    programs: { beats: Record<string, unknown>[] }[];
  };
  copy.programs[0].beats[0].assembly = { ...beat.assembly, script: "alert(1)" };
  expect(() => parsePreparedStory(copy)).toThrow();
  expect(
    new Set(preparedStories.filter((b) => b.summary.era === "timeless").map((b) => b.summary.topic))
      .size,
  ).toBeGreaterThanOrEqual(3);
});

test("physics integration returns close to the small-angle prediction", async () => {
  const { default: rapier } = await import("@dimforge/rapier3d-compat");
  await rapier.init();
  const world = new rapier.World({ x: 0, y: -9.81, z: 0 });
  try {
    world.timestep = 1 / 120;
    const angle = (10 * Math.PI) / 180;
    const pivot = world.createRigidBody(rapier.RigidBodyDesc.fixed().setTranslation(0, 1, 0));
    const bob = world.createRigidBody(
      rapier.RigidBodyDesc.dynamic().setTranslation(Math.sin(angle), 1 - Math.cos(angle), 0),
    );
    world.createCollider(rapier.ColliderDesc.ball(0.09), bob);
    world.createImpulseJoint(
      rapier.JointData.revolute(
        { x: 0, y: 0, z: 0 },
        { x: -Math.sin(angle), y: Math.cos(angle), z: 0 },
        { x: 0, y: 0, z: 1 },
      ),
      pivot,
      bob,
      true,
    );
    let previous = bob.translation().x;
    const crossings: number[] = [];
    for (let i = 0; i < 120 * 7; i++) {
      world.step();
      const x = bob.translation().x;
      expect(Number.isFinite(x)).toBe(true);
      if (previous > 0 && x <= 0) crossings.push(i / 120);
      previous = x;
    }
    expect(crossings.length).toBeGreaterThanOrEqual(3);
    const observed = crossings[2] - crossings[1];
    expect(Math.abs(observed - pendulumPeriod(1, 9.81)) / pendulumPeriod(1, 9.81)).toBeLessThan(
      0.03,
    );
  } finally {
    world.free();
  }
});

test("assembly framing contains every supplied part throughout separation", () => {
  const bundle = preparedStories.find((b) => b.summary.slug === "camera-opened-up")!;
  const beat = bundle.programs[0].beats[0];
  if (beat.type !== "assembly") throw new Error("Missing assembly");
  const envelope = assemblyEnvelope(beat.assembly);
  for (const part of beat.assembly.parts)
    for (const amount of [0, 0.25, 0.5, 0.75, 1]) {
      const extent =
        part.shape === "box"
          ? part.size.map((n) => n / 2)
          : part.shape === "sphere"
            ? [part.size[0], part.size[0], part.size[0]]
            : [
                part.size[0] + (part.shape === "ring" ? part.size[1] : 0),
                part.size[0] + (part.shape === "ring" ? part.size[1] : 0),
                part.shape === "ring" ? part.size[1] : part.size[2] / 2,
              ];
      for (let axis = 0; axis < 3; axis++) {
        const center = part.position[axis] + part.separation[axis] * amount;
        expect(center - extent[axis]).toBeGreaterThanOrEqual(
          envelope.center[axis] - envelope.size[axis] / 2 - 1e-9,
        );
        expect(center + extent[axis]).toBeLessThanOrEqual(
          envelope.center[axis] + envelope.size[axis] / 2 + 1e-9,
        );
      }
    }
});
test("narrow graph layouts follow dependencies without overlapping node rectangles", () => {
  for (const bundle of preparedStories)
    for (const program of bundle.programs)
      for (const beat of program.beats) {
        if (beat.type !== "system") continue;
        const layout = systemLayout(beat.system, true);
        for (const edge of beat.system.edges)
          expect(layout.positions[edge.to].y).toBeGreaterThan(layout.positions[edge.from].y);
        for (const [i, first] of beat.system.nodes.entries())
          for (const second of beat.system.nodes.slice(i + 1)) {
            const a = layout.positions[first.id],
              b = layout.positions[second.id];
            expect(Math.abs(a.x - b.x) >= 150 || Math.abs(a.y - b.y) >= 100).toBe(true);
          }
        expect(layout.height).toBeGreaterThan(
          Math.max(...Object.values(layout.positions).map((p) => p.y)) + 80,
        );
      }
});
