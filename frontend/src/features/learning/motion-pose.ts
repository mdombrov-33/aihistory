import type { Assembly } from "./schema";
import { trackValue } from "./motion-definition";
type Vector = [number, number, number];

export function assemblyPose(assembly: Assembly, partId: string, progress: number) {
  const part = assembly.parts.find((p) => p.id === partId);
  if (!part) throw new Error("Unknown moving part");
  const position = [...part.position] as Vector;
  const rotation: Vector = part.shape === "cylinder" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  for (const track of assembly.motion?.tracks ?? []) {
    if (track.partId !== partId) continue;
    const axis = { x: 0, y: 1, z: 2 }[track.axis];
    (track.property === "position" ? position : rotation)[axis] += trackValue(track.keys, progress);
  }
  return { position, rotation };
}

// Rotation stays inside a sphere; every linear translation reaches its extrema at a key.
export function motionEnvelope(assembly: Assembly) {
  const min: Vector = [Infinity, Infinity, Infinity],
    max: Vector = [-Infinity, -Infinity, -Infinity];
  for (const part of assembly.parts) {
    const radius =
      part.shape === "box"
        ? Math.hypot(...part.size.map((n) => n / 2))
        : part.shape === "sphere"
          ? part.size[0]
          : part.shape === "ring"
            ? part.size[0] + part.size[1]
            : Math.hypot(Math.max(part.size[0], part.size[1]), part.size[2] / 2);
    for (let axis = 0; axis < 3; axis++) {
      const track = assembly.motion?.tracks.find(
        (t) =>
          t.partId === part.id && t.property === "position" && t.axis === ["x", "y", "z"][axis],
      );
      const offsets = track ? track.keys.map((key) => key.value) : [0];
      min[axis] = Math.min(min[axis], part.position[axis] + Math.min(...offsets) - radius);
      max[axis] = Math.max(max[axis], part.position[axis] + Math.max(...offsets) + radius);
    }
  }
  return {
    center: min.map((n, i) => (n + max[i]) / 2) as Vector,
    size: min.map((n, i) => max[i] - n) as Vector,
  };
}
