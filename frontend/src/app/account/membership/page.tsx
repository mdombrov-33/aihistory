// Membership and sample usage management.

import { FeaturePage, FeatureLinks } from "@/components/app/feature-page";
import { Membership } from "@/features/membership/membership";

export const metadata = { title: "Membership & usage" };

export default function MembershipPage() {
  return (
    <FeaturePage
      title="Membership & usage"
      description="Understand your plan and what you can explore next."
    >
      <FeatureLinks />
      <Membership />
    </FeaturePage>
  );
}
