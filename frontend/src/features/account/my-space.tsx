"use client";

// Device-local saved stories, progress, paragraph bookmarks and prepared questions.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Compass, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StoryCard } from "@/components/app/story-card";
import { ResumeStory } from "@/features/discovery/resume-story";
import { getStory, getSceneCount, stories } from "@/content/catalog/catalog";
import { removeBookmark } from "@/state/guest/actions";
import { useJourney } from "@/state/guest/store";
import { paginate } from "@/lib/pagination";
import { CollectionPagination } from "@/components/app/collection-pagination";

export function MySpace({ query }: { query: string }) {
  const router = useRouter();
  const params = new URLSearchParams(query);
  const journey = useJourney();

  const visited = Object.entries(journey.progress)
    .filter(([slug]) => getStory(slug))
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt);

  const storyPage = paginate(visited, params.get("storiesPage"), 4);

  const savedPage = paginate(
    stories.filter((s) => journey.saved.includes(s.slug)),
    params.get("savedPage"),
    4,
  );

  const availableBookmarks = journey.bookmarks.filter((b) => getStory(b.story));

  const bookmarkPage = paginate(
    [...availableBookmarks].sort((a, b) => b.createdAt - a.createdAt),
    params.get("bookmarksPage"),
    6,
  );

  const bookmarked = stories.filter((s) => bookmarkPage.items.some((b) => b.story === s.slug));

  const requestPage = paginate(
    [...journey.creations].sort((a, b) => b.createdAt - a.createdAt),
    params.get("questionsPage"),
    6,
  );

  const view = ["stories", "bookmarks", "requests"].includes(params.get("view") ?? "")
    ? params.get("view")!
    : "stories";

  return (
    <>
      <div className="preview-notice">
        <p>
          You’re exploring as a guest. Your place is saved in this browser.{" "}
          <Link href="/create-account" className="text-link">
            Preview account benefits
            <ArrowRight className="inline size-3" />
          </Link>
        </p>
      </div>
      <ResumeStory />
      <Tabs
        value={view}
        onValueChange={(value) => {
          const next = new URLSearchParams(query);

          next.set("view", value);
          router.replace("/my-space?" + next.toString(), { scroll: false });
        }}
      >
        <TabsList className="space-tabs h-auto flex-wrap">
          <TabsTrigger value="stories" className="min-h-11 px-4">
            Your stories
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="min-h-11 px-4">
            Bookmarks ({availableBookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="min-h-11 px-4">
            Your questions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stories">
          <section className="space-section">
            {visited.length ? (
              <>
                <h2>Places you’ve been.</h2>
                <div className="space-story-grid">
                  {storyPage.items.map(([slug, progress]) => {
                    const story = getStory(slug)!;

                    return (
                      <div key={slug}>
                        <StoryCard story={story} />
                        <div className="space-story-status">
                          <span>
                            {progress.finished
                              ? "Finished"
                              : `Scene ${progress.scene + 1} of ${getSceneCount(story)}`}
                          </span>
                          <Link
                            href={`/stories/${slug}/play/${progress.scene}?passage=${progress.passage}`}
                            className="text-link"
                          >
                            {progress.finished ? "Revisit" : "Continue"}
                            <ArrowRight />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <CollectionPagination
                  {...storyPage}
                  path="/my-space"
                  query={query}
                  pageKey="storiesPage"
                  label="Your stories"
                />
              </>
            ) : (
              <div className="empty-state">
                <Compass />
                <h2>Your next connection starts here.</h2>
                <p>
                  Open a story and your place will appear here automatically. No account needed to
                  begin.
                </p>
                <Button asChild>
                  <Link href="/explore">
                    Find a story
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </section>
          <section className="space-section">
            <h2>Saved for another day.</h2>
            {savedPage.total ? (
              <div className="space-story-grid">
                {savedPage.items.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Save a whole story from its overview page. Keep specific passages in Bookmarks.
              </p>
            )}
            <CollectionPagination
              {...savedPage}
              path="/my-space"
              query={query}
              pageKey="savedPage"
              label="Saved stories"
            />
          </section>
        </TabsContent>
        <TabsContent value="bookmarks">
          <section className="space-section">
            {bookmarked.length ? (
              <>
                <h2>The pages you kept.</h2>
                <div className="bookmark-list">
                  {bookmarked.map((story) => (
                    <section className="bookmark-group" key={story.slug}>
                      <h3>
                        <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                      </h3>
                      {bookmarkPage.items
                        .filter((b) => b.story === story.slug)
                        .map((bookmark) => (
                          <div className="bookmark-row" key={bookmark.id}>
                            <Bookmark aria-hidden="true" />
                            <Link
                              href={`/stories/${story.slug}/play/${bookmark.scene}?passage=${bookmark.passage}`}
                            >
                              <strong>{bookmark.label}</strong>
                              <p>
                                Return to this exact passage
                                <ArrowRight className="inline ml-2 size-3" />
                              </p>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove bookmark ${bookmark.label}`}
                              onClick={() => {
                                removeBookmark(bookmark.id);
                                toast("Bookmark removed");
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ))}
                    </section>
                  ))}
                </div>
                <CollectionPagination
                  {...bookmarkPage}
                  path="/my-space"
                  query={query}
                  pageKey="bookmarksPage"
                  label="Bookmarks"
                />
              </>
            ) : (
              <div className="empty-state">
                <Bookmark />
                <h2>Some passages deserve a return.</h2>
                <p>
                  Keep any passage while you read or listen. Bookmarks are grouped by story and
                  return you to the place you chose.
                </p>
                <Button asChild variant="outline">
                  <Link href="/explore">
                    Explore stories
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </TabsContent>
        <TabsContent value="requests">
          <section className="space-section">
            <h2>Questions worth following.</h2>
            {journey.creations.length ? (
              <div className="bookmark-list">
                {requestPage.items.map((creation) => (
                  <Link
                    key={creation.id}
                    href={`/creations/${creation.id}`}
                    className="bookmark-group"
                  >
                    <h3>{creation.question}</h3>
                    <p className="mt-3 text-muted-foreground">
                      Saved design-preview request · {creation.scope}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>What have you always wondered?</h3>
                <p>
                  Save a question and explore how creating a new story will feel. Generation is not
                  connected in this preview.
                </p>
                <Button asChild>
                  <Link href="/create">
                    Follow a new question
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
            <CollectionPagination
              {...requestPage}
              path="/my-space"
              query={query}
              pageKey="questionsPage"
              label="Your questions"
            />
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
}
