"use client";

// Device-local saved stories, progress, paragraph bookmarks and prepared questions.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Compass, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LessonRow } from "@/components/app/lesson-row";
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

  const continuing = visited.find(([, progress]) => !progress.finished);

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
      <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        Guest library · saved on this device.
        <Link
          href="/create-account"
          className="inline-flex min-h-11 items-center gap-1 text-primary underline underline-offset-4"
        >
          About accounts
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </p>
      {continuing ? (
        <section
          className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-5"
          aria-label="Continue learning"
        >
          <div className="min-w-0">
            <h2 className="text-sm font-sans font-semibold text-muted-foreground">
              Continue learning
            </h2>
            <p className="mt-1 font-heading text-2xl">{getStory(continuing[0])!.title}</p>
          </div>
          <Button asChild>
            <Link
              href={`/stories/${continuing[0]}/play/${continuing[1].scene}?passage=${continuing[1].passage}`}
            >
              Continue
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      ) : null}
      <Tabs
        value={view}
        onValueChange={(value) => {
          const next = new URLSearchParams(query);

          next.set("view", value);
          router.replace("/my-space?" + next.toString(), { scroll: false });
        }}
      >
        <div className="mb-5 overflow-x-auto pb-2">
          <TabsList
            variant="line"
            className="space-tabs group-data-horizontal/tabs:h-auto min-h-12 w-max justify-start gap-1 border-b border-rule px-0"
          >
            <TabsTrigger
              value="stories"
              className="h-11 min-h-11 flex-none px-3 text-sm data-active:after:bg-primary"
            >
              Lessons
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="h-11 min-h-11 flex-none px-3 text-sm data-active:after:bg-primary"
            >
              Bookmarks ({availableBookmarks.length})
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="h-11 min-h-11 flex-none px-3 text-sm data-active:after:bg-primary"
            >
              Questions
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="stories">
          <section className="space-section mb-9 [&>h2]:mb-3">
            {visited.length ? (
              <>
                <h2 className="text-2xl">Recently opened</h2>
                <div className="space-story-list">
                  {storyPage.items.map(([slug, progress]) => {
                    const story = getStory(slug)!;

                    return (
                      <LessonRow key={slug} story={story}>
                        <div className="space-story-status mt-2 flex flex-wrap items-center gap-x-5 text-sm text-muted-foreground [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-2 [&_svg]:size-4">
                          <span>
                            {progress.finished
                              ? "Finished"
                              : `Scene ${progress.scene + 1} of ${getSceneCount(story)}`}
                          </span>
                          <Link
                            href={`/stories/${slug}/play/${progress.scene}?passage=${progress.passage}`}
                            className="text-primary underline [text-underline-offset:4px]"
                          >
                            {progress.finished ? "Revisit" : "Continue"}
                            <ArrowRight />
                          </Link>
                        </div>
                      </LessonRow>
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
              <div className="empty-state my-7.5 mx-auto py-[55px] px-6 text-center max-w-[650px] [&_>_svg]:mx-auto [&_>_svg]:w-10 [&_>_svg]:h-10 [&_>_svg]:mt-0 [&_>_svg]:mb-5.5 [&_>_svg]:text-primary [&_>_svg]:[stroke-width:1.3] [&_p]:mx-auto [&_p]:mt-4 [&_p]:mb-6 [&_p]:text-muted-foreground [&_[data-slot=button]]:m-[5px]">
                <Compass />
                <h2>Start your library.</h2>
                <p>Open a lesson and your progress will appear here. You can explore as a guest.</p>
                <Button asChild>
                  <Link href="/explore">
                    Explore lessons
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </section>
          <section className="space-section mb-9 [&>h2]:mb-3">
            <h2 className="text-2xl">Saved lessons</h2>
            {savedPage.total ? (
              <div className="space-story-list">
                {savedPage.items.map((story) => (
                  <LessonRow key={story.slug} story={story} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Save a lesson from its overview page to keep it here. Individual passages appear in
                Bookmarks.
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
          <section className="space-section mb-9 [&>h2]:mb-3">
            {bookmarked.length ? (
              <>
                <h2 className="text-2xl">Saved passages</h2>
                <div className="bookmark-list gap-4.5 grid">
                  {bookmarked.map((story) => (
                    <section
                      className="bookmark-group p-6 bg-card rounded-[10px] max-[760px]:p-5 [&_>_h3]:mb-2"
                      key={story.slug}
                    >
                      <h3>
                        <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                      </h3>
                      {bookmarkPage.items
                        .filter((b) => b.story === story.slug)
                        .map((bookmark) => (
                          <div
                            className="bookmark-row py-4.5 px-0 gap-4 flex items-center [border-bottom:1px_solid_var(--line-soft)] max-[760px]:gap-2.5 [&_>_a]:flex-1 [&_p]:text-muted-foreground [&_p]:text-[14px] [&_p]:mt-1 [&_svg]:w-[19px]"
                            key={bookmark.id}
                          >
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
              <div className="empty-state my-7.5 mx-auto py-[55px] px-6 text-center max-w-[650px] [&_>_svg]:mx-auto [&_>_svg]:w-10 [&_>_svg]:h-10 [&_>_svg]:mt-0 [&_>_svg]:mb-5.5 [&_>_svg]:text-primary [&_>_svg]:[stroke-width:1.3] [&_p]:mx-auto [&_p]:mt-4 [&_p]:mb-6 [&_p]:text-muted-foreground [&_[data-slot=button]]:m-[5px]">
                <Bookmark />
                <h2>Keep a passage worth returning to.</h2>
                <p>
                  Keep a passage while you read or listen. Bookmarks are grouped by lesson and
                  return you to the place you chose.
                </p>
                <Button asChild variant="outline">
                  <Link href="/explore">
                    Explore lessons
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </TabsContent>
        <TabsContent value="requests">
          <section className="space-section mb-9 [&>h2]:mb-3">
            <h2 className="text-2xl">Saved questions</h2>
            {journey.creations.length ? (
              <div className="bookmark-list gap-4.5 grid">
                {requestPage.items.map((creation) => (
                  <Link
                    key={creation.id}
                    href={`/creations/${creation.id}`}
                    className="bookmark-group p-6 bg-card rounded-[10px] max-[760px]:p-5 [&_>_h3]:mb-2"
                  >
                    <h3>{creation.question}</h3>
                    <p className="mt-3 text-muted-foreground">Saved question · {creation.scope}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state my-7.5 mx-auto py-[55px] px-6 text-center max-w-[650px] [&_>_svg]:mx-auto [&_>_svg]:w-10 [&_>_svg]:h-10 [&_>_svg]:mt-0 [&_>_svg]:mb-5.5 [&_>_svg]:text-primary [&_>_svg]:[stroke-width:1.3] [&_p]:mx-auto [&_p]:mt-4 [&_p]:mb-6 [&_p]:text-muted-foreground [&_[data-slot=button]]:m-[5px]">
                <h3>What have you always wondered?</h3>
                <p>
                  Save a question to return to later. New lesson generation is not connected yet.
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
