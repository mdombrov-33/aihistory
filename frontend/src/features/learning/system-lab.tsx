"use client";
import { useEffect, useId, useRef, useState } from "react";
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
import type { LogicSystem } from "./schema";
import { evaluateSystem, systemLayout } from "./models";
import { useLearningState } from "./session";

type SignalNode = Node<
  { label: string; active: boolean; kind: string; vertical: boolean },
  "signal"
>;
function Signal({ data }: NodeProps<SignalNode>) {
  return (
    <div className="signal-node" data-active={data.active}>
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
        className="lab-canvas system-viewport"
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
      <div className="lab-controls">
        <div className="lab-choices" aria-label="System inputs">
          {system.nodes
            .filter((n) => n.kind === "input")
            .map((n) => (
              <button
                key={n.id}
                aria-pressed={values[n.id]}
                onClick={() => {
                  onInteract();
                  change({ [n.id]: !values[n.id] });
                  setSelected(n.id);
                }}
              >
                {n.label}: {values[n.id] ? "ON" : "OFF"}
              </button>
            ))}
          <button
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
          </button>
        </div>
        <div className="lab-choices" aria-label="Inspect system components">
          {system.nodes
            .filter((n) => n.kind !== "input")
            .map((n) => (
              <button
                key={n.id}
                aria-pressed={selected === n.id}
                onClick={() => {
                  onInteract();
                  setSelected(n.id);
                }}
              >
                {n.label}
              </button>
            ))}
        </div>
      </div>
      <div className="lab-feedback" aria-live="polite">
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
      <details className="lab-assumptions">
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
