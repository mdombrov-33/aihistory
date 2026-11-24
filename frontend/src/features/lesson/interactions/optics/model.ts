// Pure thin-lens calculation with explicit real, virtual and focal outcomes.
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
