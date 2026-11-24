"use client";

// Pendulum parameters, deliberate simulation playback and a small-angle prediction.

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useJourney } from "@/state/guest/store";
import { LabRange, LabButton } from "../../shared/controls";
import { pendulumPeriod } from "./model";
import { useLearningState } from "../../shared/session";
import { VisualBoundary } from "../../shared/visual-boundary";
import type { Experiment } from "../../contracts/experiment";

const PendulumCanvas = dynamic(() => import("./pendulum-canvas"), {
  ssr: false,
  loading: () => (
    <output className="lab-loading p-6 grid place-content-center h-full min-h-[260px] leading-[1.6] text-center">
      Preparing the physics engine…
    </output>
  ),
});

const stateSchema = z.object({
  length: z.number().min(0.25).max(2),
  gravity: z.number().min(1.6).max(20),
});

export function PendulumLab({
  experiment,
  onInteract,
}: {
  experiment: Extract<Experiment, { model: "pendulum" }>;
  onInteract: () => void;
}) {
  const [{ length, gravity }, change] = useLearningState(stateSchema, {
    length: experiment.length,
    gravity: experiment.gravity,
  });

  const [running, setRunning] = useState(false),
    [attempt, setAttempt] = useState(0);

  const { reduceMotion } = useJourney();

  useEffect(() => {
    const pause = () => {
      if (document.hidden) setRunning(false);
    };

    document.addEventListener("visibilitychange", pause);

    return () => document.removeEventListener("visibilitychange", pause);
  }, []);

  const period = pendulumPeriod(length, gravity);

  return (
    <section className="learning-lab" aria-label="Pendulum experiment">
      <div className="lab-canvas pendulum-viewport min-h-[310px] [&_>_svg]:block [&_>_svg]:w-full [&_>_svg]:h-full [&_>_svg]:min-h-[260px] [&_>_svg]:max-h-[55dvh]">
        <VisualBoundary
          key={attempt}
          fallback={
            <div className="lab-unavailable p-6 grid place-content-center h-full min-h-[260px] leading-[1.6] text-center">
              <p>
                3D physics is unavailable. Change length and gravity to explore the calculated
                period below.
              </p>
              <LabButton onClick={() => setAttempt((n) => n + 1)}>Try simulation again</LabButton>
            </div>
          }
        >
          <PendulumCanvas
            key={`${length}:${gravity}:${attempt}`}
            length={length}
            gravity={gravity}
            running={running}
          />
        </VisualBoundary>
        <span className="lab-gesture absolute bottom-2.5 left-5 text-[13px] text-muted-foreground pointer-events-none">
          10° release · metres and seconds
        </span>
      </div>
      <div className="lab-controls py-5 px-6.5 gap-4 grid bg-muted [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5">
        <div className="lab-actions gap-2 flex flex-wrap items-center">
          <LabButton
            className="lab-play"
            variant="primary"
            aria-pressed={running}
            onClick={() => {
              onInteract();
              setRunning(!running);
            }}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? "Pause experiment" : "Release pendulum"}
          </LabButton>
          <LabButton
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ length: experiment.length, gravity: experiment.gravity });
              setAttempt((n) => n + 1);
            }}
          >
            <RotateCcw size={16} /> Reset
          </LabButton>
        </div>
        <LabRange
          label="Length"
          value={length}
          min={0.25}
          max={2}
          step={0.05}
          unit=" m"
          onChange={(n) => {
            onInteract();
            setRunning(false);
            change({ length: n });
          }}
        />
        <LabRange
          label="Gravity"
          value={gravity}
          min={1.6}
          max={20}
          step={0.01}
          unit=" m/s²"
          onChange={(n) => {
            onInteract();
            setRunning(false);
            change({ gravity: n });
          }}
        />
        <div className="lab-choices gap-2 flex flex-wrap items-center" aria-label="Gravity presets">
          <LabButton
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ gravity: 9.81 });
            }}
          >
            Earth · 9.81
          </LabButton>
          <LabButton
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ gravity: 1.62 });
            }}
          >
            Moon · 1.62
          </LabButton>
          <LabButton
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ gravity: 3.71 });
            }}
          >
            Mars · 3.71
          </LabButton>
        </div>
      </div>
      <div
        className="lab-feedback py-5 px-6.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_h2]:mx-0 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mx-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[65ch]"
        aria-live="polite"
      >
        <h2>{period.toFixed(2)} seconds per swing</h2>
        <p>
          Small-angle prediction for one complete return: T = 2π√(L/g). Four times the length gives
          twice the period; stronger gravity makes the return faster.
        </p>
        {reduceMotion ? (
          <p>
            Motion starts only when you release the pendulum. The numerical explanation works
            without playing it.
          </p>
        ) : null}
      </div>
      <details className="lab-assumptions px-6.5 pt-0 pb-5 text-[14px] text-muted-foreground max-[760px]:px-5 max-[760px]:pb-4 [&_summary]:py-3 [&_summary]:px-0 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_p]:mx-0 [&_p]:leading-[1.55] [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mx-0 [&_ul]:leading-[1.55] [&_ul]:mt-0 [&_ul]:mb-2">
        <summary>Model and assumptions</summary>
        <p>
          Rapier simulates a rigid bob on a revolute joint with no damping. The numerical prediction
          assumes a point mass, a massless rod and small angles; the displayed finite bob at a 10°
          release is an approximation and can differ slightly. Parameter changes reset and pause the
          simulation.
        </p>
      </details>
    </section>
  );
}
