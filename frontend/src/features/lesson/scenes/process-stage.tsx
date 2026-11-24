"use client";

// Authored process steps and chapter synthesis, without decorative media.

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Frame } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function ProcessStage(
  props: StageProps & { beat: Extract<SceneBeat, { type: "journey" }> },
) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const summary = beat.composition === "synthesis-board";

  return (
    <Frame
      props={props}
      visual={
        summary ? (
          <ol className="synthesis-board">
            {beat.stages.map((s, i) => (
              <li key={s.title}>
                <span>0{i + 1}</span>
                <div>
                  <small>{s.date}</small>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="process-workbench">
            <ol>
              {beat.stages.map((s, i) => (
                <li key={s.title}>
                  <button
                    aria-pressed={i === selected}
                    aria-controls={beat.id + "-operation"}
                    onClick={() => {
                      props.onInspect();
                      setSelected(i);
                    }}
                  >
                    <span>0{i + 1}</span>
                    <strong>{s.title}</strong>
                    {i < beat.stages.length - 1 ? <ArrowRight aria-hidden="true" /> : null}
                  </button>
                </li>
              ))}
            </ol>
            <div id={beat.id + "-operation"} className="operation" aria-live="polite">
              <small>{beat.stages[selected].date || "Follow the operation"}</small>
              <h2>{beat.stages[selected].title}</h2>
              <p>{beat.stages[selected].body}</p>
            </div>
          </div>
        )
      }
    />
  );
}
