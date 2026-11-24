// Server route for explore; composes prepared data and feature views.

import { PageFooter, PageHeading } from "@/components/app/shell";
import { StoryBrowser } from "@/features/discovery/browser";

export const metadata = { title: "Explore lessons" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const read = (k: string, fallback: string) =>
    typeof params[k] === "string" ? params[k] : fallback;

  const initial = {
    q: read("q", ""),
    topic: read("topic", "all"),
    sort: read("sort", "relevance"),
    page: read("page", "1"),
  };

  return (
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <PageHeading
        compact
        title="Explore lessons"
        description="Find something you want to understand. Search by question or browse a topic."
      />
      <StoryBrowser key={JSON.stringify(initial)} initial={initial} />
      <PageFooter />
    </main>
  );
}
