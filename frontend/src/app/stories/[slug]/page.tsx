import { chapterScene } from "@/content/lessons";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, MessageCircle, Star } from "lucide-react";
import { stories, getStory } from "@/content/catalog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageFooter } from "@/components/app/shell";
import { StoryActions } from "@/features/discovery/story-actions";
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
      <div className="page-width breadcrumb">
        <Link href="/explore">
          <ArrowLeft aria-hidden="true" />
          Explore stories
        </Link>
        <span>{story.topic}</span>
      </div>
      <section className="story-detail-hero">
        <Image src={story.image} alt={story.imageAlt} fill priority sizes="100vw" />
        <div className="detail-hero-shade" />
        <div className="page-width detail-hero-content">
          <h1>{story.title}</h1>
          <p>{story.question}</p>
          <div className="detail-meta">
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
      <div className="page-width detail-content">
        <section className="story-premise">
          <h2>A question worth staying with.</h2>
          <p>{story.description}</p>
          <ul className="learning-list">
            <li>
              <Check aria-hidden="true" />
              Explore a connected explanation, at your own pace.
            </li>
            <li>
              <Check aria-hidden="true" />
              Inspect the maps, choices and evidence behind the story.
            </li>
            <li>
              <Check aria-hidden="true" />
              Read or listen, and keep the places you want to return to.
            </li>
          </ul>
        </section>
        <aside className="evidence-aside">
          <BookOpen aria-hidden="true" />
          <h2>Go back to the evidence.</h2>
          <p>
            {story.sourceLabel}. Visual reconstructions are identified separately from historical
            sources.
          </p>
          <Button asChild variant="outline">
            <Link href={`/stories/${story.slug}/sources`}>
              Explore the sources
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </aside>
        <section className="chapter-outline">
          <div className="section-title">
            <h2>The journey ahead.</h2>
            <span>{story.scope}</span>
          </div>
          <Accordion type="single" collapsible>
            {story.chapters.map((chapter, i) => (
              <AccordionItem value={String(i)} key={chapter.title}>
                <AccordionTrigger>
                  <span className="chapter-number">{String(i + 1).padStart(2, "0")}</span>
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
        <section className="story-community">
          <div>
            <h2>What stayed with you?</h2>
            <p>Share what helped you understand the story, or what deserves a closer look.</p>
            <div className="rating-placeholder" aria-label="No public ratings yet">
              {[0, 1, 2, 3, 4].map((n) => (
                <Star key={n} aria-hidden="true" />
              ))}
              <span>No public ratings yet</span>
            </div>
            <Button asChild variant="outline">
              <Link href={`/sign-in?next=${encodeURIComponent(`/stories/${story.slug}`)}`}>
                <MessageCircle />
                Sign in to rate or comment
              </Link>
            </Button>
          </div>
          <ReportStory title={story.title} />
        </section>
        <section className="related-stories">
          <div className="section-title">
            <h2>Another connection.</h2>
            <Link href="/explore">
              Explore all
              <ArrowRight />
            </Link>
          </div>
          <div className="related-grid">
            {stories
              .filter((s) => s.slug !== story.slug)
              .slice(0, 3)
              .map((s) => (
                <Link key={s.slug} href={`/stories/${s.slug}`}>
                  <div className="related-image">
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
