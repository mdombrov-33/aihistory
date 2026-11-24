"use client";

// Editable Boolean wiring with native controls, diagram feedback and exhaustive checks.

import { Workbench } from "../../shared/workbench";
import { LabButton } from "../../shared/controls";
import { useId, useState } from "react";
import { ReactFlow, Handle, Position, type Node, type NodeProps, Background } from "@xyflow/react";
import { RotateCcw, Unplug } from "lucide-react";
import { useConstructionState } from "../../shared/session";
import {
  constructionLayout,
  diagnoseConstruction,
  inputPorts,
  testConstruction,
  type Construction,
  type ConstructionEdge,
} from "./construction-model";
import { evaluateSystem } from "./system-model";
import { useDiagramWidth } from "../../shared/use-diagram-width";

type BuildNode = Node<
  {
    label: string;
    kind: Construction["nodes"][number]["kind"];
    signal: boolean | undefined;
    vertical: boolean;
  },
  "component"
>;

function Component({ data }: NodeProps<BuildNode>) {
  const ports = inputPorts(data.kind);

  return (
    <div
      className="signal-node build-node [&_strong]:block [&_strong]:text-[16px] [&_strong]:font-semibold [&_span]:block [&_span]:text-[12px] [&_span]:mt-1"
      data-active={data.signal === true}
    >
      {ports.map((port, i) => (
        <Handle
          key={port}
          id={port}
          type="target"
          position={data.vertical ? Position.Top : Position.Left}
          style={
            data.vertical
              ? { left: `${((i + 1) * 100) / (ports.length + 1)}%` }
              : { top: `${((i + 1) * 100) / (ports.length + 1)}%` }
          }
          aria-label={`${data.label} input ${port.toUpperCase()}`}
        />
      ))}
      <strong>{data.label}</strong>
      <span>{data.signal === undefined ? "Not evaluated" : data.signal ? "ON" : "OFF"}</span>
      {data.kind !== "output" && (
        <Handle
          type="source"
          position={data.vertical ? Position.Bottom : Position.Right}
          aria-label={`${data.label} output`}
        />
      )}
    </div>
  );
}

const nodeTypes = { component: Component };

