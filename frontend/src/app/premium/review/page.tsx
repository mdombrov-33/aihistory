// Premium selection review; no checkout or payment service is invoked.

import { FeaturePage } from "@/components/app/feature-page";
import { PremiumReview } from "@/features/membership/premium";

export const metadata = { title: "Review Premium" };

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <FeaturePage title="Review your choice." description="See how Premium would fit your learning.">
      <PremiumReview next={typeof next === "string" ? next : undefined} />
    </FeaturePage>
  );
}
