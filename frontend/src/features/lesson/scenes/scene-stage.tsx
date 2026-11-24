"use client";

// Dispatches a validated beat to its scene family; contains no topic-specific rendering.

import { useContext } from "react";
import { ArrowUpRight } from "lucide-react";
import { compositions } from "../contracts/compositions";
import { LearningStage } from "../interactions/interaction-stage";
import { LayerReveal } from "../interactions/image/layer-reveal";
import { SceneAssets, Frame, Art } from "./scene-context";
import type { StageProps } from "./scene-types";
import { PictureStage } from "./picture-stage";
import { AtlasStage } from "./atlas-stage";
import { EvidenceStage } from "./evidence-stage";
import { ComparisonStage } from "./comparison-stage";
import { TimelineStage } from "./timeline-stage";
import { ProcessStage } from "./process-stage";
import { ObjectStage } from "./object-stage";

export function SceneStage(props: StageProps) {
  return (
    <SceneAssets value={props.assets ?? []}>
      <SceneContent {...props} />
    </SceneAssets>
  );
}

function SceneContent(props: StageProps) {
  const assets = useContext(SceneAssets);

  switch (props.beat.type) {
    case "traveler":
    case "construction":
    case "assembly":
    case "experiment":
    case "sound":
    case "system":
      return (
        <Frame
          props={props}
          visual={
            <LearningStage beat={props.beat} scope={props.slug} onInteract={props.onInspect} />
          }
        />
      );
    case "place":
    case "illustrated":
      if (props.beat.type === "illustrated" && props.beat.reveal) {
        const asset = assets.find((a) => a.src === props.beat.image)!;

        return (
          <Frame
            props={props}
            visual={
              <LayerReveal
                src={props.beat.image}
                alt={props.beat.imageAlt}
                caption={props.beat.caption}
                width={asset.width}
                height={asset.height}
                guide={props.beat.reveal}
                onInspect={props.onInspect}
              />
            }
          />
        );
      }

      return <PictureStage {...props} beat={props.beat} />;
    case "atlas":
      return <AtlasStage {...props} beat={props.beat} />;
    case "evidence":
      return <EvidenceStage {...props} beat={props.beat} />;
    case "comparison":
      return <ComparisonStage {...props} beat={props.beat} />;
    case "timeline":
      return <TimelineStage {...props} beat={props.beat} />;
    case "journey":
      return <ProcessStage {...props} beat={props.beat} />;
    case "object":
      return <ObjectStage {...props} beat={props.beat} />;
    case "photograph":
      return (
        <Frame
          props={props}
          visual={
            <Art
              beat={props.beat}
              framing={props.beat.imageFit ?? compositions[props.beat.composition].framing}
              onInspect={props.onInspect}
            />
          }
          details={
            <details className="photograph-notes [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:mb-3 [&_a]:gap-2 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:text-[14px] [&_a]:text-primary [&_svg]:w-[17px] [&_svg]:h-[17px] [&_summary]:py-3 [&_summary]:cursor-pointer [&_summary]:text-primary [&_summary]:text-[15px]">
              <summary>About the image</summary>
              <p>{props.beat.observation}</p>
              <a href={props.beat.sourceUrl} target="_blank" rel="noreferrer">
                Collection record <ArrowUpRight />
                <span className="sr-only">opens in a new tab</span>
              </a>
            </details>
          }
        />
      );
  }
}
