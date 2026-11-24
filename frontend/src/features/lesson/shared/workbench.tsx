"use client";

// Keeps the interactive stage visible while its neighboring control deck scrolls.

import type { ReactNode } from "react";

// The stage never scrolls away when the learner operates the controls.
export function Workbench({
  label,
  className,
  stage,
  controls,
  ...state
}: {
  label: string;
  className: string;
  stage: ReactNode;
  controls: ReactNode;
  "data-draft-status"?: string;
  "data-packet-state"?: string;
  "data-reduce-motion"?: boolean;
}) {
  return (
    <section
      className={`learning-lab interactive-workbench ${className}`}
      aria-label={label}
      {...state}
    >
      <div className="workbench-stage">{stage}</div>
      <div className="workbench-controls">{controls}</div>
    </section>
  );
}
