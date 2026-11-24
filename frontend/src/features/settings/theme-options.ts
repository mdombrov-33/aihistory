// Theme identifiers and labels shared by the preference UI and app provider.
// Theme values map directly to next-themes and the application's semantic CSS tokens.
export const themeOptions = [
  {
    value: "worlds",
    label: "Worlds",
    description: "Deep navy, warm ivory and brass.",
    swatches: ["#101820", "#243744", "#e7bc75"],
  },
  {
    value: "parchment",
    label: "Parchment",
    description: "Light paper, warm ink and copper. A brighter way to explore.",
    swatches: ["#f4efe5", "#e6d8c3", "#903d24"],
  },
  {
    value: "forest",
    label: "Forest",
    description: "Deep green, soft ivory and muted gold.",
    swatches: ["#0e2422", "#284a3c", "#d7ba80"],
  },
  {
    value: "mineral",
    label: "Mineral",
    description: "Pale stone, slate and clear cobalt.",
    swatches: ["#edf1f3", "#dce5ed", "#2852a2"],
  },
] as const;

export type ColorTheme = (typeof themeOptions)[number]["value"];
