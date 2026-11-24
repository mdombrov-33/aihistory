// Props shared by scene renderers, including their media and reading inputs.

import type { ReactNode } from "react";
import type { Source, LessonScene } from "@/features/lesson/contracts/lesson";
import type { ModelAsset } from "../contracts/model-asset";
import type { SceneBeat } from "../contracts/scene";

export type SceneAssetSize = { src: string; width: number; height: number; credit?: string };

export type StageProps = {
  assets?: readonly SceneAssetSize[];
  models?: readonly ModelAsset[];
  beat: SceneBeat;
  reading: ReactNode;
  audio: ReactNode;
  sources: Source[];
  onInspect: () => void;
  slug: string;
  scene: LessonScene;
};

export type ImageData = {
  image?: string;
  imageAlt?: string;
  caption?: string;
  imageFit?: "contain" | "cover";
  focalPoint?: [number, number];
};
