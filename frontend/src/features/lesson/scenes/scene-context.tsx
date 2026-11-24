"use client";

// Shares registered media dimensions and frame helpers across scene families.

import { createContext, useContext, type ReactNode } from "react";
import { ImageExplorer } from "../media/image-explorer";
import { SceneFrame } from "./scene-frame";
import type { SceneAssetSize, StageProps, ImageData } from "./scene-types";

export const SceneAssets = createContext<readonly SceneAssetSize[]>([]);

export function Art({
  beat,
  children,
  onInspect,
  framing,
  inspectionPoints,
}: {
  beat: ImageData;
  children?: ReactNode;
  onInspect?: () => void;
  framing?: "contain" | "cover";
  inspectionPoints?: readonly { x: number; y: number }[];
}) {
  const assets = useContext(SceneAssets);
  const size = assets.find((a) => a.src === beat.image);

  if (!beat.image || !size) return null;

  return (
    <ImageExplorer
      src={beat.image}
      alt={beat.imageAlt ?? "Historical source"}
      caption={beat.caption ?? size.credit}
      width={size.width}
      height={size.height}
      framing={framing ?? beat.imageFit ?? "cover"}
      focalPoint={beat.focalPoint}
      inspectionPoints={inspectionPoints}
      onInspect={onInspect}
    >
      {children}
    </ImageExplorer>
  );
}

export function Frame({
  props,
  visual,
  details,
  image,
}: {
  props: StageProps;
  visual: ReactNode;
  details?: ReactNode;
  image?: string;
}) {
  const assets = useContext(SceneAssets);
  const asset = assets.find((a) => a.src === (image ?? props.beat.image));

  return (
    <SceneFrame
      beat={props.beat}
      reading={props.reading}
      audio={props.audio}
      visual={visual}
      details={details}
      sourceAspect={asset ? asset.width / asset.height : undefined}
    />
  );
}

export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="scene-context-note">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
