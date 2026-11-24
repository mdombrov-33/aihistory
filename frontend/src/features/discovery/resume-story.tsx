"use client";

// Resume link derived from the guest’s saved scene and passage position.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useJourney } from "@/state/guest/store";
import { stories, getStory, getSceneCount } from "@/content/catalog/catalog";

export function ResumeStory({ featured = false }: { featured?: boolean }) {
  const { progress } = useJourney();

  const entry = Object.entries(progress)
    .filter(([slug]) => getStory(slug))
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)[0];

  if (!entry) {
    if (!featured) return null;

    const story = stories[0];

    return (
      <section
        className="resume-card mx-0 p-[15px] gap-5.5 flex items-center mt-0 mb-7 bg-secondary rounded-[12px] max-[760px]:p-3 max-[760px]:gap-[13px] max-[760px]:mb-[23px] max-[760px]:flex-wrap"
        aria-label="A place to begin"
      >
        <div className="resume-image overflow-hidden h-19 [aspect-ratio:1.4] relative rounded-[6px] shrink-0 max-[760px]:h-15.5 [&_>_svg]:absolute [&_>_svg]:left-[50%] [&_>_svg]:top-[50%] [&_>_svg]:[transform:translate(-50%,_-50%)] [&_>_svg]:fill-[#fff] [&_>_svg]:text-foreground [&_>_svg]:[filter:drop-shadow(0_2px_8px_var(--foreground))]">
          <Image src={story.image} alt="" fill sizes="200px" />
        </div>
        <div className="resume-description flex-1 [&_>_span]:text-[12px] [&_>_span]:text-muted-foreground max-[760px]:[&_>_span]:text-[11px] [&_h2]:my-0.5 [&_h2]:mx-0 [&_h2]:text-[23px] max-[760px]:[&_h2]:text-[20px] [&_p]:text-[14px] [&_p]:text-muted-foreground max-[760px]:[&_p]:text-[12px]">
          <span>A place to begin</span>
          <h2>{story.title}</h2>
          <p>{story.question}</p>
        </div>
        <div className="featured-length text-[14px] text-foreground whitespace-nowrap max-[760px]:hidden">
          {story.chapters.length} chapters · ≈ {story.minutes} min
        </div>
        <Button asChild>
          <Link href={`/stories/${story.slug}`}>
            Explore
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </section>
    );
  }

  const story = getStory(entry[0]);

  if (!story) return null;

  const position = entry[1];

  return (
    <section
      className="resume-card mx-0 p-[15px] gap-5.5 flex items-center mt-0 mb-7 bg-secondary rounded-[12px] max-[760px]:p-3 max-[760px]:gap-[13px] max-[760px]:mb-[23px] max-[760px]:flex-wrap"
      aria-label="Continue your last story"
    >
      <div className="resume-image overflow-hidden h-19 [aspect-ratio:1.4] relative rounded-[6px] shrink-0 max-[760px]:h-15.5 [&_>_svg]:absolute [&_>_svg]:left-[50%] [&_>_svg]:top-[50%] [&_>_svg]:[transform:translate(-50%,_-50%)] [&_>_svg]:fill-[#fff] [&_>_svg]:text-foreground [&_>_svg]:[filter:drop-shadow(0_2px_8px_var(--foreground))]">
        <Image src={story.image} alt="" fill sizes="150px" />
        <Play aria-hidden="true" />
      </div>
      <div className="resume-description flex-1 [&_>_span]:text-[12px] [&_>_span]:text-muted-foreground max-[760px]:[&_>_span]:text-[11px] [&_h2]:my-0.5 [&_h2]:mx-0 [&_h2]:text-[23px] max-[760px]:[&_h2]:text-[20px] [&_p]:text-[14px] [&_p]:text-muted-foreground max-[760px]:[&_p]:text-[12px]">
        <span>{position.finished ? "Open again, see something new" : "Your last open page"}</span>
        <h2>{story.title}</h2>
        <p>
          {position.finished
            ? "Story finished · always yours to revisit"
            : `Scene ${position.scene + 1} · Pick up where you left off`}
        </p>
      </div>
      <div className="resume-progress w-25 max-[760px]:hidden">
        <Progress
          value={
            position.finished
              ? 100
              : Math.min(95, ((position.scene + 1) / getSceneCount(story)) * 100)
          }
          aria-label="Your place in the story"
        />
      </div>
      <Button asChild>
        <Link href={`/stories/${story.slug}/play/${position.scene}?passage=${position.passage}`}>
          {position.finished ? "Revisit" : "Continue"}
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}
