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
        <div className="comparison-exhibit h-full min-h-0 grid grid-rows-[minmax(0,_1fr)_auto_auto]">
          <Art
            beat={{ image: side.image, imageAlt: side.alt }}
            framing="cover"
            onInspect={props.onInspect}
          />
          <div
            className="scene-selections py-2 px-3 gap-1 flex flex-wrap bg-background [border-top:1px_solid_var(--line-soft)] [&_button]:py-2 [&_button]:px-3 [&_button]:gap-2 [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:min-h-11 [&_button]:rounded-[6px] [&_button]:text-foreground [&_button]:text-[14px] [&_button]:text-left [&_button]:max-w-full [&_button]:[overflow-wrap:anywhere]"
            aria-label="Compared sources"
          >
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
          <div
            className="selection-explanation m-0 px-5 overflow-auto pt-3 pb-4 text-muted-foreground text-[14px] leading-[1.5] max-h-28 [&_p]:m-0"
            aria-live="polite"
          >
            <p>{side.explanation}</p>
          </div>
        </div>
      }
      details={
        <p className="scene-media-note text-muted-foreground text-[14px] leading-[1.5]">
          {beat.note}
        </p>
      }
    />
  );
}
