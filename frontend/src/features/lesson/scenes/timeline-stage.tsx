"use client";

// Chronological text or image sequence with an explicit selected event.

import { useState } from "react";
import { Art, Frame } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function TimelineStage(
  props: StageProps & { beat: Extract<SceneBeat, { type: "timeline" }> },
) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const event = beat.events[selected];

  return (
    <Frame
      props={props}
      image={event.image}
      visual={
        <div
          className="sequence-exhibit h-full min-h-0 grid grid-rows-[minmax(0,_1fr)_auto_auto]"
          data-gallery={beat.composition === "timeline-gallery"}
        >
          {beat.composition === "timeline-gallery" ? (
            <Art
              beat={{ image: event.image, imageAlt: event.imageAlt, caption: event.caption }}
              onInspect={props.onInspect}
            />
          ) : (
            <div
              className="event-explanation p-[clamp(24px,_4vw,_60px)] overflow-auto flex flex-col [justify-content:safe_center] [&_small]:text-primary [&_small]:text-[23px] [&_h2]:my-5 [&_h2]:mx-0 [&_h2]:text-[clamp(32px,_4vw,_58px)] [&_h2]:leading-[1.1] [&_p]:text-[19px] [&_p]:leading-[1.6] [&_p]:max-w-[42ch]"
              aria-live="polite"
            >
              <small>{event.date}</small>
              <h2>{event.title}</h2>
              <p>{event.body}</p>
            </div>
          )}
          <ol className="chronology-track gap-0 overflow-auto flex min-w-0 [border-top:1px_solid_var(--line-soft)] [&_li]:[flex:1_0_140px] [&_button]:py-3 [&_button]:px-4 [&_button]:gap-1.5 [&_button]:h-full [&_button]:min-h-11 [&_button]:flex [&_button]:flex-col [&_button]:items-start [&_button]:w-full [&_button]:text-left [&_button]:bg-background [&_small]:text-[12px] [&_strong]:text-[16px]">
            {beat.events.map((e, i) => (
              <li key={e.title}>
                <button
                  aria-pressed={selected === i}
                  onClick={() => {
                    props.onInspect();
                    setSelected(i);
                  }}
                >
                  <small>{e.date}</small>
                  <strong>{e.title}</strong>
                </button>
              </li>
            ))}
          </ol>
          {beat.composition === "timeline-gallery" ? (
            <p
              className="selection-explanation m-0 px-5 overflow-auto pt-3 pb-4 text-muted-foreground text-[14px] leading-[1.5] max-h-28 [&_p]:m-0"
              aria-live="polite"
            >
              {event.body}
            </p>
          ) : null}
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
