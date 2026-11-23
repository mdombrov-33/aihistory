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

test("packet traces distinguish forwarding drops from destination delivery and rewind exactly", async () => {
  const { packetTrace } = await import("../src/features/learning/packet-model");
  const beat = preparedStories.find((b) => b.summary.slug === "a-packets-journey")!.programs[0]
    .beats[0];
  if (beat.type !== "traveler") throw new Error("Missing traveler");
  for (const scenario of beat.traveler.scenarios)
    for (let limit = 0; limit <= 8; limit++) {
      const trace = packetTrace(beat.traveler, scenario.id, limit);
      const forwardingCount = scenario.path.length - 2;
      expect(trace.at(-1)!.kind).toBe(limit > forwardingCount ? "delivered" : "dropped");
      expect(trace.length).toBeLessThanOrEqual(2 * scenario.path.length);
      for (const [index, checkpoint] of trace.entries()) {
        expect(checkpoint.hopLimit).toBeGreaterThanOrEqual(0);
        expect(checkpoint.hopLimit).toBeLessThanOrEqual(limit);
        expect(packetTrace(beat.traveler, scenario.id, limit)[index]).toEqual(checkpoint);
        if (checkpoint.kind === "forwarded")
          expect(checkpoint.hopLimit).toBe(trace[index - 1].hopLimit - 1);
        if (checkpoint.kind === "received")
          expect(checkpoint.hopLimit).toBe(trace[index - 1].hopLimit);
      }
    }
  const boundary = preparedStories.find((b) => b.summary.slug === "a-packets-journey")!.programs[3]
    .beats[0];
  if (boundary.type !== "traveler") throw new Error("Missing boundary case");
  expect(packetTrace(boundary.traveler, "neighbor", 0).at(-1)).toMatchObject({
    kind: "delivered",
    hopLimit: 0,
  });
  expect(packetTrace(boundary.traveler, "router", 0).at(-1)).toMatchObject({
    kind: "dropped",
    hopLimit: 0,
  });
  expect(() => packetTrace(beat.traveler, "missing", 3)).toThrow();
  for (const invalid of [-1, 1.5, 9, Infinity])
    expect(() => packetTrace(beat.traveler, "direct", invalid)).toThrow();
});
test("traveler contracts reject orphan routes and keep station labels inside narrow canvases", async () => {
  const { travelerSchema, packetLayout } = await import("../src/features/learning/packet-model");
  const beat = preparedStories.find((b) => b.summary.slug === "a-packets-journey")!.programs[0]
    .beats[0];
  if (beat.type !== "traveler") throw new Error("Missing traveler");
  const traveler = beat.traveler;
  const mutate = (fn: (value: typeof traveler) => void) => {
    const copy = structuredClone(beat.traveler);
    fn(copy);
    return travelerSchema.safeParse(copy).success;
  };
  expect(
    mutate((v) => {
      v.scenarios[0].path[1] = "missing";
    }),
  ).toBe(false);
  expect(
    mutate((v) => {
      v.scenarios[0].path[0] = "edge";
    }),
  ).toBe(false);
  expect(
    mutate((v) => {
      v.scenarios[0].path.splice(1, 0, "receiver");
    }),
  ).toBe(false);
  expect(
    mutate((v) => {
      v.locations.push(v.locations[0]);
    }),
  ).toBe(false);
  expect(travelerSchema.safeParse({ ...beat.traveler, transition: "eval(code)" }).success).toBe(
    false,
  );
  for (const width of [280, 320, 390, 700, 1000]) {
    const layout = packetLayout(beat.traveler.locations, width, 300);
    for (const point of Object.values(layout.positions)) {
      expect(point.x - 59).toBeGreaterThanOrEqual(10);
      expect(point.x + 59).toBeLessThanOrEqual(width - 10);
      expect(point.y - 32).toBeGreaterThanOrEqual(0);
      expect(point.y + 28).toBeLessThan(layout.height);
    }
  }
});
test("construction tests return counterexamples and accept equivalent correct connections", async () => {
  const { testConstruction, diagnoseConstruction } =
    await import("../src/features/learning/construction-model");
  const beat = preparedStories.find((b) => b.summary.slug === "signals-and-decisions")!.programs[6]
    .beats[0];
  if (beat.type !== "construction") throw new Error("Missing construction");
  const c = beat.construction;
  const initial = testConstruction(c, c.initialEdges);
  expect(initial.status).toBe("tested");
  if (initial.status !== "tested") throw new Error("Expected test");
  expect(initial.rows.filter((r) => !r.passes)).toEqual([
    { inputs: { a: true, b: true }, expected: false, actual: true, passes: false },
  ]);
  const edges = [
    { from: "a", to: "either", port: "a" },
    { from: "b", to: "either", port: "b" },
    { from: "a", to: "both", port: "a" },
    { from: "b", to: "both", port: "b" },
    { from: "both", to: "invert", port: "a" },
    { from: "either", to: "combine", port: "a" },
    { from: "invert", to: "combine", port: "b" },
    { from: "combine", to: "result", port: "a" },
  ] as const;
  expect(testConstruction(c, [...edges])).toMatchObject({ status: "tested", passes: true });
  const swapped = edges.map((e) =>
    e.to === "either" ? { ...e, port: e.port === "a" ? ("b" as const) : ("a" as const) } : e,
  );
  expect(testConstruction(c, swapped)).toMatchObject({ status: "tested", passes: true });
  expect(diagnoseConstruction(c, [])).toMatchObject({ status: "incomplete" });
  expect(diagnoseConstruction(c, [{ from: "a", to: "result", port: "a" }]).status).toBe("ready");
  const guard = preparedStories.find((b) => b.summary.slug === "signals-and-decisions")!.programs[7]
    .beats[0];
  if (guard.type !== "construction") throw new Error("Missing guard");
  expect(
    testConstruction(guard.construction, [
      { from: "b", to: "invert", port: "a" },
      { from: "a", to: "both", port: "a" },
      { from: "invert", to: "both", port: "b" },
      { from: "both", to: "result", port: "a" },
    ]),
  ).toMatchObject({ status: "tested", passes: true });
});
test("construction drafts reject invalid ports, multiple drivers, cycles and incomplete targets", async () => {
  const { diagnoseConstruction, constructionSchema, constructionDraftSchema } =
    await import("../src/features/learning/construction-model");
  const beat = preparedStories.find((b) => b.summary.slug === "signals-and-decisions")!.programs[6]
    .beats[0];
  if (beat.type !== "construction") throw new Error("Missing construction");
  const c = beat.construction;
  for (const edges of [
    [{ from: "a", to: "missing", port: "a" }],
    [{ from: "result", to: "both", port: "a" }],
    [{ from: "a", to: "invert", port: "b" }],
    [
      { from: "a", to: "result", port: "a" },
      { from: "b", to: "result", port: "a" },
    ],
    [
      { from: "both", to: "invert", port: "a" },
      { from: "invert", to: "both", port: "a" },
    ],
  ] as const)
    expect(diagnoseConstruction(c, [...edges]).status).toBe("invalid");
  expect(constructionSchema.safeParse({ ...c, target: c.target.slice(1) }).success).toBe(false);
  expect(
    constructionSchema.safeParse({ ...c, target: [c.target[0], c.target[0], ...c.target.slice(2)] })
      .success,
  ).toBe(false);
  expect(
    constructionDraftSchema.safeParse({
      version: 1,
      edges: [],
      inputs: { a: false },
      javascript: "run()",
    }).success,
  ).toBe(false);
  expect(constructionDraftSchema.safeParse({ version: 2, edges: [], inputs: {} }).success).toBe(
    false,
  );
});

test("builder drawing retains full-size nodes and separated 44px ports at every pane width", async () => {
  const { constructionLayout } = await import("../src/features/learning/construction-model");
  for (const width of [280, 390, 500, 580, 800]) {
    const layout = constructionLayout(8, width);
    for (const [i, a] of layout.positions.entries()) {
      expect(a.x - 22).toBeGreaterThanOrEqual(0);
      expect(a.x + 144 + 22).toBeLessThanOrEqual(layout.width);
      expect(a.y - 22).toBeGreaterThanOrEqual(0);
      expect(a.y + 72 + 22).toBeLessThanOrEqual(layout.height);
      for (const b of layout.positions.slice(i + 1))
        expect(Math.abs(a.x - b.x) >= 180 || Math.abs(a.y - b.y) >= 140).toBe(true);
    }
    expect(144 / 3).toBeGreaterThanOrEqual(44);
  }
});
