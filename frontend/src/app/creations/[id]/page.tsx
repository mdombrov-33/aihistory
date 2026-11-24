// Server route for creations/[id]; composes prepared data and feature views.

import { CreationStatus } from "@/features/creation/creation-status";
import { PageFooter } from "@/components/app/shell";

export const metadata = { title: "Your question" };

export default async function CreationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main id="main-content" className="page-width">
      <CreationStatus id={id} />
      <PageFooter />
    </main>
  );
}
