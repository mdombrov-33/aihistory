"use client";

// Topic search and compact prepared-lesson results, with shareable filters and pagination.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { stories, topics } from "@/content/catalog/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LessonRow } from "@/components/app/lesson-row";
import { CollectionPagination } from "@/components/app/collection-pagination";
import { useJourney } from "@/state/guest/store";
import { paginate } from "@/lib/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filters = { q: string; topic: string; sort: string; page: string; duration: string };

export function StoryBrowser({ initial }: { initial: Filters }) {
  const { product } = useJourney();
  const [query, setQuery] = useState(initial.q);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const words = initial.q.toLocaleLowerCase("en").split(/\s+/).filter(Boolean);

  const matches = stories.filter(
    (s) =>
      (initial.topic === "all" || s.topic === initial.topic) &&
      (initial.duration === "short"
        ? s.minutes < 10
        : initial.duration === "long"
          ? s.minutes >= 10
          : true),
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

  function rating(slug: string) {
    const values = Object.values(product.reviews[slug]?.ratings ?? {}).filter((v) => v > 0);

    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  found.sort(
    initial.sort === "title"
      ? (a, b) => a.story.title.localeCompare(b.story.title)
      : initial.sort === "rated"
        ? (a, b) => rating(b.story.slug) - rating(a.story.slug)
        : initial.sort === "latest"
          ? (a, b) => stories.indexOf(b.story) - stories.indexOf(a.story)
          : (a, b) => b.score - a.score,
  );

  function filter(key: keyof Filters, value: string) {
    const params = new URLSearchParams({ ...initial, [key]: value });

    params.delete("page");

    for (const k of [...params.keys()])
      if (!params.get(k) || params.get(k) === "all" || params.get(k) === "relevance")
        params.delete(k);

    startTransition(() => router.replace(`/explore?${params.toString()}`, { scroll: false }));
  }

  const resultPage = paginate(found, initial.page, 6);
  const filtered = Boolean(initial.q || initial.topic !== "all" || initial.duration !== "all");

  return (
    <div className="pb-8">
      <Form
        action="/explore"
        className="catalog-search flex w-full max-w-[880px] items-center gap-2 rounded-xl border border-input bg-card p-1.5 pl-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background sm:gap-3 sm:pl-4"
      >
        {["topic", "sort", "duration"].map((key) => (
          <input key={key} type="hidden" name={key} value={initial[key as keyof Filters]} />
        ))}
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Label htmlFor="explore-query" className="sr-only">
          Search lessons
        </Label>
        <Input
          id="explore-query"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a topic or question"
          className="h-11 min-w-0 flex-1 border-0 bg-transparent px-1 text-base shadow-none focus-visible:ring-0"
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
        <Button type="submit" className="px-3 sm:px-5">
          Search
        </Button>
      </Form>
      <div className="my-5 flex flex-wrap items-center gap-3">
        <Select value={initial.topic} onValueChange={(v) => filter("topic", v)}>
          <SelectTrigger
            aria-label="Filter lessons by topic"
            className="min-h-11 max-w-full text-sm"
          >
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
        <Select value={initial.duration} onValueChange={(value) => filter("duration", value)}>
          <SelectTrigger aria-label="Filter lessons by duration" className="min-h-11 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any length</SelectItem>
            <SelectItem value="short">Under 10 minutes</SelectItem>
            <SelectItem value="long">10 minutes or more</SelectItem>
          </SelectContent>
        </Select>
        {filtered ? (
          <Button variant="ghost" asChild className="px-3 text-sm">
            <Link href="/explore">Clear filters</Link>
          </Button>
        ) : null}
      </div>
      <div className="results-bar flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 text-sm text-muted-foreground">
        <p aria-live="polite">
          {found.length} {found.length === 1 ? "lesson" : "lessons"}
          {initial.q ? ` for “${initial.q}”` : " to explore"}
        </p>
        <Select value={initial.sort} onValueChange={(v) => filter("sort", v)}>
          <SelectTrigger aria-label="Sort lessons" className="min-h-11 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most relevant</SelectItem>
            <SelectItem value="title">Title A–Z</SelectItem>
            <SelectItem value="latest">Latest · sample order</SelectItem>
            <SelectItem value="rated">Highest rated by you</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {initial.sort === "latest" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Sample publication order for the frontend preview; live publication dates are not
          connected.
        </p>
      ) : null}
      <div className="browse-results" aria-busy={pending}>
        {found.length ? (
          resultPage.items.map(({ story }) => (
            <LessonRow key={story.slug} story={story} className="result-story" />
          ))
        ) : (
          <div className="empty-state mx-auto max-w-[480px] py-14 text-center">
            <h2 className="text-2xl">No lessons found.</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Try another word or browse all topics. You can also save your question for later.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/explore">Show all lessons</Link>
              </Button>
              <Button asChild>
                <Link href={`/create?q=${encodeURIComponent(initial.q)}`}>
                  Save your question
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
        label="Lessons"
      />
    </div>
  );
}
