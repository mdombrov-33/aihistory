// Device-local account profile, security and membership entry points.

import { FeaturePage, FeatureLinks } from "@/components/app/feature-page";
import { AccountSettings } from "@/features/account/account-settings";

export const metadata = { title: "Your account" };

export default function AccountPage() {
  return (
    <FeaturePage title="Your account" description="A few details, all in your control.">
      <FeatureLinks />
      <AccountSettings />
    </FeaturePage>
  );
}
