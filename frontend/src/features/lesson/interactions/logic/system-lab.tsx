"use client";

// Fixed Boolean network whose values and explanations follow the selected inputs.

import { useEffect, useId, useRef, useState } from "react";
import { LabButton } from "../../shared/controls";
import {
  ReactFlow,
  Handle,
  Position,
  type Node,
  type NodeProps,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import { z } from "zod";
import type { LogicSystem } from "./system-schema";
import { evaluateSystem, systemLayout } from "./system-model";
import { useLearningState } from "../../shared/session";

type SignalNode = Node<
  { label: string; active: boolean; kind: string; vertical: boolean },
  "signal"
>;

function Signal({ data }: NodeProps<SignalNode>) {
  return (
    <div
      className="signal-node [&_strong]:block [&_strong]:text-[16px] [&_strong]:font-semibold [&_span]:block [&_span]:text-[12px] [&_span]:mt-1"
      data-active={data.active}
    >
      {data.kind !== "input" ? (
        <Handle type="target" position={data.vertical ? Position.Top : Position.Left} />
      ) : null}
      <strong>{data.label}</strong>
      <span>{data.active ? "ON" : "OFF"}</span>
      {data.kind !== "output" ? (
        <Handle type="source" position={data.vertical ? Position.Bottom : Position.Right} />
      ) : null}
    </div>
  );
}

const nodeTypes = { signal: Signal };
const savedSchema = z.record(z.string(), z.boolean());

export function SystemLab({ system, onInteract }: { system: LogicSystem; onInteract: () => void }) {
  const [inputs, change] = useLearningState(
    savedSchema,
    Object.fromEntries(
      system.nodes.filter((n) => n.kind === "input").map((n) => [n.id, n.initial ?? false]),
    ),
  );

  const [selected, setSelected] = useState(system.nodes[0].id);
  const viewport = useRef<HTMLDivElement>(null);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    if (!viewport.current) return;

    const observer = new ResizeObserver(([entry]) => setVertical(entry.contentRect.width < 500));

    observer.observe(viewport.current);

    return () => observer.disconnect();
  }, []);

  const layout = systemLayout(system, vertical);
  const values = evaluateSystem(system, inputs);
  const instance = useId();
  const current = system.nodes.find((n) => n.id === selected)!;

  const nodes: SignalNode[] = system.nodes.map((n) => ({
    id: n.id,
    type: "signal",
    position: layout.positions[n.id],
    data: { label: n.label, kind: n.kind, active: values[n.id], vertical },
  }));

  const edges = system.edges.map((e) => ({
    id: e.from + "-" + e.to,
    source: e.from,
    target: e.to,
    className: values[e.from] ? "signal-active" : "",
    type: "smoothstep",
    style: { strokeWidth: 3 },
  }));

  return (
    <section className="learning-lab" aria-label="Connected system">
      <div
        ref={viewport}
        className="lab-canvas system-viewport min-h-[330px] max-[760px]:h-[340px] [&_>_svg]:block [&_>_svg]:w-full [&_>_svg]:h-full [&_>_svg]:min-h-[260px] [&_>_svg]:max-h-[55dvh]"
        style={{ minHeight: layout.height }}
      >
        <ReactFlow
          key={vertical ? "vertical" : "horizontal"}
          id={instance}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesReconnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          onNodeClick={(_, node) => {
            onInteract();
            setSelected(node.id);
          }}
          preventScrolling={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} />
        </ReactFlow>
      </div>
      <div className="lab-controls py-5 px-6.5 gap-4 grid bg-muted [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5">
        <div className="lab-choices gap-2 flex flex-wrap items-center" aria-label="System inputs">
          {system.nodes
            .filter((n) => n.kind === "input")
            .map((n) => (
              <LabButton
                key={n.id}
                aria-pressed={values[n.id]}
                onClick={() => {
                  onInteract();
                  change({ [n.id]: !values[n.id] });
                  setSelected(n.id);
                }}
              >
                {n.label}: {values[n.id] ? "ON" : "OFF"}
              </LabButton>
            ))}
          <LabButton
            onClick={() => {
              onInteract();
              change(
                Object.fromEntries(
                  system.nodes
                    .filter((n) => n.kind === "input")
                    .map((n) => [n.id, n.initial ?? false]),
                ),
              );
            }}
          >
            Reset inputs
          </LabButton>
        </div>
        <div
          className="lab-choices gap-2 flex flex-wrap items-center"
          aria-label="Inspect system components"
        >
          {system.nodes
            .filter((n) => n.kind !== "input")
            .map((n) => (
              <LabButton
                key={n.id}
                aria-pressed={selected === n.id}
                onClick={() => {
                  onInteract();
                  setSelected(n.id);
                }}
              >
                {n.label}
              </LabButton>
            ))}
        </div>
      </div>
      <div
        className="lab-feedback py-5 px-6.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_h2]:mx-0 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mx-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[65ch]"
        aria-live="polite"
      >
        <h2>
          {current.label} · {values[current.id] ? "ON" : "OFF"}
        </h2>
        <p>{current.explanation}</p>
        <p>
          {system.nodes
            .filter((n) => n.kind === "output")
            .map((n) => `${n.label}: ${values[n.id] ? "ON" : "OFF"}`)
            .join(" · ")}
        </p>
      </div>
      <details className="lab-assumptions px-6.5 pt-0 pb-5 text-[14px] text-muted-foreground max-[760px]:px-5 max-[760px]:pb-4 [&_summary]:py-3 [&_summary]:px-0 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_p]:mx-0 [&_p]:leading-[1.55] [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mx-0 [&_ul]:leading-[1.55] [&_ul]:mt-0 [&_ul]:mb-2">
        <summary>How this system works</summary>
        <p>{system.description}</p>
        <p>
          Ideal Boolean logic with instantaneous propagation; timing, electrical voltages and
          component failures are not simulated.
        </p>
        <ul>
          {system.edges.map((e) => (
            <li key={e.from + e.to}>
              {system.nodes.find((n) => n.id === e.from)!.label} →{" "}
              {system.nodes.find((n) => n.id === e.to)!.label}: {values[e.from] ? "ON" : "OFF"}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
