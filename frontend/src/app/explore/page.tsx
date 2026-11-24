// Server route for explore; composes prepared data and feature views.

import { PageFooter, PageHeading } from "@/components/app/shell";
import { StoryBrowser } from "@/features/discovery/browser";

export const metadata = { title: "Explore stories" };

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
    era: read("era", "all"),
    sort: read("sort", "relevance"),
    page: read("page", "1"),
  };

  return (
    <main id="main-content" className="page-width">
      <PageHeading
        title="Follow a thread."
        description="People, places, ideas and turning points. Find a story that opens a door."
      />
      <StoryBrowser key={JSON.stringify(initial)} initial={initial} />
      <PageFooter />
    </main>
  );
}
