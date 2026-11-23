"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useJourney } from "@/lib/journey-store";
import { LabRange } from "./controls";
import { pendulumPeriod } from "./models";
import { useLearningState } from "./session";
import { VisualBoundary } from "./visual-boundary";
import type { Experiment } from "./schema";
const PendulumCanvas = dynamic(() => import("./pendulum-canvas"), {
  ssr: false,
  loading: () => <output className="lab-loading">Preparing the physics engine…</output>,
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
      <div className="lab-canvas pendulum-viewport">
        <VisualBoundary
          key={attempt}
          fallback={
            <div className="lab-unavailable">
              <p>
                3D physics is unavailable. Change length and gravity to explore the calculated
                period below.
              </p>
              <button onClick={() => setAttempt((n) => n + 1)}>Try simulation again</button>
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
        <span className="lab-gesture">10° release · metres and seconds</span>
      </div>
      <div className="lab-controls">
        <div className="lab-actions">
          <button
            className="lab-play"
            aria-pressed={running}
            onClick={() => {
              onInteract();
              setRunning(!running);
            }}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? "Pause experiment" : "Release pendulum"}
          </button>
          <button
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ length: experiment.length, gravity: experiment.gravity });
              setAttempt((n) => n + 1);
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
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
        <div className="lab-choices" aria-label="Gravity presets">
          <button
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ gravity: 9.81 });
            }}
          >
            Earth · 9.81
          </button>
          <button
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ gravity: 1.62 });
            }}
          >
            Moon · 1.62
          </button>
          <button
            onClick={() => {
              onInteract();
              setRunning(false);
              change({ gravity: 3.71 });
            }}
          >
            Mars · 3.71
          </button>
        </div>
      </div>
      <div className="lab-feedback" aria-live="polite">
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
      <details className="lab-assumptions">
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
