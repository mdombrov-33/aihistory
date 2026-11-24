// Saved question, editable outline and preparation/recovery preview.

import { FeaturePage } from "@/components/app/feature-page";
import { CreationStatus } from "@/features/creation/creation-status";

export const metadata = { title: "Your lesson plan" };

export default async function CreationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ share?: string }>;
}) {
  return (
    <FeaturePage title="Your lesson plan">
      <CreationStatus id={(await params).id} share={(await searchParams).share} />
    </FeaturePage>
  );
}
