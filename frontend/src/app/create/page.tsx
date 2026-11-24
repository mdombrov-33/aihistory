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
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <PageHeading
        compact
        title="What would you like to learn?"
        description="Start with a question. Keep it here, or explore a related lesson."
      />
      <CreateStory initialQuestion={typeof q === "string" ? q : ""} />
      <PageFooter />
    </main>
  );
}
