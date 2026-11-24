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
        <div className="object-exhibit">
          <MuseumObject
            model={model}
            view={props.beat.composition === "object-guided" ? model.views[view] : undefined}
            onInspect={props.onInspect}
          />
          {props.beat.composition === "object-guided" ? (
            <div className="guided-views">
              <div className="scene-selections" aria-label="Object viewpoints">
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
        <details className="photograph-notes">
          <summary>About the object</summary>
          <p>{model.context}</p>
        </details>
      }
    />
  );
}
