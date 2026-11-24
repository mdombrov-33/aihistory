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
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <div className="breadcrumb py-4.5 gap-5 flex justify-between text-[14px] text-muted-foreground max-[760px]:py-2.5 max-[760px]:px-0 max-[760px]:text-[12px] [&_a]:gap-2 [&_a]:flex [&_a]:items-center [&_a]:min-h-7.5 [&_svg]:w-[17px]">
        <Link href={`/stories/${slug}`}>
          <ArrowLeft />
          Back to {story.title}
        </Link>
      </div>
      <PageHeading
        title="Every story has a foundation."
        description={`Sources behind ${story.title}. Follow the evidence beyond the scene.`}
      />
      <div className="preview-notice my-6 mx-0 py-3.5 px-4.5 gap-3 bg-secondary rounded-[8px] text-[14px] text-muted-foreground flex items-start [&_svg]:w-4.5 [&_svg]:mt-0.5">
        <Info />
        <p>
          Stories may combine historical images, modern photographs and labelled reconstructions.
          Source records explain what each supports; an illustration is not evidence by itself.
        </p>
      </div>
      <div className="source-list gap-0 grid max-w-[900px]">
        {lesson.sources.map((source, i) => (
          <article
            className="source-item py-7.5 px-0 [border-bottom:1px_solid_var(--border)] max-[760px]:py-[25px] [&_>_div]:gap-[15px] [&_>_div]:flex [&_>_div]:items-center [&_>_div]:justify-between [&_small]:text-primary [&_small]:text-[14px] [&_h2]:my-3 [&_h2]:mx-0 [&_h2]:text-[27px] max-[760px]:[&_h2]:text-[25px] [&_p]:text-muted-foreground [&_p]:text-[17px] max-[760px]:[&_p]:text-[16px] [&_a]:gap-2 [&_a]:inline-flex [&_a]:items-center [&_a]:mt-4.5 [&_a]:min-h-11 [&_a]:text-primary [&_svg]:w-4"
            key={source.url}
          >
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
      <div className="hub-bottom px-0 gap-5 flex items-center justify-between pt-10.5 pb-8 max-[760px]:py-7.5 max-[760px]:items-start max-[760px]:flex-col [&_p]:font-heading [&_p]:text-[24px] [&_p]:leading-[1.4] max-[760px]:[&_p]:text-[23px] [&_span]:[font-family:var(--font-source-sans),_sans-serif] [&_span]:text-[16px] [&_span]:text-muted-foreground max-[760px]:[&_span]:text-[15px]">
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
