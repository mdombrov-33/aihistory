"use client";
import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { EvidenceStudyData } from "@/content/evidence-studies";
import { ImageExplorer } from "./image-explorer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EvidenceStudy({ study, action }: { study: EvidenceStudyData; action?: ReactNode }) {
  const [selected, setSelected] = useState(study.details[0].id);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const source = study.image + (attempt ? "?retry=" + attempt : "");
  const detail = study.details.find((item) => item.id === selected) ?? study.details[0];
  const detailId = useId();
  return (
    <div className="evidence-study">
      <figure className="evidence-study-source">
        <div className="evidence-study-print">
          <Image
            key={attempt}
            src={source}
            alt={study.alt}
            onError={() => setFailed(true)}
            width={study.width}
            height={study.height}
            sizes="(max-width:760px) 100vw,65vw"
          />
          {failed ? (
            <output className="evidence-study-unavailable" aria-live="polite">
              <span>The museum image couldn’t load.</span>
              <button
                onClick={() => {
                  setFailed(false);
                  setAttempt((n) => n + 1);
                }}
              >
                Try image again
              </button>
            </output>
          ) : (
            study.details.map((item, i) => (
              <button
                key={item.id}
                className="evidence-study-marker"
                style={{ left: item.x + "%", top: item.y + "%" }}
                aria-label={"Inspect " + item.label}
                aria-pressed={selected === item.id}
                aria-controls={detailId}
                onClick={() => setSelected(item.id)}
              >
                <span aria-hidden="true">{i + 1}</span>
                <span className="evidence-marker-label">{item.label}</span>
              </button>
            ))
          )}
        </div>
        <figcaption>
          <a href={study.record} target="_blank" rel="noreferrer">
            {study.credit}
            <ArrowUpRight />
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <Maximize2 />
                Full-size print
              </button>
            </DialogTrigger>
            <DialogContent className="image-inspection-dialog">
              <DialogHeader>
                <DialogTitle>Look closer at the original</DialogTitle>
                <DialogDescription>{study.credit}. Public-domain museum scan.</DialogDescription>
              </DialogHeader>
              <ImageExplorer
                src={study.image}
                alt={study.alt}
                width={study.width}
                height={study.height}
                caption={study.credit}
                expandable={false}
              />
            </DialogContent>
          </Dialog>
        </figcaption>
      </figure>
      <div className="evidence-study-reading">
        <h3>{study.title}</h3>
        <p className="evidence-study-instruction">
          {failed
            ? "You can still open the museum record below the image."
            : "Choose a numbered detail in the print."}
        </p>
        <div id={detailId} className="evidence-study-detail" aria-live="polite" aria-atomic="true">
          {!failed ? (
            <svg
              viewBox={detail.crop.join(" ")}
              role="img"
              aria-label={"Magnified detail: " + detail.label}
            >
              <image
                href={source}
                width={study.width}
                height={study.height}
                onError={() => setFailed(true)}
              />
            </svg>
          ) : null}
          <h4>{detail.title}</h4>
          <p>{detail.explanation}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
