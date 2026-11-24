// Small-angle pendulum period prediction, separate from the physical simulation.
export function pendulumPeriod(length: number, gravity: number) {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}
