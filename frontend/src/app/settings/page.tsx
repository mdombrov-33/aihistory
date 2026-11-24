// Server route for settings; composes prepared data and feature views.

import { PageHeading, PageFooter } from "@/components/app/shell";
import { Preferences } from "@/features/settings/preferences";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <PageHeading
        compact
        title="Settings"
        description="Choose your appearance, sound and reading preferences."
      />
      <Preferences />
      <PageFooter />
    </main>
  );
}
