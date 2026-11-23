import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageFooter } from "@/components/app/shell";
export const metadata = { title: "About this preview" };
export default function AboutPage() {
  return (
    <main id="main-content" className="page-width">
      <article className="prose-page">
        <h1>A first step into another world.</h1>
        <p>
          This is a static frontend for an interactive history app. History is a working name. The
          Worlds direction brings historical images, labelled reconstructions and native 3D together
          with readable stories, inspectable evidence and meaningful interactions.
        </p>
        <h2>What you can try</h2>
        <p>
          Explore prepared stories, open their chapters, read or listen with your browser’s voice,
          keep passage bookmarks and return to your place. Settings let you choose a colour theme
          and adjust reading, motion and sound.
        </p>
        <h2>What is prepared</h2>
        <p>
          The collection now contains four storyboards: Pompeii, early photography, the telegraph
          and the making of the Great Wave. They use historical collection images, a real museum
          model and explanatory diagrams, with dates and source records attached. Sources explain
          what supports each story and where interpretation remains uncertain.
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
