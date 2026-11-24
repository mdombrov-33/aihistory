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
  loading: () => <output className="lab-loading">Opening the 3D object…</output>,
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
      className="moving-exhibit"
      aria-label="Object motion demonstration"
      data-playing={playing && !still}
    >
      <div className="moving-object">
        <VisualBoundary
          key={view}
          fallback={
            <div className="lab-unavailable">
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
        <span className="moving-hint">Drag to turn · schematic movement</span>
      </div>
      <div className="moving-controls">
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
        <div className="moving-range">
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
          className="moving-reset"
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
          <div className="moving-poses" aria-label="Still views">
            {motion.cues.map((c) => (
              <button key={c.at} aria-pressed={progress === c.at} onClick={() => seek(c.at)}>
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="moving-caption">
        <h2 aria-live={playing ? "off" : "polite"} aria-atomic="true">
          {cue.label}
        </h2>
        <p>{motion.description}</p>
        {still ? <p>Reduced motion is on. Choose a still view or move the slider.</p> : null}
      </div>
    </section>
  );
}
