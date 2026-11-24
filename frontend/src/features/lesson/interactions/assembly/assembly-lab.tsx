"use client";

// Named-part selection, separation and section controls for schematic geometry.

import { z } from "zod";
import { useLearningState } from "../../shared/session";
import { useState } from "react";
import dynamic from "next/dynamic";
import { RotateCcw } from "lucide-react";
import type { Assembly } from "./schema";
import { LabRange, LabButton } from "../../shared/controls";
import { VisualBoundary } from "../../shared/visual-boundary";

const AssemblyCanvas = dynamic(() => import("./assembly-canvas"), {
  ssr: false,
  loading: () => (
    <output className="lab-loading p-6 grid place-content-center h-full min-h-[260px] leading-[1.6] text-center">
      Preparing the 3D assembly…
    </output>
  ),
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
      <div className="lab-canvas assembly-viewport min-h-[310px] [&_>_svg]:block [&_>_svg]:w-full [&_>_svg]:h-full [&_>_svg]:min-h-[260px] [&_>_svg]:max-h-[55dvh]">
        <VisualBoundary
          key={view}
          fallback={
            <div
              className="lab-unavailable p-6 grid place-content-center h-full min-h-[260px] leading-[1.6] text-center"
              aria-live="polite"
            >
              <p>
                3D is unavailable in this browser. Every part and its explanation is available
                below.
              </p>
              <LabButton onClick={() => setView((v) => v + 1)}>Try 3D again</LabButton>
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
        <span className="lab-gesture absolute bottom-2.5 left-5 text-[13px] text-muted-foreground pointer-events-none">
          Drag to turn · scroll to zoom
        </span>
      </div>
      <div className="lab-controls py-5 px-6.5 gap-4 grid bg-muted [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5">
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
        <div className="lab-actions gap-2 flex flex-wrap items-center">
          <LabButton
            aria-pressed={section}
            onClick={() => {
              onInteract();
              setSection(!section);
            }}
          >
            Section view
          </LabButton>
          <LabButton
            onClick={() => {
              onInteract();
              setExplode(0);
              setSection(false);
              setSelected(assembly.parts[0].id);
              setView((v) => v + 1);
            }}
          >
            <RotateCcw size={16} /> Reset view
          </LabButton>
        </div>
        <div className="lab-choices gap-2 flex flex-wrap items-center" aria-label="Assembly parts">
          {assembly.parts.map((p) => (
            <LabButton
              key={p.id}
              aria-pressed={selected === p.id}
              onClick={() => {
                onInteract();
                setSelected(p.id);
              }}
            >
              {p.label}
            </LabButton>
          ))}
        </div>
      </div>
      <div
        className="lab-feedback py-5 px-6.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_h2]:mx-0 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mx-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[65ch]"
        aria-live="polite"
      >
        <h2>{part.label}</h2>
        <p>{part.explanation}</p>
      </div>
      <details className="lab-assumptions px-6.5 pt-0 pb-5 text-[14px] text-muted-foreground max-[760px]:px-5 max-[760px]:pb-4 [&_summary]:py-3 [&_summary]:px-0 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_p]:mx-0 [&_p]:leading-[1.55] [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mx-0 [&_ul]:leading-[1.55] [&_ul]:mt-0 [&_ul]:mb-2">
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
