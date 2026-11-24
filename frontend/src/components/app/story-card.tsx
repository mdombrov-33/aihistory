// Prepared lesson cards use explicit home/collection variants rather than ancestor overrides.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { cva } from "class-variance-authority";
import type { StorySummary } from "@/features/lesson/contracts/catalog";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "story-card group/story relative block isolate overflow-hidden bg-card text-(--hero-text)",
  {
    variants: {
      placement: {
        collection:
          "col-auto min-h-[285px] rounded-[12px] max-[1050px]:min-h-[275px] max-[760px]:min-h-[300px] max-[760px]:first:min-h-[355px] max-[400px]:min-h-[315px] max-[400px]:first:min-h-[340px] min-[1600px]:min-h-[300px]",
        home: "col-span-2 min-h-[280px] rounded-[13px] border border-rule/40 max-[760px]:col-span-full max-[760px]:min-h-[275px] max-[760px]:first:min-h-[295px]",
      },
      featured: { true: "story-card-featured", false: "" },
    },
    compoundVariants: [
      { placement: "home", featured: true, className: "col-span-3 min-h-[275px]" },
    ],
    defaultVariants: { placement: "collection", featured: false },
  },
);

export function StoryCard({
  story,
  featured = false,
  priority = false,
  placement = "collection",
}: {
  story: StorySummary;
  featured?: boolean;
  priority?: boolean;
  placement?: "home" | "collection";
}) {
  const home = placement === "home";

  return (
    <Link href={`/stories/${story.slug}`} className={cn(cardVariants({ placement, featured }))}>
      <Image
        src={story.image}
        alt={story.imageAlt}
        fill
        sizes={featured ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 100vw, 33vw"}
        priority={priority}
        className="story-cover -z-2 object-[center_35%] transition-transform duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/story:scale-[1.035]"
      />
      <div
        className={cn(
          "story-card-shade absolute inset-0 -z-1",
          home
            ? "[background:linear-gradient(180deg,transparent_25%,color-mix(in_srgb,var(--art-ink)_33%,transparent)_55%,color-mix(in_srgb,var(--art-ink)_93%,transparent)_100%)]"
            : "[background:linear-gradient(180deg,transparent_15%,color-mix(in_srgb,var(--art-ink)_33%,transparent)_45%,color-mix(in_srgb,var(--art-ink)_95%,transparent)_100%)]",
        )}
      />
      <div
        className={cn(
          "story-card-content absolute",
          home
            ? "right-[55px] bottom-5 left-5.5 max-[760px]:right-[45px] max-[760px]:left-5"
            : "right-[54px] bottom-6.5 left-7 max-[1050px]:right-10 max-[1050px]:left-5.5 max-[760px]:right-4.5 max-[760px]:bottom-[23px] max-[760px]:left-4.5 max-[400px]:right-7.5 max-[400px]:left-[23px]",
        )}
      >
        <h2
          className={cn(
            "[text-shadow:0_2px_8px_color-mix(in_srgb,var(--art-ink)_27%,transparent)]",
            home
              ? featured
                ? "text-[38px] max-[760px]:text-[33px]"
                : "text-[32px] max-[760px]:text-[33px]"
              : "text-[30px] max-[1050px]:text-[27px] max-[760px]:group-first/story:text-[37px] max-[400px]:text-[31px]",
          )}
        >
          {story.title}
        </h2>
        <p
          className={cn(
            "mt-[9px] text-(--hero-text) leading-[1.35] max-[760px]:leading-[1.4]",
            home
              ? "mb-4 max-w-[48ch] text-[16px] max-[760px]:mb-3.5 max-[760px]:text-[15px]"
              : "mb-4.5 max-w-[32ch] text-[16px] max-[1050px]:text-[15px] max-[760px]:mb-3.5 max-[760px]:text-[14px] max-[760px]:group-first/story:text-[18px] max-[400px]:text-[16px]",
          )}
        >
          {story.question}
        </p>
        <div className="story-meta flex flex-wrap gap-[17px] text-[13px] text-(--hero-muted) max-[760px]:gap-2 max-[760px]:text-[11px] max-[400px]:gap-[15px] max-[400px]:text-[12px] [&_span]:inline-flex [&_span]:items-center [&_span]:gap-1.5 [&_svg]:size-3.5 max-[760px]:[&_svg]:size-3">
          <span>
            <BookOpen aria-hidden="true" />
            {story.chapters.length} chapters
          </span>
          <span>
            <Clock3 aria-hidden="true" />≈ {story.minutes} min
          </span>
        </div>
      </div>
      <span
        className={cn(
          "story-enter absolute grid place-items-center rounded-full",
          home
            ? "right-5 bottom-5 size-10 bg-primary text-primary-foreground max-[760px]:right-4 max-[760px]:size-8.5 [&_svg]:w-[21px] max-[760px]:[&_svg]:w-[19px]"
            : "right-5.5 bottom-7 size-8.5 border border-border/42 max-[760px]:hidden [&_svg]:w-[17px]",
        )}
        aria-hidden="true"
      >
        <ArrowRight />
      </span>
    </Link>
  );
}
