// Server route for creations/[id]; composes prepared data and feature views.

import { CreationStatus } from "@/features/creation/creation-status";
import { PageFooter } from "@/components/app/shell";

export const metadata = { title: "Your question" };

export default async function CreationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <CreationStatus id={id} />
      <PageFooter />
    </main>
  );
}
