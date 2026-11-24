// Server route for about; composes prepared data and feature views.

import { stories } from "@/content/catalog/catalog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageFooter } from "@/components/app/shell";

export const metadata = { title: "About this preview" };

export default function AboutPage() {
  return (
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <article className="prose-page py-[55px] max-w-[800px] max-[760px]:py-[35px] [&_h2]:mt-10 [&_p]:my-5.5 [&_p]:mx-0 [&_p]:text-[19px] [&_p]:leading-[1.75] [&_p]:text-muted-foreground max-[760px]:[&_p]:text-[18px]">
        <h1>A first step into another world.</h1>
        <p>
          Explore subjects through visual explanations and experiments. Take apart a schematic
          camera, investigate light and motion, shape a sound or follow a digital signal. HISTORY is
          the current placeholder name; the app is growing beyond history.
        </p>
        <h2>What you can try</h2>
        <p>
          Explore prepared stories, open their chapters, read or listen with your browser’s voice,
          keep passage bookmarks and return to your place. Settings let you choose a colour theme
          and adjust reading, motion and sound.
        </p>
        <h2>What is prepared</h2>
        <p>
          The collection contains {stories.length} prepared lessons across physics, sound,
          technology, art and history. They combine sourced material, original diagrams and
          interactive models. Each lesson identifies its sources and the assumptions behind its
          simplified models. These are authored examples; live lesson generation is not connected.
        </p>
        <h2>Your data stays here</h2>
        <p>
          Guest activity is saved in this browser. Account screens and the creation flow preview the
          product, with no authentication, generation, payment or provider calls connected. Forms do
          not send credentials. You can clear guest activity in Settings.
        </p>
        <Button asChild>
          <Link href="/explore">
            Step into a story
            <ArrowRight />
          </Link>
        </Button>
      </article>
      <PageFooter />
    </main>
  );
}
