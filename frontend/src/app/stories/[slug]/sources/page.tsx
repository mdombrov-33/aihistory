// Server route for stories/[slug]/sources; composes prepared data and feature views.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Info } from "lucide-react";
import { getStory } from "@/content/catalog/catalog";
import { getLesson } from "@/content/lesson-access";
import { PageHeading, PageFooter } from "@/components/app/shell";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sources & evidence" };

export default async function SourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  const lesson = getLesson(slug);

  if (!story || !lesson) notFound();

  return (
    <main id="main-content" className="page-width">
      <div className="breadcrumb">
        <Link href={`/stories/${slug}`}>
          <ArrowLeft />
          Back to {story.title}
        </Link>
      </div>
      <PageHeading
        title="Every story has a foundation."
        description={`Sources behind ${story.title}. Follow the evidence beyond the scene.`}
      />
      <div className="preview-notice">
        <Info />
        <p>
          Stories may combine historical images, modern photographs and labelled reconstructions.
          Source records explain what each supports; an illustration is not evidence by itself.
        </p>
      </div>
      <div className="source-list">
        {lesson.sources.map((source, i) => (
          <article className="source-item" key={source.url}>
            <div>
              <small>
                {String(i + 1).padStart(2, "0")} · {source.name}
              </small>
              <small>{source.type}</small>
            </div>
            <h2>{source.title}</h2>
            <p>{source.supports}</p>
            <a href={source.url} target="_blank" rel="noreferrer">
              Open source
              <ArrowUpRight />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </article>
        ))}
      </div>
      <div className="hub-bottom">
        <p>There’s always another thread.</p>
        <Button asChild>
          <Link href="/explore">
            Find your next story
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <PageFooter />
    </main>
  );
}
