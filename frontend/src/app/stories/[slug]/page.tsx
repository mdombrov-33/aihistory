// Server route for stories/[slug]; composes prepared data and feature views.

import { chapterScene } from "@/content/lesson-access";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3 } from "lucide-react";
import { stories, getStory } from "@/content/catalog/catalog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageFooter } from "@/components/app/shell";
import { StoryActions } from "@/features/discovery/story-actions";
import { Community } from "@/features/discovery/community";
import { ReportStory } from "@/features/discovery/report-story";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const story = getStory((await params).slug);

  return { title: story?.title ?? "Story" };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = getStory((await params).slug);

  if (!story) notFound();

  return (
    <main id="main-content">
      <div className="page-width breadcrumb mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)] py-4.5 gap-5 flex justify-between text-[14px] text-muted-foreground max-[760px]:py-2.5 max-[760px]:px-0 max-[760px]:text-[12px] [&_a]:gap-2 [&_a]:flex [&_a]:items-center [&_a]:min-h-7.5 [&_svg]:w-[17px]">
        <Link href="/explore">
          <ArrowLeft aria-hidden="true" />
          Explore stories
        </Link>
        <span>{story.topic}</span>
      </div>
      <section className="story-detail-hero overflow-hidden relative min-h-[490px] bg-background text-(--hero-text) isolate flex items-end max-[760px]:min-h-[530px] [&_>_img]:z-[-2] [&_>_img]:[object-position:50%_38%] max-[760px]:[&_>_img]:[object-position:62%_25%]">
        <Image src={story.image} alt={story.imageAlt} fill priority sizes="100vw" />
        <div className="detail-hero-shade absolute top-0 right-0 bottom-0 left-0 [background:linear-gradient(_90deg,_color-mix(in_srgb,_var(--art-ink)_93%,_transparent)_0%,_color-mix(in_srgb,_var(--art-ink)_63%,_transparent)_38%,_color-mix(in_srgb,_var(--art-ink)_8%,_transparent)_80%_),_linear-gradient(0deg,_color-mix(in_srgb,_var(--art-ink)_65%,_transparent),_transparent_70%)] z-[-1] max-[760px]:[background:linear-gradient(_0deg,_var(--art-ink)_0%,_color-mix(in_srgb,_var(--art-ink)_83%,_transparent)_35%,_color-mix(in_srgb,_var(--art-ink)_8%,_transparent)_85%_)]" />
        <div className="page-width detail-hero-content mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)] pt-[65px] pb-9.5 max-[760px]:pt-[150px] max-[760px]:pb-7 [&_h1]:max-w-[620px] [&_h1]:text-[clamp(3rem,_5.6vw,_5rem)] max-[760px]:[&_h1]:max-w-[500px] max-[760px]:[&_h1]:text-[48px] max-[400px]:[&_h1]:text-[43px] [&_>_p]:my-5 [&_>_p]:mx-0 [&_>_p]:max-w-[35ch] [&_>_p]:text-[25px] [&_>_p]:leading-[1.35] max-[760px]:[&_>_p]:my-[17px] max-[760px]:[&_>_p]:max-w-[28ch] max-[760px]:[&_>_p]:text-[21px] [&_>_small]:block [&_>_small]:text-(--hero-muted) [&_>_small]:text-[12px] [&_>_small]:mt-7 max-[760px]:[&_>_small]:text-[11px] max-[760px]:[&_>_small]:mt-5.5">
          <h1>{story.title}</h1>
          <p>{story.question}</p>
          <div className="detail-meta my-[25px] mx-0 gap-6 flex flex-wrap text-(--hero-muted) text-[14px] max-[760px]:my-5.5 max-[760px]:gap-3 max-[760px]:text-[12px] [&_span]:gap-2 [&_span]:flex [&_span]:items-center [&_svg]:w-[17px] [&_svg]:h-[17px] max-[760px]:[&_svg]:w-[15px] max-[760px]:[&_svg]:h-[15px]">
            <span>
              <Clock3 aria-hidden="true" />≈ {story.minutes} min
            </span>
            <span>
              <BookOpen aria-hidden="true" />
              {story.chapters.length} chapters
            </span>
            <span>{story.period}</span>
          </div>
          <StoryActions slug={story.slug} />
          <small>Prepared story preview · image context and credits inside</small>
        </div>
      </section>
      <div className="page-width detail-content mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)] grid grid-cols-[minmax(0,_1fr)_330px] gap-y-12 gap-x-20 pt-13 max-[1050px]:gap-10 max-[1050px]:grid-cols-[1fr_290px] max-[760px]:gap-[35px] max-[760px]:flex max-[760px]:pt-[35px] max-[760px]:flex-col">
        <section className="story-premise [&_>_p]:my-5.5 [&_>_p]:mx-0 [&_>_p]:text-[20px] [&_>_p]:leading-[1.7] max-[760px]:[&_>_p]:my-4.5 max-[760px]:[&_>_p]:text-[19px]">
          <h2>A question worth staying with.</h2>
          <p>{story.description}</p>
          <ul className="learning-list p-0 gap-3.5 [list-style:none] grid mt-[25px] text-muted-foreground max-[760px]:text-[15px] [&_li]:gap-3 [&_li]:flex [&_svg]:w-4.5 [&_svg]:h-5.5 [&_svg]:text-primary">
            <li>
              <Check aria-hidden="true" />
              Explore a connected explanation, at your own pace.
            </li>
            <li>
              <Check aria-hidden="true" />
              Explore the interactions, models and sources behind the explanation.
            </li>
            <li>
              <Check aria-hidden="true" />
              Read or listen, and keep the places you want to return to.
            </li>
          </ul>
        </section>
        <aside className="evidence-aside p-7 bg-secondary rounded-[12px] [align-self:start] max-[760px]:p-6 max-[760px]:w-full [&_>_svg]:text-primary [&_>_svg]:mb-5.5 max-[760px]:[&_>_svg]:my-0 max-[760px]:[&_>_svg]:[float:left] max-[760px]:[&_>_svg]:mr-[15px] max-[760px]:[&_>_svg]:ml-0 [&_h2]:text-[25px] [&_p]:mx-0 [&_p]:text-[16px] [&_p]:text-muted-foreground [&_p]:mt-4.5 [&_p]:mb-6 max-[760px]:[&_p]:[clear:both] max-[760px]:[&_p]:pt-1.5">
          <BookOpen aria-hidden="true" />
          <h2>Go back to the evidence.</h2>
          <p>
            {story.sourceLabel}. Illustrations and model assumptions are identified separately from
            supporting sources.
          </p>
          <Button asChild variant="outline">
            <Link href={`/stories/${story.slug}/sources`}>
              Explore the sources
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </aside>
        <section className="chapter-outline col-span-full">
          <div className="section-title gap-5 flex justify-between items-center mb-6 max-[760px]:gap-[15px] max-[760px]:items-start [&_>_span]:text-muted-foreground [&_>_span]:text-[14px] max-[760px]:[&_>_span]:hidden [&_>_a]:gap-[9px] [&_>_a]:flex [&_>_a]:items-center [&_>_a]:text-[15px] max-[760px]:[&_h2]:text-[29px] [&>a_svg]:w-[17px]">
            <h2>The journey ahead.</h2>
            <span>{story.scope}</span>
          </div>
          <Accordion type="single" collapsible>
            {story.chapters.map((chapter, i) => (
              <AccordionItem value={String(i)} key={chapter.title}>
                <AccordionTrigger>
                  <span className="chapter-number text-[14px] text-primary tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{chapter.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p>{chapter.question}</p>
                  <Button asChild variant="link">
                    <Link href={`/stories/${story.slug}/play/${chapterScene(story.slug, i)}`}>
                      Open this chapter
                      <ArrowRight />
                    </Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        <section className="story-community py-7.5 px-0 gap-7 col-span-full flex justify-between [border-block:1px_solid_var(--line-soft)] max-[760px]:py-7 max-[760px]:block [&_p]:my-4 [&_p]:mx-0 [&_p]:text-muted-foreground max-[760px]:[&_>_button]:mt-[25px]">
          <Community slug={story.slug} />
          <ReportStory title={story.title} />
        </section>
        <section className="related-stories col-span-full">
          <div className="section-title gap-5 flex justify-between items-center mb-6 max-[760px]:gap-[15px] max-[760px]:items-start [&_>_span]:text-muted-foreground [&_>_span]:text-[14px] max-[760px]:[&_>_span]:hidden [&_>_a]:gap-[9px] [&_>_a]:flex [&_>_a]:items-center [&_>_a]:text-[15px] max-[760px]:[&_h2]:text-[29px] [&>a_svg]:w-[17px]">
            <h2>Another connection.</h2>
            <Link href="/explore">
              Explore all
              <ArrowRight />
            </Link>
          </div>
          <div className="related-grid gap-6 grid grid-cols-[repeat(3,_minmax(0,_1fr))] max-[760px]:gap-4 max-[760px]:grid-cols-[repeat(2,_1fr)] [&_p]:text-[16px] [&_p]:text-muted-foreground [&_p]:mt-[9px] max-[760px]:[&_p]:text-[14px] max-[760px]:[&_h3]:text-[23px]">
            {stories
              .filter((s) => s.slug !== story.slug)
              .slice(0, 3)
              .map((s) => (
                <Link key={s.slug} href={`/stories/${s.slug}`}>
                  <div className="related-image overflow-hidden h-[180px] relative rounded-[10px] mb-4 max-[760px]:h-[150px]">
                    <Image src={s.image} alt="" fill sizes="(max-width:700px) 45vw, 33vw" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.question}</p>
                </Link>
              ))}
          </div>
        </section>
        <PageFooter />
      </div>
    </main>
  );
}
