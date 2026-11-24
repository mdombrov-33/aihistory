"use client";

// Searchable/filterable prepared catalog with URL-based pagination.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Search, SlidersHorizontal, X } from "lucide-react";
import { stories, topics } from "@/content/catalog/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollectionPagination } from "@/components/app/collection-pagination";
import { paginate } from "@/lib/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filters = { q: string; topic: string; era: string; sort: string; page: string };

export function StoryBrowser({ initial }: { initial: Filters }) {
  const [query, setQuery] = useState(initial.q);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const words = initial.q.toLocaleLowerCase("en").split(/\s+/).filter(Boolean);

  const matches = stories.filter(
    (s) =>
      (initial.topic === "all" || s.topic === initial.topic) &&
      (initial.era === "all" || s.era === initial.era),
  );

  const scored = matches.map((story) => ({
    story,
    score: words.filter((w) =>
      `${story.title} ${story.question} ${story.description} ${story.topic} ${story.scope}`
        .toLocaleLowerCase("en")
        .includes(w),
    ).length,
  }));

  const found = words.length ? scored.filter((s) => s.score > 0) : scored;

  found.sort(
    initial.sort === "title"
      ? (a, b) => a.story.title.localeCompare(b.story.title)
      : (a, b) => b.score - a.score,
  );

  function filter(key: keyof Filters, value: string) {
    const params = new URLSearchParams({ ...initial, [key]: value, page: "1" });

    params.delete("page");

    for (const k of [...params.keys()])
      if (!params.get(k) || params.get(k) === "all" || params.get(k) === "relevance")
        params.delete(k);

    startTransition(() => router.replace(`/explore?${params.toString()}`, { scroll: false }));
  }

  const resultPage = paginate(found, initial.page, 4);

  return (
    <>
      <Form
        action="/explore"
        className="search-composer [&_>_svg]:w-[23px] [&_>_svg]:text-primary max-[760px]:[&_>_svg]:w-4.5"
      >
        {["topic", "era", "sort"].map((key) => (
          <input key={key} type="hidden" name={key} value={initial[key as keyof Filters]} />
        ))}
        <Search aria-hidden="true" />
        <Label htmlFor="explore-query" className="sr-only">
          Search lessons
        </Label>
        <Input
          id="explore-query"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="A question, an idea, something you want to understand…"
        />
        {query ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Clear search text"
            onClick={() => setQuery("")}
          >
            <X />
          </Button>
        ) : null}
        <Button type="submit">
          Find a story
          <ArrowRight aria-hidden="true" />
        </Button>
      </Form>
      <div className="browse-filters my-6 mx-0 gap-3 flex items-center justify-between max-[760px]:gap-1.5 max-[760px]:items-start">
        <div className="filter-controls gap-3 flex items-center max-[760px]:gap-2 max-[760px]:flex-1 max-[760px]:flex-wrap [&_>_svg]:w-4.5 [&_>_svg]:text-muted-foreground max-[760px]:[&_>_svg]:hidden">
          <SlidersHorizontal aria-hidden="true" />
          <Select value={initial.topic} onValueChange={(v) => filter("topic", v)}>
            <SelectTrigger aria-label="Filter stories by topic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={initial.era} onValueChange={(v) => filter("era", v)}>
            <SelectTrigger aria-label="Filter stories by period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All periods</SelectItem>
              <SelectItem value="timeless">Timeless concepts</SelectItem>
              <SelectItem value="ancient">Ancient</SelectItem>
              <SelectItem value="medieval">Medieval</SelectItem>
              <SelectItem value="early-modern">Early modern</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/explore">Reset filters</Link>
        </Button>
      </div>
      <div className="results-bar my-5 mx-0 gap-3 flex items-center justify-between text-muted-foreground text-[15px] max-[760px]:text-[14px]">
        <p>
          {found.length} {found.length === 1 ? "story" : "stories"}{" "}
          {initial.q ? `for “${initial.q}”` : "to step inside"}
        </p>
        <Select value={initial.sort} onValueChange={(v) => filter("sort", v)}>
          <SelectTrigger aria-label="Sort stories">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most relevant</SelectItem>
            <SelectItem value="title">Title A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="browse-results gap-4.5 grid" aria-busy={pending}>
        {found.length ? (
          resultPage.items.map(({ story }) => (
            <article
              className="result-story p-4 gap-6.5 flex items-center bg-card rounded-[12px] max-[760px]:p-3 max-[760px]:gap-[15px] max-[760px]:items-start [&_>_div]:flex-1 [&_h2]:text-[29px] [&_h2]:mb-3 max-[760px]:[&_h2]:text-[24px] max-[760px]:[&_h2]:mb-[9px] [&_p]:text-[18px] [&_p]:text-muted-foreground [&_p]:mb-4.5 max-[760px]:[&_p]:text-[14px] max-[760px]:[&_p]:mb-3 max-[760px]:[&_p]:leading-[1.4]"
              key={story.slug}
            >
              <Link
                href={`/stories/${story.slug}`}
                className="result-image overflow-hidden w-[270px] [aspect-ratio:1.7] relative shrink-0 rounded-[8px] max-[760px]:w-[105px] max-[760px]:[aspect-ratio:0.83]"
              >
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 700px) 35vw, 280px"
                />
              </Link>
              <div>
                <h2>
                  <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                </h2>
                <p>{story.question}</p>
                <div className="story-meta gap-[17px] flex flex-wrap text-(--hero-muted) text-[13px] max-[760px]:gap-2 max-[760px]:text-[11px] max-[400px]:gap-[15px] max-[400px]:text-[12px] [&_span]:gap-1.5 [&_span]:inline-flex [&_span]:items-center [&_svg]:h-3.5 [&_svg]:w-3.5 max-[760px]:[&_svg]:h-3 max-[760px]:[&_svg]:w-3">
                  <span>
                    <Clock3 aria-hidden="true" />≈ {story.minutes} min
                  </span>
                  <span>
                    <BookOpen aria-hidden="true" />
                    {story.chapters.length} chapters
                  </span>
                </div>
                <span className="result-topic block text-muted-foreground text-[13px] mt-[13px] max-[760px]:text-[11px] max-[760px]:mt-2">
                  {story.topic} · {story.period}
                </span>
              </div>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="touch-icon p-2.5 min-w-11 min-h-11"
              >
                <Link href={`/stories/${story.slug}`} aria-label={`Explore ${story.title}`}>
                  <ArrowRight />
                </Link>
              </Button>
            </article>
          ))
        ) : (
          <div className="empty-state my-7.5 mx-auto py-[55px] px-6 text-center max-w-[650px] [&_>_svg]:mx-auto [&_>_svg]:w-10 [&_>_svg]:h-10 [&_>_svg]:mt-0 [&_>_svg]:mb-5.5 [&_>_svg]:text-primary [&_>_svg]:[stroke-width:1.3] [&_p]:mx-auto [&_p]:mt-4 [&_p]:mb-6 [&_p]:text-muted-foreground [&_[data-slot=button]]:m-[5px]">
            <Search aria-hidden="true" />
            <h2>No story fits those filters yet.</h2>
            <p>
              Try a broader topic or a different period. You can also keep your question for a new
              story.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/explore">Show all stories</Link>
              </Button>
              <Button asChild>
                <Link href={`/create?q=${encodeURIComponent(initial.q)}`}>
                  Keep following the question
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <CollectionPagination
        {...resultPage}
        path="/explore"
        query={new URLSearchParams(initial).toString()}
        label="Stories"
      />
    </>
  );
}
