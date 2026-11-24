// Server route for settings; composes prepared data and feature views.

import { PageHeading, PageFooter } from "@/components/app/shell";
import { Preferences } from "@/features/settings/preferences";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <main id="main-content" className="page-width">
      <PageHeading
        title="Make yourself at home."
        description="Choose how your stories look, sound and feel."
      />
      <Preferences />
      <PageFooter />
    </main>
  );
}
