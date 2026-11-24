// Server route for create; composes prepared data and feature views.

import { PageHeading, PageFooter } from "@/components/app/shell";
import { CreateStory } from "@/features/creation/create-story";

export const metadata = { title: "Follow a new question" };

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main id="main-content" className="page-width">
      <PageHeading
        title="What opens a world for you?"
        description="A question is a good place to begin."
      />
      <CreateStory initialQuestion={typeof q === "string" ? q : ""} />
      <PageFooter />
    </main>
  );
}
