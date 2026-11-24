"use client";

// Reversible packet trace with scenario, Hop Limit and checkpoint controls.

import { Workbench } from "../../shared/workbench";
import { useId } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { z } from "zod";
import { LabRange, LabButton } from "../../shared/controls";
import { useLearningState } from "../../shared/session";
import { packetLayout, packetTrace, type Traveler } from "./packet-model";
import { useDiagramWidth } from "../../shared/use-diagram-width";
import { useJourney } from "@/state/guest/store";

export function TravelerLab({
  traveler,
  onInteract,
}: {
  traveler: Traveler;
  onInteract: () => void;
}) {
  const validScenario = z.string().refine((id) => traveler.scenarios.some((s) => s.id === id));

  const schema = z.strictObject({
    scenario: validScenario,
    hopLimit: z.number().int().min(0).max(8),
    checkpoint: z.number().int().min(0).max(24),
  });

  const defaults = {
    scenario: traveler.scenarios[0].id,
    hopLimit: traveler.hopLimit,
    checkpoint: 0,
  };

  const [state, change] = useLearningState(schema, defaults);
  const { ref, width, height } = useDiagramWidth();
  const { reduceMotion } = useJourney();
  const trace = packetTrace(traveler, state.scenario, state.hopLimit);
  const checkpoint = Math.min(state.checkpoint, trace.length - 1);
  const current = trace[checkpoint];
  const scenario = traveler.scenarios.find((s) => s.id === state.scenario)!;
  const layout = packetLayout(traveler.locations, width, height);
  const point = layout.positions[current.location];
  const titleId = useId();

  const update = (next: Partial<typeof state>) => {
    onInteract();
    change(next);
  };

  return (
    <Workbench
      label="Packet traveler"
      className="traveler-lab"
      data-packet-state={current.kind}
      data-reduce-motion={reduceMotion}
      stage={
        <>
          <div
            ref={ref}
            className="packet-diagram relative [flex:0_0_auto] min-h-[270px] [&_>_svg]:w-full [&_>_svg]:h-full [&_>_svg]:block"
          >
            <svg viewBox={`0 0 ${width} ${layout.height}`} role="img" aria-labelledby={titleId}>
              <title
                id={titleId}
              >{`${scenario.label}. Packet at ${traveler.locations.find((n) => n.id === current.location)!.label}. Hop Limit ${current.hopLimit}.`}</title>
              {scenario.path.slice(1).map((id, i) => {
                const a = layout.positions[scenario.path[i]],
                  b = layout.positions[id];

                return (
                  <line key={id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="packet-link" />
                );
              })}
              <circle className="packet-token" r="7" cx={point.x + 55} cy={point.y - 25} />
            </svg>
            {traveler.locations.map((n) => (
              <div
                key={n.id}
                className="packet-station [&_strong]:block [&_strong]:text-[16px] [&_strong]:leading-[1.2] [&_span]:block [&_span]:text-[13px] [&_span]:mt-[3px] [&_span]:text-muted-foreground"
                data-current={n.id === current.location}
                data-on-route={scenario.path.includes(n.id)}
                style={{ left: layout.positions[n.id].x, top: layout.positions[n.id].y }}
              >
                <strong>{n.label}</strong>
                <span>
                  {n.role === "source"
                    ? "Sender"
                    : n.role === "destination"
                      ? "Destination"
                      : "Router"}
                </span>
              </div>
            ))}
          </div>
          <div
            className="lab-feedback py-5 px-6.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_h2]:mx-0 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mx-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[65ch]"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2>{current.title}</h2>
            <p className="packet-reading tabular-nums [&_strong]:text-primary">
              Hop Limit <strong>{current.hopLimit}</strong> · Event {checkpoint + 1} of{" "}
              {trace.length}
            </p>
            <p>{current.explanation}</p>
          </div>
        </>
      }
      controls={
        <>
          <div className="lab-actions gap-2 flex flex-wrap items-center">
            <LabButton
              disabled={checkpoint === 0}
              onClick={() => update({ checkpoint: checkpoint - 1 })}
            >
              <ArrowLeft size={16} />
              Previous event
            </LabButton>
            <LabButton
              disabled={checkpoint === trace.length - 1}
              onClick={() => update({ checkpoint: checkpoint + 1 })}
            >
              Next event
              <ArrowRight size={16} />
            </LabButton>
          </div>
          <LabRange
            label="Inspect event"
            value={checkpoint}
            min={0}
            max={trace.length - 1}
            onChange={(checkpoint) => update({ checkpoint })}
          />

          <div
            className="lab-choices gap-2 flex flex-wrap items-center"
            aria-label="Route scenarios"
          >
            {traveler.scenarios.map((s) => (
              <LabButton
                key={s.id}
                aria-pressed={state.scenario === s.id}
                onClick={() => update({ scenario: s.id, checkpoint: 0 })}
              >
                {s.label}
              </LabButton>
            ))}
          </div>

          <LabRange
            label="Initial Hop Limit"
            value={state.hopLimit}
            min={0}
            max={8}
            onChange={(hopLimit) => update({ hopLimit, checkpoint: 0 })}
          />

          <LabButton onClick={() => update(defaults)}>
            <RotateCcw size={16} />
            Reset traveler
          </LabButton>
          <details className="lab-assumptions px-6.5 pt-0 pb-5 text-[14px] text-muted-foreground max-[760px]:px-5 max-[760px]:pb-4 [&_summary]:py-3 [&_summary]:px-0 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_p]:mx-0 [&_p]:leading-[1.55] [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mx-0 [&_ul]:leading-[1.55] [&_ul]:mt-0 [&_ul]:mb-2">
            <summary>What this model includes</summary>
            <p>{traveler.description}</p>
            <p>
              Movement is schematic. Event steps are not elapsed time. Routes are supplied examples;
              this workbench sends no network traffic.
            </p>
          </details>
        </>
      }
    />
  );
}
