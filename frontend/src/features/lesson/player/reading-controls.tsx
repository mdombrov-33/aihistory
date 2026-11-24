"use client";

// Read/Listen switching and deliberate narration playback controls.

import { BookOpen, Headphones, Pause, Play } from "lucide-react";

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
    <div className="story-mode-controls">
      <div className="reading-modes" aria-label="Reading and listening">
        <button aria-pressed={mode === "read"} onClick={onRead}>
          <BookOpen />
          <span>Read</span>
        </button>
        <button aria-pressed={mode === "listen"} onClick={onListen}>
          <Headphones />
          <span>Listen</span>
        </button>
      </div>
      {mode === "listen" ? (
        <button
          className="story-play"
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
