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
        <div className="sequence-exhibit" data-gallery={beat.composition === "timeline-gallery"}>
          {beat.composition === "timeline-gallery" ? (
            <Art
              beat={{ image: event.image, imageAlt: event.imageAlt, caption: event.caption }}
              onInspect={props.onInspect}
            />
          ) : (
            <div className="event-explanation" aria-live="polite">
              <small>{event.date}</small>
              <h2>{event.title}</h2>
              <p>{event.body}</p>
            </div>
          )}
          <ol className="chronology-track">
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
            <p className="selection-explanation" aria-live="polite">
              {event.body}
            </p>
          ) : null}
        </div>
      }
      details={<p className="scene-media-note">{beat.note}</p>}
    />
  );
}
