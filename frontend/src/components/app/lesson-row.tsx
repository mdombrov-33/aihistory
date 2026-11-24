// Compact catalog and library entry; source imagery stays separate from readable lesson information.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { ReactNode } from "react";
import type { StorySummary } from "@/features/lesson/contracts/catalog";
import { cn } from "@/lib/utils";

export function LessonRow({
  story,
  children,
  className,
}: {
  story: StorySummary;
  children?: ReactNode;
  className?: string;
}) {
  const image = story.slug === "shape-a-sound" ? "/images/home/piano-strings.webp" : story.image;

  return (
    <article
      className={cn(
        "lesson-row grid grid-cols-[80px_minmax(0,1fr)] items-center gap-4 border-b border-rule py-5 sm:grid-cols-[144px_minmax(0,1fr)] sm:gap-6",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-card">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width:640px) 80px,144px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h2 className="text-xl leading-tight sm:text-2xl">
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex min-h-11 items-center gap-3 hover:text-primary"
          >
            {story.title}
            <ArrowRight
              className="hidden size-4 shrink-0 text-muted-foreground sm:block"
              aria-hidden="true"
            />
          </Link>
        </h2>
        <p className="mt-1 max-w-[76ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
          {story.question}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
          <span>{story.topic}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {story.minutes} min
          </span>
          <span>{story.chapters.length} chapters</span>
        </div>
        {children}
      </div>
    </article>
  );
}