export function ConstructionLab({
  construction,
  onInteract,
}: {
  construction: Construction;
  onInteract: () => void;
}) {
  const [draft, change] = useConstructionState(construction);
  const [tested, setTested] = useState<ReturnType<typeof testConstruction> | null>(null);
  const [notice, setNotice] = useState("");
  const sources = construction.nodes.filter((n) => n.kind !== "output");

  const destinations = construction.nodes.flatMap((n) =>
    inputPorts(n.kind).map((port) => ({
      id: `${n.id}:${port}`,
      node: n.id,
      port,
      label: `${n.label} · input ${port.toUpperCase()}`,
    })),
  );

  const [from, setFrom] = useState(sources[0].id);
  const [destination, setDestination] = useState(destinations[0].id);

  const instance = useId(),
    fromId = useId(),
    toId = useId();

  const { ref, width } = useDiagramWidth();
  const vertical = true;
  const layout = constructionLayout(construction.nodes.length, width);
  const diagnosis = diagnoseConstruction(construction, draft.edges);

  const signals =
    diagnosis.status === "ready" ? evaluateSystem(diagnosis.system, draft.inputs) : {};

  const nodes: BuildNode[] = construction.nodes.map((n, i) => ({
    id: n.id,
    type: "component",
    position: layout.positions[i],
    data: { label: n.label, kind: n.kind, signal: signals[n.id], vertical },
  }));

  const edit = (edges: ConstructionEdge[]) => {
    onInteract();
    change({ ...draft, edges });
    setTested(null);
    setNotice("");
  };

  const proposed = (connection: {
    source: string;
    target: string;
    targetHandle?: string | null;
  }): ConstructionEdge => ({
    from: connection.source,
    to: connection.target,
    port: connection.targetHandle === "b" ? "b" : "a",
  });

  const connect = (edge: ConstructionEdge) => {
    const next = [...draft.edges, edge];
    const check = diagnoseConstruction(construction, next);

    if (check.status === "invalid") {
      onInteract();
      setNotice(check.message);

      return;
    }

    edit(next);
  };

  const counterexample =
    tested?.status === "tested" ? tested.rows.find((row) => !row.passes) : undefined;

  const inputNodes = construction.nodes.filter((n) => n.kind === "input");

  return (
    <Workbench
      label="Logic builder"
      className="construction-lab"
      data-draft-status={diagnosis.status}
      stage={
        <>
          <div className="construction-goal py-4.5 px-6.5 [border-bottom:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_p]:m-0 [&_p]:text-[17px] [&_p]:leading-[1.45]">
            <p>{construction.goal}</p>
          </div>
          <div
            ref={ref}
            className="lab-canvas construction-viewport max-[760px]:flex-none [&_>_svg]:block [&_>_svg]:w-full [&_>_svg]:h-full [&_>_svg]:min-h-[260px] [&_>_svg]:max-h-[55dvh]"
          >
            <div
              className="construction-drawing relative"
              style={{ width: layout.width, height: layout.height }}
            >
              <ReactFlow
                key={vertical ? "vertical" : "horizontal"}
                id={instance}
                nodes={nodes}
                edges={draft.edges.map((e) => ({
                  id: `${e.to}:${e.port}`,
                  source: e.from,
                  target: e.to,
                  targetHandle: e.port,
                  type: "smoothstep",
                  className: signals[e.from] ? "signal-active" : "",
                  style: { strokeWidth: 3 },
                }))}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                minZoom={1}
                maxZoom={1}
                nodesDraggable={false}
                elementsSelectable={false}
                edgesReconnectable={false}
                autoPanOnConnect={false}
                autoPanOnNodeFocus={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                onConnect={(c) => connect(proposed(c))}
                isValidConnection={(c) =>
                  diagnoseConstruction(construction, [...draft.edges, proposed(c)]).status !==
                  "invalid"
                }
              >
                <Background gap={28} size={1} />
              </ReactFlow>
            </div>
          </div>
          <div
            className="lab-feedback py-5 px-6.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_h2]:mx-0 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mx-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[65ch]"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2>
              {tested?.status === "tested"
                ? tested.passes
                  ? "Every case works"
                  : "A case needs attention"
                : diagnosis.status === "ready"
                  ? "Ready to test"
                  : diagnosis.status === "incomplete"
                    ? "Keep connecting"
                    : "Check the connections"}
            </h2>
            <p>
              {notice ||
                (tested?.status === "tested"
                  ? tested.passes
                    ? "Your network matches the goal for every input combination. Other wirings can work too."
                    : "Use the failing case to trace which gate needs to change."
                  : diagnosis.message)}
            </p>
            {counterexample && (
              <p>
                {Object.entries(counterexample.inputs)
                  .map(
                    ([id, value]) =>
                      `${construction.nodes.find((n) => n.id === id)!.label}: ${value ? "ON" : "OFF"}`,
                  )
                  .join(" · ")}{" "}
                — expected {counterexample.expected ? "ON" : "OFF"}, got{" "}
                {counterexample.actual ? "ON" : "OFF"}.
              </p>
            )}
            {diagnosis.status === "ready" && (
              <p>
                Live output:{" "}
                <strong>
                  {signals[construction.nodes.find((n) => n.kind === "output")!.id] ? "ON" : "OFF"}
                </strong>
              </p>
            )}
          </div>
        </>
      }
      controls={
        <>
          <div className="lab-controls py-5 px-6.5 gap-4 grid bg-muted [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5">
            <form
              className="connection-form gap-3 grid grid-cols-[minmax(0,_1fr)_minmax(0,_1.4fr)] [align-items:end] max-[760px]:grid-cols-[minmax(0,_1fr)] [&_>_div]:min-w-0 [&_label]:block [&_label]:mb-1.5 [&_label]:text-[14px] [&_select]:p-2 [&_select]:block [&_select]:w-full [&_select]:min-h-11 [&_select]:border [&_select]:border-input [&_select]:rounded-[8px] [&_select]:bg-background [&_select]:text-foreground [&_select]:[font:inherit] [&_select]:text-[15px] [&_button]:col-span-full"
              onSubmit={(event) => {
                event.preventDefault();

                const target = destinations.find((d) => d.id === destination)!;

                connect({ from, to: target.node, port: target.port });
              }}
            >
              <div>
                <label htmlFor={fromId}>Connect from</label>
                <select id={fromId} value={from} onChange={(e) => setFrom(e.target.value)}>
                  {sources.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={toId}>Connect to</label>
                <select
                  id={toId}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <LabButton type="submit">Add wire</LabButton>
            </form>
          </div>
          <div className="lab-controls py-5 px-6.5 gap-4 grid bg-muted [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5">
            <div className="lab-actions gap-2 flex flex-wrap items-center">
              <LabButton
                className="lab-play"
                variant="primary"
                disabled={diagnosis.status !== "ready"}
                onClick={() => {
                  onInteract();
                  setNotice("");
                  setTested(testConstruction(construction, draft.edges));
                }}
              >
                Test all cases
              </LabButton>
              <LabButton
                onClick={() => {
                  edit(construction.initialEdges);
                  change({
                    version: 1,
                    edges: construction.initialEdges,
                    inputs: Object.fromEntries(inputNodes.map((n) => [n.id, false])),
                  });
                }}
              >
                <RotateCcw size={16} />
                Reset builder
              </LabButton>
            </div>
            <div
              className="lab-choices gap-2 flex flex-wrap items-center"
              aria-label="Builder inputs"
            >
              {inputNodes.map((n) => (
                <LabButton
                  key={n.id}
                  aria-pressed={draft.inputs[n.id] ?? false}
                  onClick={() => {
                    onInteract();
                    change({ ...draft, inputs: { ...draft.inputs, [n.id]: !draft.inputs[n.id] } });
                  }}
                >
                  {n.label}: {draft.inputs[n.id] ? "ON" : "OFF"}
                </LabButton>
              ))}
            </div>
            <p className="lab-control-note m-0 text-[14px] leading-[1.5] text-muted-foreground">
              Drag between ports or use the connection controls. Spare gates can stay unconnected.
            </p>
            {draft.edges.length > 0 && (
              <ul
                className="connection-list m-0 p-0 [list-style:none] [&_li]:py-2.5 [&_li]:px-0 [&_li]:gap-3 [&_li]:flex [&_li]:justify-between [&_li]:items-center [&_li]:[border-top:1px_solid_var(--line-soft)] [&_li]:text-[14px] [&_button]:shrink-0"
                aria-label="Current wires"
              >
                {draft.edges.map((e) => (
                  <li key={`${e.to}:${e.port}`}>
                    <span>
                      {construction.nodes.find((n) => n.id === e.from)!.label} →{" "}
                      {construction.nodes.find((n) => n.id === e.to)!.label} ·{" "}
                      {e.port.toUpperCase()}
                    </span>
                    <LabButton
                      aria-label={`Remove wire from ${e.from} to ${e.to} input ${e.port.toUpperCase()}`}
                      onClick={() => edit(draft.edges.filter((edge) => edge !== e))}
                    >
                      <Unplug size={16} />
                      Remove
                    </LabButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {tested?.status === "tested" && (
            <div className="construction-results py-5 px-6.5 overflow-x-auto [flex:0_0_auto] max-[760px]:py-4.5 max-[760px]:px-5 [&_table]:w-full [&_table]:[border-collapse:collapse] [&_table]:text-[14px] [&_table]:tabular-nums [&_caption]:text-left [&_caption]:mb-3 [&_caption]:font-semibold">
              <table>
                <caption>Every input combination</caption>
                <thead>
                  <tr>
                    {inputNodes.map((n) => (
                      <th scope="col" key={n.id}>
                        {n.label}
                      </th>
                    ))}
                    <th scope="col">Goal</th>
                    <th scope="col">Your output</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tested.rows.map((row, i) => (
                    <tr key={i}>
                      {inputNodes.map((n) => (
                        <td key={n.id}>{row.inputs[n.id] ? "ON" : "OFF"}</td>
                      ))}
                      <td>{row.expected ? "ON" : "OFF"}</td>
                      <td>{row.actual ? "ON" : "OFF"}</td>
                      <td>{row.passes ? "Matches" : "Different"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <details className="lab-assumptions px-6.5 pt-0 pb-5 text-[14px] text-muted-foreground max-[760px]:px-5 max-[760px]:pb-4 [&_summary]:py-3 [&_summary]:px-0 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_p]:mx-0 [&_p]:leading-[1.55] [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mx-0 [&_ul]:leading-[1.55] [&_ul]:mt-0 [&_ul]:mb-2">
            <summary>A hint and the model</summary>
            <p>{construction.hint}</p>
            <p>
              Ideal Boolean gates, with two distinct sources per AND/OR gate. This builder has no
              electrical voltages, timing or feedback memory. Your goal is matching behavior, not
              copying a particular wiring.
            </p>
            <ul>
              {construction.nodes
                .filter((n) => n.kind !== "input" && n.kind !== "output")
                .map((n) => (
                  <li key={n.id}>
                    <strong>{n.label}:</strong> {n.explanation}
                  </li>
                ))}
            </ul>
          </details>
        </>
      }
    />
  );
}
