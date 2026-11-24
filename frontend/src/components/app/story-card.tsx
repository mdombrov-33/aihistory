// Prepared lesson preview for discovery and personal collections.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import type { StorySummary } from "@/features/lesson/contracts/catalog";
import { cn } from "@/lib/utils";

export function StoryCard({
  story,
  featured = false,
  priority = false,
}: {
  story: StorySummary;
  featured?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className={cn("story-card", featured && "story-card-featured")}
    >
      <Image
        src={story.image}
        alt={story.imageAlt}
        fill
        sizes={featured ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 100vw, 33vw"}
        priority={priority}
        className="story-cover"
      />
      <div className="story-card-shade" />
      <div className="story-card-content">
        <h2>{story.title}</h2>
        <p>{story.question}</p>
        <div className="story-meta">
          <span>
            <BookOpen aria-hidden="true" />
            {story.chapters.length} chapters
          </span>
          <span>
            <Clock3 aria-hidden="true" />≈ {story.minutes} min
          </span>
        </div>
      </div>
      <span className="story-enter" aria-hidden="true">
        <ArrowRight />
      </span>
    </Link>
  );
}
