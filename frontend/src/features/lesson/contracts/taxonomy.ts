// Shared subject/era facets used by lesson validation and discovery filters.
// Subject-neutral discovery. Calendar eras remain optional facets, not lesson structure.
export const topicNames = [
  "Physics & space",
  "Music & sound",
  "Technology & computing",
  "Mathematics",
  "Biology & nature",
  "Trade & connection",
  "Art & ideas",
  "Science & invention",
  "People & daily life",
] as const;

export const eras = ["timeless", "ancient", "medieval", "early-modern", "modern"] as const;
