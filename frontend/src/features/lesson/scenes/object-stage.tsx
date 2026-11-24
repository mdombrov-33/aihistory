"use client";

// Registered native 3D model, guided viewpoints and source context.

import { useState } from "react";
import { MuseumObject } from "../media/museum-object";
import { Frame } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function ObjectStage(props: StageProps & { beat: Extract<SceneBeat, { type: "object" }> }) {
  const model = props.models?.find((m) => m.id === props.beat.objectId);
  const [view, setView] = useState(0);

  if (!model) return null;

  return (
    <Frame
      props={props}
      visual={
        <div className="object-exhibit h-full min-h-0 grid grid-rows-[minmax(0,_1fr)_auto]">
          <MuseumObject
            model={model}
            view={props.beat.composition === "object-guided" ? model.views[view] : undefined}
            onInspect={props.onInspect}
          />
          {props.beat.composition === "object-guided" ? (
            <div className="guided-views [&_>_details]:py-0 [&_>_details]:px-5 [&_>_details]:text-[14px] [&_summary]:py-3 [&_summary]:min-h-11 [&_summary]:cursor-pointer [&_summary]:text-primary">
              <div
                className="scene-selections py-2 px-3 gap-1 flex flex-wrap bg-background [border-top:1px_solid_var(--line-soft)] [&_button]:py-2 [&_button]:px-3 [&_button]:gap-2 [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:min-h-11 [&_button]:rounded-[6px] [&_button]:text-foreground [&_button]:text-[14px] [&_button]:text-left [&_button]:max-w-full [&_button]:[overflow-wrap:anywhere]"
                aria-label="Object viewpoints"
              >
                {model.views.map((v, i) => (
                  <button
                    key={v.label}
                    aria-pressed={view === i}
                    onClick={() => {
                      props.onInspect();
                      setView(i);
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <details key={view}>
                <summary>About this view</summary>
                <p>{model.views[view].explanation}</p>
              </details>
            </div>
          ) : null}
        </div>
      }
      details={
        <details className="photograph-notes [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:mb-3 [&_a]:gap-2 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:text-[14px] [&_a]:text-primary [&_svg]:w-[17px] [&_svg]:h-[17px] [&_summary]:py-3 [&_summary]:cursor-pointer [&_summary]:text-primary [&_summary]:text-[15px]">
          <summary>About the object</summary>
          <p>{model.context}</p>
        </details>
      }
    />
  );
}
