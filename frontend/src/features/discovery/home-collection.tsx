"use client";

// A small image-led entry into real prepared lessons, with simple local subject filters.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import type { StorySummary } from "@/features/lesson/contracts/catalog";

const choices = [
  "All",
  "Music & sound",
  "Art & ideas",
  "People & daily life",
  "Trade & connection",
];

const covers: Record<string, { image: string; alt: string; note?: string }> = {
  "shape-a-sound": {
    image: "/images/home/piano-strings.webp",
    alt: "Generated illustration of a grand piano’s strings and a hand at the keys.",
    note: "Illustrative cover",
  },
};

export function HomeCollection({ stories }: { stories: readonly StorySummary[] }) {
  const [topic, setTopic] = useState("All");
  const shown = stories.filter((story) => topic === "All" || story.topic === topic);

  return (
    <section className="pb-14 pt-16 sm:pb-20 sm:pt-24" aria-labelledby="collection-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h2 id="collection-title" className="text-[clamp(30px,3vw,44px)]">
          Follow another thread.
        </h2>
        <Link
          href="/explore"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-primary hover:underline"
        >
          All prepared lessons <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <fieldset className="mb-7 mt-5 flex min-w-0 flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">Discover by subject</legend>
        {choices.map((choice) => (
          <button
            type="button"
            key={choice}
            aria-pressed={topic === choice}
            onClick={() => setTopic(choice)}
            className="min-h-11 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {choice === "Music & sound"
              ? "Music"
              : choice === "Art & ideas"
                ? "Art"
                : choice === "People & daily life"
                  ? "People & places"
                  : choice === "Trade & connection"
                    ? "Connection"
                    : "All topics"}
          </button>
        ))}
      </fieldset>
      <div className="grid gap-5" aria-live="polite">
        {shown.map((story) => {
          const cover = covers[story.slug] ?? { image: story.image, alt: story.imageAlt };

          return (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="story-card group grid min-w-0 overflow-hidden rounded-2xl border border-rule bg-card text-foreground sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
            >
              <div className="relative aspect-[1.8] overflow-hidden sm:aspect-auto sm:min-h-[250px] lg:min-h-[290px]">
                <Image
                  src={cover.image}
                  alt={cover.alt}
                  fill
                  sizes="(max-width:760px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                />
                {cover.note ? (
                  <span className="absolute bottom-3 left-3 rounded-md bg-art-ink/90 px-2.5 py-1 text-[11px] text-on-art">
                    {cover.note}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col justify-center px-6 py-7 sm:px-8 lg:px-10">
                <h3 className="max-w-[28ch] text-[clamp(25px,2.5vw,37px)] leading-[1.12] group-hover:underline group-hover:underline-offset-4">
                  {story.question}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {story.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="size-4" aria-hidden="true" />
                    {story.chapters.length} chapters
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="size-4" aria-hidden="true" />≈ {story.minutes} min
                  </span>
                  <span className="ml-auto grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
