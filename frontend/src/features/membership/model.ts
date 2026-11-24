// Deterministic sample entitlement states; these never authorize a paid operation.
export const sampleAllowances = { lessons: 8, questions: 30 };

export function remainingUsage(used: number, included: number) {
  return Math.max(0, included - Math.max(0, used));
}
