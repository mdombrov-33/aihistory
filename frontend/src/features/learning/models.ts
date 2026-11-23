import type { LogicSystem } from "./schema";

// Centimetres throughout; a singular focal configuration is a state, never Infinity in the UI.
export function thinLens(focalLength: number, objectDistance: number) {
  const delta = objectDistance - focalLength;
  if (Math.abs(delta) < 0.01)
    return { kind: "parallel" as const, imageDistance: null, magnification: null };
  const imageDistance = (focalLength * objectDistance) / delta;
  return {
    kind: imageDistance > 0 ? ("real" as const) : ("virtual" as const),
    imageDistance,
    magnification: -imageDistance / objectDistance,
  };
}
export function pendulumPeriod(length: number, gravity: number) {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}
export function harmonicSample(phase: number, harmonics: readonly number[]) {
  const scale = Math.max(
    1,
    harmonics.reduce((total, value) => total + Math.abs(value), 0),
  );
  return (
    harmonics.reduce((total, amplitude, i) => total + amplitude * Math.sin((i + 1) * phase), 0) /
    scale
  );
}
export function evaluateSystem(system: LogicSystem, inputs: Readonly<Record<string, boolean>>) {
  const values: Record<string, boolean> = {};
  const remaining = new Set(system.nodes.map((n) => n.id));
  for (let round = 0; round < system.nodes.length; round++) {
    for (const node of system.nodes) {
      if (!remaining.has(node.id)) continue;
      const incoming = system.edges.filter((e) => e.to === node.id);
      if (!incoming.every((e) => Object.hasOwn(values, e.from))) continue;
      const signal = incoming.map((e) => values[e.from]);
      values[node.id] =
        node.kind === "input"
          ? (inputs[node.id] ?? node.initial ?? false)
          : node.kind === "and"
            ? signal.every(Boolean)
            : node.kind === "or"
              ? signal.some(Boolean)
              : node.kind === "not"
                ? !signal[0]
                : signal[0];
      remaining.delete(node.id);
    }
  }
  if (remaining.size) throw new Error("Invalid or cyclic system");
  return values;
}

// Narrow workbenches reflow the graph by dependency depth instead of shrinking node text.
export function systemLayout(system: LogicSystem, vertical: boolean) {
  if (!vertical)
    return {
      height: 350,
      positions: Object.fromEntries(
        system.nodes.map((n) => [n.id, { x: n.x * 6.5, y: n.y * 4.2 }]),
      ),
    };
  const depth: Record<string, number> = {};
  for (let round = 0; round < system.nodes.length; round++)
    for (const node of system.nodes) {
      const parents = system.edges.filter((e) => e.to === node.id).map((e) => e.from);
      if (parents.every((id) => Object.hasOwn(depth, id)))
        depth[node.id] = parents.length ? Math.max(...parents.map((id) => depth[id])) + 1 : 0;
    }
  const levels = Math.max(...Object.values(depth)) + 1;
  const positions: Record<string, { x: number; y: number }> = {};
  for (let level = 0; level < levels; level++) {
    const group = system.nodes.filter((n) => depth[n.id] === level);
    group.forEach((n, i) => {
      positions[n.id] = { x: (i - (group.length - 1) / 2) * 155, y: level * 120 };
    });
  }
  return { height: Math.max(350, levels * 120 + 40), positions };
}

export function assemblyEnvelope(assembly: import("./schema").Assembly) {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const part of assembly.parts) {
    const radius =
      part.shape === "ring" ? part.size[0] + part.size[1] : Math.max(part.size[0], part.size[1]);
    const half =
      part.shape === "box"
        ? part.size.map((n) => n / 2)
        : part.shape === "sphere"
          ? [part.size[0], part.size[0], part.size[0]]
          : [radius, radius, part.shape === "ring" ? part.size[1] : part.size[2] / 2];
    for (let axis = 0; axis < 3; axis++) {
      max[axis] = Math.max(
        max[axis],
        part.position[axis] + half[axis],
        part.position[axis] + part.separation[axis] + half[axis],
      );
      min[axis] = Math.min(
        min[axis],
        part.position[axis] - half[axis],
        part.position[axis] + part.separation[axis] - half[axis],
      );
    }
  }
  return {
    center: min.map((n, i) => (n + max[i]) / 2) as [number, number, number],
    size: min.map((n, i) => max[i] - n) as [number, number, number],
  };
}
