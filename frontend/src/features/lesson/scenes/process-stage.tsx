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
          <ol className="synthesis-board [&_li]:gap-5 [&_li]:grid [&_li]:grid-cols-[40px_minmax(0,_1fr)] [&_small]:text-muted-foreground [&_small]:text-[13px] [&_h2]:mx-0 [&_h2]:text-[28px] [&_h2]:leading-[1.15] [&_h2]:mt-1 [&_h2]:mb-3 [&_p]:text-[16px] [&_p]:leading-[1.6] [&_p]:max-w-[44ch]">
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
          <div className="process-workbench [&_>_ol]:flex [&_>_ol]:flex-wrap [&_>_ol]:mb-9 [&_li]:[flex:1_1_110px] [&_button]:py-4 [&_button]:px-3 [&_button]:gap-3 [&_button]:grid [&_button]:grid-cols-[1fr_auto] [&_button]:w-full [&_button]:text-left [&_button]:[border-bottom:2px_solid_var(--border)] [&_svg]:w-4.5">
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
            <div
              id={beat.id + "-operation"}
              className="operation [&_small]:text-[13px] [&_small]:text-muted-foreground [&_h2]:mx-0 [&_h2]:text-[clamp(32px,_3.5vw,_50px)] [&_h2]:leading-[1.1] [&_h2]:mt-3 [&_h2]:mb-5 [&_p]:max-w-[44ch] [&_p]:text-[20px] [&_p]:leading-[1.6]"
              aria-live="polite"
            >
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
