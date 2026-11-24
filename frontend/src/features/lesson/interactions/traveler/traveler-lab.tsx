"use client";

// Reversible packet trace with scenario, Hop Limit and checkpoint controls.

import { Workbench } from "../../shared/workbench";
import { useId } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { z } from "zod";
import { LabRange } from "../../shared/controls";
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
          <div ref={ref} className="packet-diagram">
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
                className="packet-station"
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
          <div className="lab-feedback" aria-live="polite" aria-atomic="true">
            <h2>{current.title}</h2>
            <p className="packet-reading">
              Hop Limit <strong>{current.hopLimit}</strong> · Event {checkpoint + 1} of{" "}
              {trace.length}
            </p>
            <p>{current.explanation}</p>
          </div>
        </>
      }
      controls={
        <>
          <div className="lab-actions">
            <button
              disabled={checkpoint === 0}
              onClick={() => update({ checkpoint: checkpoint - 1 })}
            >
              <ArrowLeft size={16} />
              Previous event
            </button>
            <button
              disabled={checkpoint === trace.length - 1}
              onClick={() => update({ checkpoint: checkpoint + 1 })}
            >
              Next event
              <ArrowRight size={16} />
            </button>
          </div>
          <LabRange
            label="Inspect event"
            value={checkpoint}
            min={0}
            max={trace.length - 1}
            onChange={(checkpoint) => update({ checkpoint })}
          />

          <div className="lab-choices" aria-label="Route scenarios">
            {traveler.scenarios.map((s) => (
              <button
                key={s.id}
                aria-pressed={state.scenario === s.id}
                onClick={() => update({ scenario: s.id, checkpoint: 0 })}
              >
                {s.label}
              </button>
            ))}
          </div>

          <LabRange
            label="Initial Hop Limit"
            value={state.hopLimit}
            min={0}
            max={8}
            onChange={(hopLimit) => update({ hopLimit, checkpoint: 0 })}
          />

          <button onClick={() => update(defaults)}>
            <RotateCcw size={16} />
            Reset traveler
          </button>
          <details className="lab-assumptions">
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
