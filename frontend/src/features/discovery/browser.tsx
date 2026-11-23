"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Search, SlidersHorizontal, X } from "lucide-react";
import { stories, topics } from "@/content/catalog";
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
      <Form action="/explore" className="search-composer">
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
      <div className="browse-filters">
        <div className="filter-controls">
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
      <div className="results-bar">
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
      <div className="browse-results" aria-busy={pending}>
        {found.length ? (
          resultPage.items.map(({ story }) => (
            <article className="result-story" key={story.slug}>
              <Link href={`/stories/${story.slug}`} className="result-image">
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
                <div className="story-meta">
                  <span>
                    <Clock3 aria-hidden="true" />≈ {story.minutes} min
                  </span>
                  <span>
                    <BookOpen aria-hidden="true" />
                    {story.chapters.length} chapters
                  </span>
                </div>
                <span className="result-topic">
                  {story.topic} · {story.period}
                </span>
              </div>
              <Button asChild variant="ghost" size="icon" className="touch-icon">
                <Link href={`/stories/${story.slug}`} aria-label={`Explore ${story.title}`}>
                  <ArrowRight />
                </Link>
              </Button>
            </article>
          ))
        ) : (
          <div className="empty-state">
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
