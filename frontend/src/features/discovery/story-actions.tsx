"use client";

// Whole-story saving and discovery actions kept separate from paragraph bookmarks.

import Link from "next/link";
import { Bookmark, Check, Play, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleSaved } from "@/state/guest/actions";
import { useJourney } from "@/state/guest/store";

export function StoryActions({ slug }: { slug: string }) {
  const journey = useJourney();
  const saved = journey.saved.includes(slug);
  const progress = journey.progress[slug];

  return (
    <div className="detail-actions gap-3 flex flex-wrap max-[760px]:gap-2">
      <Button asChild className="start-story min-w-[190px] max-[760px]:min-w-0">
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
        className="touch-icon p-2.5 min-w-11 min-h-11"
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
