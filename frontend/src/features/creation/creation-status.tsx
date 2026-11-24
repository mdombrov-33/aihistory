"use client";

// Displays a locally saved question without inventing a running generation job.

import Link from "next/link";
import { ArrowRight, Info, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJourney } from "@/state/guest/store";

export function CreationStatus({ id }: { id: string }) {
  const { creations } = useJourney();
  const creation = creations.find((c) => c.id === id);

  if (!creation)
    return (
      <div className="empty-state my-7.5 mx-auto py-[55px] px-6 text-center max-w-[650px] [&_>_svg]:mx-auto [&_>_svg]:w-10 [&_>_svg]:h-10 [&_>_svg]:mt-0 [&_>_svg]:mb-5.5 [&_>_svg]:text-primary [&_>_svg]:[stroke-width:1.3] [&_p]:mx-auto [&_p]:mt-4 [&_p]:mb-6 [&_p]:text-muted-foreground [&_[data-slot=button]]:m-[5px]">
        <Bookmark />
        <h1>That question isn’t on this device.</h1>
        <p>
          Preview requests are saved only in the browser where you create them. Start another
          question or explore a prepared story.
        </p>
        <Button asChild>
          <Link href="/create">
            Start a question
            <ArrowRight />
          </Link>
        </Button>
      </div>
    );

  return (
    <section className="creation-summary mx-auto max-w-[900px] mt-10 mb-15 max-[760px]:my-[25px] [&_>_h1]:my-5 [&_>_h1]:mx-0 [&_>_h1]:text-[46px] max-[760px]:[&_>_h1]:text-[36px] [&_>_p]:text-[20px] [&_>_p]:text-muted-foreground max-[760px]:[&_>_p]:text-[18px]">
      <div className="preview-notice my-6 mx-0 py-3.5 px-4.5 gap-3 bg-secondary rounded-[8px] text-[14px] text-muted-foreground flex items-start [&_svg]:w-4.5 [&_svg]:mt-0.5">
        <Info />
        <p>Saved locally · design preview</p>
      </div>
      <h1>{creation.question}</h1>
      <p>{creation.scope}</p>
      <div className="demo-stage my-8 mx-0 p-6.5 bg-secondary rounded-[10px] [&_h2]:text-[27px] [&_p]:my-[15px] [&_p]:mx-0 [&_p]:text-muted-foreground">
        <h2>Your question has a place.</h2>
        <p>
          Once creation is connected, this page will show actual research, chapter design and
          verification milestones. You will be able to leave and return to this request.
        </p>
        <p>
          No job is running now. Your question is saved in My space, so refreshing or returning
          later will not lose it.
        </p>
      </div>
      <h2>Explore the experience while you’re here.</h2>
      <p className="mt-4">
        Open an existing prepared story to try the chapters, interactions, listening and bookmarks.
      </p>
      <div className="detail-actions mt-[35px] gap-3 flex flex-wrap max-[760px]:gap-2">
        <Button asChild>
          <Link href="/stories/shape-of-a-signal">
            Explore a prepared story
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/my-space">Back to My space</Link>
        </Button>
      </div>
    </section>
  );
}
