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
          <figure className="source-quotation">
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
