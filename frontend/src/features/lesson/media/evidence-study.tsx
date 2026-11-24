"use client";

// Inspectable source details used by the discovery exhibit and enlarged view.

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { EvidenceStudyData } from "./evidence-types";
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
    <div className="evidence-study py-7 px-0 gap-[clamp(24px,_4vw,_56px)] grid grid-cols-[minmax(0,_1.65fr)_minmax(280px,_1fr)] items-center max-[760px]:py-5 max-[760px]:gap-6 max-[760px]:grid-cols-[minmax(0,_1fr)]">
      <figure className="evidence-study-source m-0 min-w-0 [&_figcaption]:flex [&_figcaption]:items-center [&_figcaption]:justify-between [&_figcaption]:flex-wrap [&_figcaption]:gap-y-1 [&_figcaption]:gap-x-4 [&_figcaption]:pt-3">
        <div className="evidence-study-print relative [&_>_img]:block [&_>_img]:w-full [&_>_img]:h-auto">
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
            <output
              className="evidence-study-unavailable p-6 gap-4 absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center bg-card text-foreground text-center [&_button]:py-2.5 [&_button]:px-4.5 [&_button]:min-h-11 [&_button]:rounded-[6px] [&_button]:bg-primary [&_button]:text-primary-foreground"
              aria-live="polite"
            >
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
                className="evidence-study-marker absolute [transform:translate(-50%,_-50%)] grid place-items-center w-11 h-11 [border:2px_solid_var(--paper-material)] rounded-[50%] bg-(--paper-ink) text-(--paper-material) text-[16px] font-bold cursor-pointer aria-pressed:bg-(--paper-material) aria-pressed:text-(--paper-ink) aria-pressed:border-(--paper-ink)"
                style={{ left: item.x + "%", top: item.y + "%" }}
                aria-label={"Inspect " + item.label}
                aria-pressed={selected === item.id}
                aria-controls={detailId}
                onClick={() => setSelected(item.id)}
              >
                <span aria-hidden="true">{i + 1}</span>
                <span className="evidence-marker-label py-1.5 px-2.5 hidden absolute bottom-[calc(100%_+_8px)] w-[max-content] rounded-[6px] text-[13px] bg-(--paper-ink) text-(--paper-material)">
                  {item.label}
                </span>
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
      <div className="evidence-study-reading min-w-0 max-[760px]:grid max-[760px]:grid-cols-[minmax(0,_1fr)] [&_>_h3]:text-[clamp(28px,_2.8vw,_40px)] [&_>_h3]:leading-[1.1] [&_>_h3]:mb-3">
        <h3>{study.title}</h3>
        <p className="evidence-study-instruction text-muted-foreground text-[15px] leading-[1.5] mb-6">
          {failed
            ? "You can still open the museum record below the image."
            : "Choose a numbered detail in the print."}
        </p>
        <div
          id={detailId}
          className="evidence-study-detail [&_>_svg]:block [&_>_svg]:w-[min(100%,_280px)] [&_>_svg]:[aspect-ratio:3_/_2] [&_>_svg]:bg-(--paper-material) [&_>_svg]:mb-5 [&_h4]:font-heading [&_h4]:text-[24px] [&_h4]:leading-[1.2] [&_h4]:mb-3 [&_p]:text-[16px] [&_p]:leading-[1.65] [&_p]:text-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
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
