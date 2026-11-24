"use client";

// Source-image or quotation display with attribution and interpretation limits.

import { ArrowUpRight } from "lucide-react";
import { compositions } from "../contracts/compositions";
import { Art, Frame, Note } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function EvidenceStage(
  props: StageProps & { beat: Extract<SceneBeat, { type: "evidence" }> },
) {
  const { beat } = props;
  const record = beat.record;
  const source = props.sources[record.sourceIndex];

  return (
    <Frame
      props={props}
      visual={
        beat.composition === "quotation-focus" ? (
          <figure className="source-quotation [&_>_small]:text-[16px] [&_>_small]:text-muted-foreground [&_blockquote]:mx-0 [&_blockquote]:font-heading [&_blockquote]:text-[clamp(40px,_5vw,_76px)] [&_blockquote]:leading-[1.05] [&_blockquote]:mt-7 [&_blockquote]:mb-9 [&_figcaption]:text-[18px] [&_a]:gap-2 [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:mt-8 [&_a]:text-primary [&_svg]:w-4.5">
            <small>{record.date}</small>
            <blockquote>“{record.quote}”</blockquote>
            <figcaption>
              {record.title}
              <span>{source.name} · Transcribed source</span>
            </figcaption>
            <a href={source.url} target="_blank" rel="noreferrer">
              Examine the source <ArrowUpRight />
              <span className="sr-only">opens in a new tab</span>
            </a>
          </figure>
        ) : (
          <Art
            beat={beat}
            framing={beat.imageFit ?? compositions[beat.composition].framing}
            onInspect={props.onInspect}
          />
        )
      }
      details={
        <Note title={record.title}>
          <p>
            {record.date} · {record.material}
          </p>
          <details>
            <summary>Context and limits</summary>
            <p>{record.interpretation}</p>
            <p>{record.limitation}</p>
          </details>
          <a href={source.url} target="_blank" rel="noreferrer">
            Collection / source record
            <ArrowUpRight />
            <span className="sr-only">opens in a new tab</span>
          </a>
        </Note>
      }
    />
  );
}
