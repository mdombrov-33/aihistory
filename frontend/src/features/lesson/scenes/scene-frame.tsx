// Places a scene visual beside its reading, source context and audio controls.

import type { ReactNode } from "react";
import type { SceneBeat } from "../contracts/scene";
import { compositions } from "@/features/lesson/contracts/compositions";

// Compositions own spatial behavior; the bundle supplies content, never JSX or CSS.
export function SceneFrame({
  beat,
  visual,
  reading,
  audio,
  details,
  sourceAspect,
}: {
  beat: SceneBeat;
  visual: ReactNode;
  reading: ReactNode;
  audio: ReactNode;
  details?: ReactNode;
  sourceAspect?: number;
}) {
  return (
    <div
      className="lesson-frame"
      data-family={beat.type}
      data-composition={beat.composition}
      data-layout={compositions[beat.composition].layout}
      data-source-shape={sourceAspect && sourceAspect < 1 ? "portrait" : "landscape"}
    >
      <div className="lesson-visual">{visual}</div>
      <div className="lesson-reading">
        {reading}
        {details ? <div className="lesson-context">{details}</div> : null}
        <div className="lesson-audio">{audio}</div>
      </div>
    </div>
  );
}
