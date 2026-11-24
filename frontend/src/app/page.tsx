// Immersive discovery: question entry and real image, model, artwork and geographic exploration.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageFooter } from "@/components/app/shell";
import { ResumeStory } from "@/features/discovery/resume-story";
import { HomeEntrance } from "@/features/discovery/home-theatre";
import { MoonStudy } from "@/features/discovery/moon-study";
import { HomeCollection } from "@/features/discovery/home-collection";
import { JourneyMap } from "@/features/discovery/journey-map";
import { EvidenceStudy } from "@/features/lesson/media/evidence-study";
import { redFujiStudy } from "@/content/discovery/home-studies";
import { stories } from "@/content/catalog/catalog";

const featuredSlugs = ["shape-a-sound", "great-wave-made-by-hand", "pompeii", "shape-of-a-signal"];

export default function HomePage() {
  const collection = featuredSlugs.flatMap((slug) =>
    stories.filter((story) => story.slug === slug),
  );

  return (
    <main id="main-content" className="home-theatre overflow-clip">
      <HomeEntrance />
      <div className="mx-auto w-full max-w-[1540px] px-5 sm:px-9 lg:px-14">
        <div className="pt-6 empty:hidden">
          <ResumeStory />
        </div>
        <MoonStudy />

        <section
          className="grid items-center gap-7 border-t border-rule py-16 sm:gap-12 sm:py-24 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,.85fr)]"
          id="art-showcase"
          aria-labelledby="print-title"
        >
          <div className="min-w-0 lg:order-1">
            <h2
              id="print-title"
              className="max-w-[16ch] text-[clamp(32px,3.3vw,50px)] leading-[1.1]"
            >
              A familiar image. Something you haven’t seen.
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
              Slow down with a real woodblock print. Follow a slope, a line of clouds, the tiny
              marks that become a forest.
            </p>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
              Select a detail to read about it at the image, or open the whole print and move
              closer.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 h-auto min-h-12 whitespace-normal py-3"
            >
              <Link href="/stories/great-wave-made-by-hand/play/2">
                Explore Hokusai’s world <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <EvidenceStudy study={redFujiStudy} />
        </section>

        <section
          className="border-t border-rule py-16 sm:py-24"
          id="map-showcase"
          aria-labelledby="geography-title"
        >
          <div className="mb-7 grid items-end gap-5 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <h2
              id="geography-title"
              className="max-w-[19ch] text-[clamp(32px,3.3vw,50px)] leading-[1.1]"
            >
              Three oceans. Different connections.
            </h2>
            <div>
              <p className="max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
                Choose two cities. Follow the connection across land and sea, then compare another
                part of the world.
              </p>
            </div>
          </div>
          <JourneyMap />
        </section>

        <div className="border-t border-rule">
          <HomeCollection stories={collection} />
        </div>
        <section className="flex flex-wrap items-center justify-between gap-6 border-t border-rule py-12 sm:py-16">
          <div>
            <h2 className="text-3xl sm:text-4xl">What are you wondering about?</h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Find a prepared explanation, or keep a question for what comes next.
            </p>
          </div>
          <Button asChild className="min-h-12 px-6">
            <Link href="/create">
              Follow your question <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
        <PageFooter />
      </div>
    </main>
  );
}
