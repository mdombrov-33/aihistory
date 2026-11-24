"use client";

// Switches between full-size sources and keeps each explanation beside its selector.

import { useState } from "react";
import { Art, Frame } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function ComparisonStage(
  props: StageProps & { beat: Extract<SceneBeat, { type: "comparison" }> },
) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const sides = [beat.left, beat.right];
  const side = sides[selected];

  return (
    <Frame
      props={props}
      image={side.image}
      visual={
        <div className="comparison-exhibit">
          <Art
            beat={{ image: side.image, imageAlt: side.alt }}
            framing="cover"
            onInspect={props.onInspect}
          />
          <div className="scene-selections" aria-label="Compared sources">
            {sides.map((item, i) => (
              <button
                key={item.image}
                aria-pressed={i === selected}
                onClick={() => {
                  props.onInspect();
                  setSelected(i);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="selection-explanation" aria-live="polite">
            <p>{side.explanation}</p>
          </div>
        </div>
      }
      details={<p className="scene-media-note">{beat.note}</p>}
    />
  );
}
