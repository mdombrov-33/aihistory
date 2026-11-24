"use client";
import dynamic from "next/dynamic";
import type { SceneBeat } from "@/features/player/scene-schema";
import { TravelerLab } from "./traveler-lab";
import { LearningSession } from "./session";
import { AssemblyLab } from "./assembly-lab";
import { OpticsLab } from "./optics-lab";
import { PendulumLab } from "./pendulum-lab";
import { SoundLab } from "./sound-lab";
import { AssemblyMotion } from "./assembly-motion";
const SystemLab = dynamic(() => import("./system-lab").then((module) => module.SystemLab), {
  loading: () => <output className="lab-loading">Preparing the connected system…</output>,
});
const ConstructionLab = dynamic(
  () => import("./construction-lab").then((module) => module.ConstructionLab),
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
