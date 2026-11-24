"use client";

// Paused-by-default part motion with playback, seeking, reset and steady explanation.

import { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useJourney } from "@/state/guest/store";
import type { Assembly } from "./schema";
import { motionCue } from "./motion-definition";
import { VisualBoundary } from "../../shared/visual-boundary";

const MotionCanvas = dynamic(() => import("./assembly-motion-canvas"), {
  ssr: false,
  loading: () => (
    <output className="lab-loading p-6 grid place-content-center h-full min-h-[260px] leading-[1.6] text-center">
      Opening the 3D object…
    </output>
  ),
});

export function AssemblyMotion({
  assembly,
  onInteract,
}: {
  assembly: Assembly;
  onInteract: () => void;
}) {
  const { reduceMotion } = useJourney();
  const systemReduceMotion = useReducedMotion();
  const still = reduceMotion || !!systemReduceMotion;

  return (
    <MotionExhibit key={String(still)} assembly={assembly} onInteract={onInteract} still={still} />
  );
}

function MotionExhibit({
  assembly,
  onInteract,
  still,
}: {
  assembly: Assembly;
  onInteract: () => void;
  still: boolean;
}) {
  const motion = assembly.motion!;

  const [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false),
    [view, setView] = useState(0),
    [ready, setReady] = useState(false);

  const current = useRef(0);
  const controlId = useId();
  const cue = motionCue(motion, progress);

  const seek = (position: number) => {
    onInteract();
    setPlaying(false);
    current.current = position;
    setProgress(position);
  };

  useEffect(() => {
    const pause = () => setPlaying(false);

    const hidden = () => {
      if (document.hidden) pause();
    };

    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", pause);

    return () => {
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("pagehide", pause);
    };
  }, []);
  useEffect(() => {
    if (!playing || still) return;

    let frame = 0,
      last = 0;

    const tick = (now: number) => {
      if (last)
        current.current = Math.min(
          1,
          current.current + Math.min(now - last, 100) / (motion.duration * 1000),
        );

      last = now;
      setProgress(current.current);

      if (current.current < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [playing, still, motion.duration]);

  return (
    <section
      className="moving-exhibit h-full min-h-0 grid grid-rows-[minmax(220px,_1fr)_auto_auto] text-foreground bg-background"
      aria-label="Object motion demonstration"
      data-playing={playing && !still}
    >
      <div className="moving-object overflow-hidden relative min-h-0 [&_>_div]:h-full">
        <VisualBoundary
          key={view}
          fallback={
            <div className="lab-unavailable p-6 grid place-content-center h-full min-h-[260px] leading-[1.6] text-center">
              <p>3D could not open. Use the cycle control to read each stage.</p>
              <button
                onClick={() => {
                  setPlaying(false);
                  setReady(false);
                  setView((n) => n + 1);
                }}
              >
                Try 3D again
              </button>
            </div>
          }
        >
          <MotionCanvas
            assembly={assembly}
            progress={progress}
            onInteract={onInteract}
            onReady={() => setReady(true)}
          />
        </VisualBoundary>
        <span className="moving-hint absolute left-4.5 bottom-3 text-[13px] leading-[1.4] text-muted-foreground pointer-events-none">
          Drag to turn · schematic movement
        </span>
      </div>
      <div className="moving-controls py-2.5 px-4.5 gap-3 grid grid-cols-[auto_minmax(90px,_1fr)_auto] items-center [border-top:1px_solid_var(--line-soft)] max-[760px]:py-2 max-[760px]:px-3 max-[760px]:gap-2.5 [&_button]:py-2 [&_button]:px-3 [&_button]:gap-2 [&_button]:inline-flex [&_button]:justify-center [&_button]:items-center [&_button]:min-h-11 [&_button]:border [&_button]:border-input [&_button]:rounded-[8px] [&_button]:text-[15px] [&_button]:text-foreground max-[760px]:[&_button]:px-2 max-[760px]:[&_button]:text-[14px]">
        <button
          className="moving-play"
          disabled={still || !ready}
          onClick={() => {
            onInteract();

            if (current.current >= 1) {
              current.current = 0;
              setProgress(0);
            }

            setPlaying(!playing);
          }}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
          {playing ? "Pause" : progress >= 1 ? "Replay" : "Play movement"}
        </button>
        <div className="moving-range [&_label]:block [&_label]:text-[13px] [&_label]:text-muted-foreground [&_input]:block [&_input]:w-full [&_input]:h-11 [&_input]:[accent-color:var(--primary)]">
          <label htmlFor={controlId}>Movement</label>
          <input
            id={controlId}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            aria-valuetext={cue.label}
            onChange={(e) => seek(Number(e.target.value))}
          />
        </div>
        <button
          className="moving-reset w-11"
          aria-label="Reset movement and camera"
          onClick={() => {
            seek(0);
            setReady(false);
            setView((n) => n + 1);
          }}
        >
          <RotateCcw size={18} />
        </button>
        {still ? (
          <div className="moving-poses gap-2 col-span-full flex flex-wrap" aria-label="Still views">
            {motion.cues.map((c) => (
              <button key={c.at} aria-pressed={progress === c.at} onClick={() => seek(c.at)}>
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="moving-caption px-5.5 overflow-auto pt-3.5 pb-4.5 [border-top:1px_solid_var(--line-soft)] max-h-[180px] [scrollbar-color:var(--input)_var(--background)] max-[760px]:px-4.5 max-[760px]:pt-3 max-[760px]:pb-4 [&_h2]:mx-0 [&_h2]:mt-0 [&_h2]:mb-2 [&_h2]:text-[22px] [&_h2]:leading-[1.2] [&_p]:m-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:max-w-[65ch]">
        <h2 aria-live={playing ? "off" : "polite"} aria-atomic="true">
          {cue.label}
        </h2>
        <p>{motion.description}</p>
        {still ? <p>Reduced motion is on. Choose a still view or move the slider.</p> : null}
      </div>
    </section>
  );
}
