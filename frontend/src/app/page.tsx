// Server route for the discovery homepage; composes prepared data and feature views.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/app/story-card";
import { PageFooter } from "@/components/app/shell";
import { ResumeStory } from "@/features/discovery/resume-story";
import { HomeEntrance, ExperiencePreview } from "@/features/discovery/home-theatre";
import { stories } from "@/content/catalog/catalog";
import { getLesson } from "@/content/lesson-access";
import { buildSceneProgram } from "@/features/lesson/player/scene-programs";

export default function HomePage() {
  const silk = stories.find((s) => s.slug === "shape-of-a-signal")!;
  const lesson = getLesson(silk.slug)!;
  const mapBeat = buildSceneProgram(silk, lesson, 1).beats[0];

  if (mapBeat.type !== "atlas") throw new Error("The discovery route needs geographic data");

  return (
    <main id="main-content" className="home-theatre overflow-clip">
      <HomeEntrance />
      <div className="page-width home-resume mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]">
        <ResumeStory featured />
      </div>
      <section className="page-width worlds-discovery mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)] p-0">
        <div
          className="story-grid gap-5.5 grid grid-cols-[repeat(6,_minmax(0,_1fr))] max-[760px]:gap-[17px] max-[760px]:grid-cols-[1fr_1fr] max-[400px]:grid-cols-[1fr]"
          aria-label="Discover historical stories"
        >
          {stories.map((story, i) => (
            <StoryCard placement="home" key={story.slug} story={story} featured={i < 2} />
          ))}
        </div>
      </section>
      <ExperiencePreview map={mapBeat.map} />
      <section className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]">
        <div className="home-create-invitation py-[65px] px-0 text-center max-[760px]:py-10.5 [&_p]:mx-auto [&_p]:mt-5 [&_p]:mb-[25px] [&_p]:text-muted-foreground [&_p]:text-[18px] max-[760px]:[&_p]:text-[16px] max-[760px]:[&_h2]:text-[31px]">
          <h2>Something you’ve always wondered?</h2>
          <p>Start with your question. Find a ready story—or give a new one its shape.</p>
          <Button asChild variant="outline">
            <Link href="/create">
              Follow your question
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <PageFooter />
      </section>
    </main>
  );
}
