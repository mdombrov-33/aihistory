"use client";
import dynamic from "next/dynamic";
import type { SceneBeat } from "@/features/player/scene-schema";
import { LearningSession } from "./session";
import { AssemblyLab } from "./assembly-lab";
import { OpticsLab } from "./optics-lab";
import { PendulumLab } from "./pendulum-lab";
import { SoundLab } from "./sound-lab";
const SystemLab = dynamic(() => import("./system-lab").then((module) => module.SystemLab), {
  loading: () => <output className="lab-loading">Preparing the connected system…</output>,
});
export type LearningBeat = Extract<
  SceneBeat,
  { type: "assembly" | "experiment" | "sound" | "system" }
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
      {beat.type === "assembly" ? (
        <AssemblyLab assembly={beat.assembly} onInteract={onInteract} />
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
