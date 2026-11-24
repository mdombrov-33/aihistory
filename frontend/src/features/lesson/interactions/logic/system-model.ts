// Evaluates ideal Boolean networks and lays out nodes by dependency depth.

import type { LogicSystem } from "./system-schema";

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
