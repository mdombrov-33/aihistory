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
    <section className="scene-context-note pt-4 [border-top:1px_solid_var(--line-soft)] [&_h2]:mx-0 [&_h2]:text-[20px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_h3]:mx-0 [&_h3]:text-[18px] [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:mb-3 [&_blockquote]:text-[15px] [&_blockquote]:leading-[1.6] [&_blockquote]:mb-3 [&_small]:text-muted-foreground [&_small]:text-[14px] [&_small]:leading-[1.5] [&_a]:gap-2 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:text-[14px] [&_a]:text-primary [&_summary]:py-3 [&_summary]:cursor-pointer [&_summary]:text-primary [&_summary]:text-[15px]">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
