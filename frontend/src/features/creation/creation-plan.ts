// Editable outline defaults describe a planning structure, not generated subject claims.
export const initialOutline = [
  "Start with the question",
  "Explore the idea through an example",
  "Bring the explanation together",
];

export function normalizeOutline(values: readonly string[]) {
  return values
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}
