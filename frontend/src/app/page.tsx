import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/app/story-card";
import { PageFooter } from "@/components/app/shell";
import { ResumeStory } from "@/features/discovery/resume-story";
import { HomeEntrance, ExperiencePreview } from "@/features/discovery/home-theatre";
import { stories } from "@/content/catalog";
import { getLesson } from "@/content/lessons";
import { buildSceneProgram } from "@/features/player/scene-programs";
export default function HomePage() {
  const silk = stories.find((s) => s.slug === "shape-of-a-signal")!;
  const lesson = getLesson(silk.slug)!;
  const mapBeat = buildSceneProgram(silk, lesson, 1).beats[0];
  if (mapBeat.type !== "atlas") throw new Error("The discovery route needs geographic data");
  return (
    <main id="main-content" className="home-theatre">
      <HomeEntrance />
      <div className="page-width home-resume">
        <ResumeStory featured />
      </div>
      <section className="page-width worlds-discovery">
        <div className="story-grid" aria-label="Discover historical stories">
          {stories.map((story, i) => (
            <StoryCard key={story.slug} story={story} featured={i < 2} />
          ))}
        </div>
      </section>
      <ExperiencePreview map={mapBeat.map} />
      <section className="page-width">
        <div className="home-create-invitation">
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
