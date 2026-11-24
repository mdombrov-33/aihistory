// Bounds all supplied assembly parts across the full separation range.
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
