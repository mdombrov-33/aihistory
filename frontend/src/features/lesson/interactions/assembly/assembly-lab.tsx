"use client";

// Named-part selection, separation and section controls for schematic geometry.

import { z } from "zod";
import { useLearningState } from "../../shared/session";
import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import type { Assembly } from "./schema";
import { LabRange } from "../../shared/controls";
import { VisualBoundary } from "../../shared/visual-boundary";

const AssemblyCanvas = dynamic(() => import("./assembly-canvas"), {
  ssr: false,
  loading: () => <output className="lab-loading">Preparing the 3D assembly…</output>,
});

export function AssemblyLab({
  assembly,
  onInteract,
}: {
  assembly: Assembly;
  onInteract: () => void;
}) {
  const [{ selected, explode, section }, change] = useLearningState(
    z.object({
      selected: z.enum(assembly.parts.map((p) => p.id) as [string, ...string[]]),
      explode: z.number().min(0).max(1),
      section: z.boolean(),
    }),
    { selected: assembly.parts[0].id, explode: 0, section: false },
  );

  const setSelected = (selected: string) => change({ selected });
  const setExplode = (explode: number) => change({ explode });
  const setSection = (section: boolean) => change({ section });
  const [view, setView] = useState(0);
  const part = assembly.parts.find((p) => p.id === selected)!;

  return (
    <section className="learning-lab assembly-lab" aria-label="Assembly explorer">
      <div className="lab-canvas assembly-viewport">
        <VisualBoundary
          key={view}
          fallback={
            <div className="lab-unavailable" aria-live="polite">
              <p>
                3D is unavailable in this browser. Every part and its explanation is available
                below.
              </p>
              <button onClick={() => setView((v) => v + 1)}>Try 3D again</button>
            </div>
          }
        >
          <AssemblyCanvas
            key={view}
            assembly={assembly}
            explode={explode}
            section={section}
            selected={selected}
            onSelect={setSelected}
            onInteract={onInteract}
          />
        </VisualBoundary>
        <span className="lab-gesture">Drag to turn · scroll to zoom</span>
      </div>
      <div className="lab-controls">
        <LabRange
          label="Separate the parts"
          value={explode}
          min={0}
          max={1}
          step={0.01}
          onChange={(n) => {
            onInteract();
            setExplode(n);
          }}
        />
        <div className="lab-actions">
          <button
            aria-pressed={section}
            onClick={() => {
              onInteract();
              setSection(!section);
            }}
          >
            Section view
          </button>
          <button
            onClick={() => {
              onInteract();
              setExplode(0);
              setSection(false);
              setSelected(assembly.parts[0].id);
              setView((v) => v + 1);
            }}
          >
            <RotateCcw size={16} /> Reset view
          </button>
        </div>
        <div className="lab-choices" aria-label="Assembly parts">
          {assembly.parts.map((p) => (
            <button
              key={p.id}
              aria-pressed={selected === p.id}
              onClick={() => {
                onInteract();
                setSelected(p.id);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lab-feedback" aria-live="polite">
        <h2>{part.label}</h2>
        <p>{part.explanation}</p>
      </div>
      <details className="lab-assumptions">
        <summary>About this model</summary>
        <p>{assembly.description}</p>
        <p>
          Section view removes half of the supplied geometry; it does not infer missing interior
          structures.
        </p>
      </details>
    </section>
  );
}
