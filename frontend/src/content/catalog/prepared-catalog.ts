// Lightweight discovery summaries sourced from the generated metadata index.

import summaries from "./showcase-catalog.generated.json";
import type { StorySummary } from "@/features/lesson/contracts/catalog";

// Generated from canonical bundles by scripts/sync-prepared-catalog.mjs.
// Complete bundles stay out of the browser graph and are validated by
// content/lessons/registry.ts on the server and by the content contract suite.
export const preparedSummaries: readonly StorySummary[] = summaries.map((summary) => ({
  ...summary,
  topic: summary.topic as StorySummary["topic"],
  era: summary.era as StorySummary["era"],
  sample: true,
}));
