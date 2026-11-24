"use client";

// Selects a supported mechanic and scopes its persistent state to this lesson beat.

import dynamic from "next/dynamic";
import type { SceneBeat } from "@/features/lesson/contracts/scene";
import { TravelerLab } from "./traveler/traveler-lab";
import { LearningSession } from "../shared/session";
import { AssemblyLab } from "./assembly/assembly-lab";
import { OpticsLab } from "./optics/optics-lab";
import { PendulumLab } from "./pendulum/pendulum-lab";
import { SoundLab } from "./sound/sound-lab";
import { AssemblyMotion } from "./assembly/assembly-motion";

const SystemLab = dynamic(() => import("./logic/system-lab").then((module) => module.SystemLab), {
  loading: () => <output className="lab-loading">Preparing the connected system…</output>,
});

const ConstructionLab = dynamic(
  () => import("./logic/construction-lab").then((module) => module.ConstructionLab),
  { loading: () => <output className="lab-loading">Preparing the logic builder…</output> },
);

export type LearningBeat = Extract<
  SceneBeat,
  { type: "assembly" | "experiment" | "sound" | "system" | "traveler" | "construction" }
>;

export function LearningStage({
  beat,
  scope,
  onInteract,
}: {
  beat: LearningBeat;
  scope: string;
  onInteract: () => void;
}) {
  return (
    <LearningSession scope={`${scope}:learning-v1:${beat.id}`}>
      {beat.type === "traveler" ? (
        <TravelerLab traveler={beat.traveler} onInteract={onInteract} />
      ) : beat.type === "construction" ? (
        <ConstructionLab construction={beat.construction} onInteract={onInteract} />
      ) : beat.type === "assembly" ? (
        beat.assembly.motion ? (
          <AssemblyMotion assembly={beat.assembly} onInteract={onInteract} />
        ) : (
          <AssemblyLab assembly={beat.assembly} onInteract={onInteract} />
        )
      ) : beat.type === "sound" ? (
        <SoundLab sound={beat.sound} onInteract={onInteract} />
      ) : beat.type === "system" ? (
        <SystemLab system={beat.system} onInteract={onInteract} />
      ) : beat.experiment.model === "thin-lens" ? (
        <OpticsLab experiment={beat.experiment} onInteract={onInteract} />
      ) : (
        <PendulumLab experiment={beat.experiment} onInteract={onInteract} />
      )}
    </LearningSession>
  );
}
