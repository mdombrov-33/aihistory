"use client";
import Link from "next/link";
import { Bookmark, Check, Play, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleSaved, useJourney } from "@/lib/journey-store";
export function StoryActions({ slug }: { slug: string }) {
  const journey = useJourney();
  const saved = journey.saved.includes(slug);
  const progress = journey.progress[slug];
  return (
    <div className="detail-actions">
      <Button asChild className="start-story">
        <Link
          href={`/stories/${slug}/play/${progress?.scene ?? 0}?passage=${progress?.passage ?? 0}`}
        >
          <Play aria-hidden="true" fill="currentColor" />
          {progress?.finished
            ? "Revisit the story"
            : progress
              ? "Continue the story"
              : "Start as guest"}
        </Link>
      </Button>
      <Button
        variant="outline"
        aria-pressed={saved}
        onClick={() => {
          toggleSaved(slug);
          toast(saved ? "Removed from saved stories" : "Story saved on this device");
        }}
      >
        {saved ? <Check /> : <Bookmark />}
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="touch-icon"
        aria-label="Copy story link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            toast.success("Story link copied");
          } catch {
            toast("Copy the address from your browser to share this public story.");
          }
        }}
      >
        <Share2 />
      </Button>
    </div>
  );
}
