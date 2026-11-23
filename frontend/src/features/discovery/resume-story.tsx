"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useJourney } from "@/lib/journey-store";
import { stories, getStory, getSceneCount } from "@/content/catalog";
export function ResumeStory({ featured = false }: { featured?: boolean }) {
  const { progress } = useJourney();
  const entry = Object.entries(progress)
    .filter(([slug]) => getStory(slug))
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)[0];
  if (!entry) {
    if (!featured) return null;
    const story = stories[0];
    return (
      <section className="resume-card" aria-label="A place to begin">
        <div className="resume-image">
          <Image src={story.image} alt="" fill sizes="200px" />
        </div>
        <div className="resume-description">
          <span>A place to begin</span>
          <h2>{story.title}</h2>
          <p>{story.question}</p>
        </div>
        <div className="featured-length">
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
    <section className="resume-card" aria-label="Continue your last story">
      <div className="resume-image">
        <Image src={story.image} alt="" fill sizes="150px" />
        <Play aria-hidden="true" />
      </div>
      <div className="resume-description">
        <span>{position.finished ? "Open again, see something new" : "Your last open page"}</span>
        <h2>{story.title}</h2>
        <p>
          {position.finished
            ? "Story finished · always yours to revisit"
            : `Scene ${position.scene + 1} · Pick up where you left off`}
        </p>
      </div>
      <div className="resume-progress">
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
