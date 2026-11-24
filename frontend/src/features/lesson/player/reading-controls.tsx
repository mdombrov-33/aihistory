"use client";

// Read/Listen switching and deliberate narration playback controls.

import { BookOpen, Headphones, Pause, Play } from "lucide-react";

const modeButton =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-[7px] bg-transparent px-[15px] py-1.5 text-[14px] text-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground max-[760px]:px-[17px] [&_svg]:size-[19px]";

export function ReadingControls({
  mode,
  playing,
  onRead,
  onListen,
  onPlay,
}: {
  mode: "read" | "listen";
  playing: boolean;
  onRead: () => void;
  onListen: () => void;
  onPlay: () => void;
}) {
  return (
    <div className="story-mode-controls gap-2 flex items-center ml-auto [&_svg]:w-[17px] [&_svg]:h-[17px]">
      <div
        className="reading-modes flex overflow-hidden rounded-[8px] border border-border bg-background"
        aria-label="Reading and listening"
      >
        <button className={modeButton} aria-pressed={mode === "read"} onClick={onRead}>
          <BookOpen />
          <span>Read</span>
        </button>
        <button className={modeButton} aria-pressed={mode === "listen"} onClick={onListen}>
          <Headphones />
          <span>Listen</span>
        </button>
      </div>
      {mode === "listen" ? (
        <button
          className="story-play py-1.5 px-3 gap-[7px] flex items-center text-[14px] text-primary"
          aria-label={playing ? "Pause narration" : "Play narration"}
          onClick={onPlay}
        >
          {playing ? <Pause /> : <Play />}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      ) : null}
    </div>
  );
}
