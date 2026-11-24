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
      <div className="empty-state">
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
    <section className="creation-summary">
      <div className="preview-notice">
        <Info />
        <p>Saved locally · design preview</p>
      </div>
      <h1>{creation.question}</h1>
      <p>{creation.scope}</p>
      <div className="demo-stage">
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
      <div className="detail-actions">
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
