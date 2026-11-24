// Premium offer and plan selection in the shared app identity.

import { FeaturePage } from "@/components/app/feature-page";
import { PremiumSelection } from "@/features/membership/premium";

export const metadata = { title: "Premium" };

export default function PremiumPage() {
  return (
    <FeaturePage title="Choose how you learn." description="An open library. A more personal path.">
      <PremiumSelection />
    </FeaturePage>
  );
}
