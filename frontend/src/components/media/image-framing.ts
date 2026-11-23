export type ImagePoint = { x: number; y: number };

/** Fill the viewport where possible, keeping every inspection target reachable. */
export function imageFraming(
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  framing: "cover" | "contain",
  focalPoint: readonly [number, number] = [50, 50],
  points: readonly ImagePoint[] = [],
) {
  const padding = points.length ? Math.min(28, viewportWidth / 8, viewportHeight / 8) : 0;
  let scale =
    framing === "cover"
      ? Math.max(viewportWidth / width, viewportHeight / height)
      : Math.min(viewportWidth / width, viewportHeight / height);
  const xs = points.map((p) => (p.x * width) / 100);
  const ys = points.map((p) => (p.y * height) / 100);
  if (points.length) {
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    if (spanX) scale = Math.min(scale, (viewportWidth - padding * 2) / spanX);
    if (spanY) scale = Math.min(scale, (viewportHeight - padding * 2) / spanY);
  }
  function position(viewport: number, source: number, focal: number, targets: number[]) {
    const desired = viewport / 2 - (source * scale * focal) / 100;
    // A marked point at a source edge needs a real margin around its touch target.
    let lower = Math.min(0, viewport - source * scale);
    let upper = Math.max(0, viewport - source * scale);
    if (targets.length) {
      const bounded = Math.max(lower, Math.min(upper, desired));
      // Reachability wins over edge-to-edge filling for a target on the image edge.
      lower = padding - Math.min(...targets) * scale;
      upper = viewport - padding - Math.max(...targets) * scale;
      return Math.max(lower, Math.min(upper, bounded));
    }
    return Math.max(lower, Math.min(upper, desired));
  }
  return {
    scale,
    x: position(viewportWidth, width, focalPoint[0], xs),
    y: position(viewportHeight, height, focalPoint[1], ys),
  };
}
