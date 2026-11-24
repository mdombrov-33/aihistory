// Personal learning guide entry, using explicit interests and device-local trails.

import { FeaturePage, FeatureLinks } from "@/components/app/feature-page";
import { LearningGuide } from "@/features/guide/learning-guide";

export const metadata = { title: "Your learning guide" };

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<{ trail?: string; add?: string }>;
}) {
  const query = await searchParams;

  return (
    <FeaturePage
      title="Your learning guide"
      description="Keep a question in view. Find the connections at your own pace."
    >
      <FeatureLinks />
      <LearningGuide
        initialTrail={typeof query.trail === "string" ? query.trail : undefined}
        add={typeof query.add === "string" ? query.add : undefined}
      />
    </FeaturePage>
  );
}
