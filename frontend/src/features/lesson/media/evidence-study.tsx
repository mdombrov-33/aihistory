"use client";

// Image-relative inspection with a closable response on the artwork, never below the exhibit.

import { useEffect, useId, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { EvidenceStudyData } from "./evidence-types";
import { ImageExplorer } from "./image-explorer";

export function EvidenceStudy({
  study,
  action,
  panorama = false,
}: {
  study: EvidenceStudyData;
  action?: ReactNode;
  panorama?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);
  const markers = useRef<Record<string, HTMLButtonElement | null>>({});
  const detail = study.details.find((item) => item.id === selected);
  const detailId = useId();
  const detailPanel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (selected) detailPanel.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [selected]);

  function closeDetail() {
    const previous = selected;

    setSelected(null);
    requestAnimationFrame(() => {
      if (previous) markers.current[previous]?.focus({ preventScroll: true });
    });
  }

  function handleDetailKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape" && selected) {
      event.preventDefault();
      closeDetail();
    }
  }

  return (
    <div className="evidence-study min-w-0 overflow-hidden rounded-2xl border border-rule bg-card">
      <div
        className={
          panorama
            ? "relative w-full h-[clamp(340px,46vw,640px)]"
            : "relative w-full h-[clamp(320px,40vw,580px)]"
        }
      >
        <ImageExplorer
          src={study.image}
          alt={study.alt}
          width={study.width}
          height={study.height}
          caption={study.credit}
          showCaption={false}
          framing={panorama ? "cover" : "contain"}
          inspectionPoints={study.details}
          onAvailabilityChange={setAvailable}
        >
          {available
            ? study.details.map((item, i) => (
                <button
                  key={item.id}
                  ref={(element) => {
                    markers.current[item.id] = element;
                  }}
                  className="image-hotspot evidence-study-marker group absolute z-1 grid size-11 origin-center place-items-center rounded-full border-2 border-[#f7efdf] bg-[#101820] text-base font-semibold text-[#f7efdf] aria-pressed:bg-[#f7efdf] aria-pressed:text-[#101820]"
                  style={{
                    left: item.x + "%",
                    top: item.y + "%",
                    transform: "translate(-50%, -50%) scale(var(--image-counter-scale, 1))",
                  }}
                  aria-label={"Inspect " + item.label}
                  aria-pressed={selected === item.id}
                  aria-expanded={selected === item.id}
                  aria-controls={detail ? detailId : undefined}
                  onKeyDown={handleDetailKey}
                  onClick={() => setSelected(item.id)}
                >
                  <span aria-hidden="true">{i + 1}</span>
                  <span className="pointer-events-none absolute bottom-[calc(100%+8px)] hidden w-max max-w-48 rounded-md bg-art-ink px-3 py-2 text-sm font-normal text-on-art group-hover:block group-focus-visible:block">
                    {item.label}
                  </span>
                </button>
              ))
            : null}
        </ImageExplorer>
        {detail && available ? (
          <section
            ref={detailPanel}
            className="evidence-study-detail absolute inset-x-3 bottom-16 z-4 max-h-[62%] overflow-auto rounded-xl border border-[#f7efdf44] bg-[#101820f5] px-4 py-4 text-on-art sm:inset-x-5 sm:bottom-16 sm:px-6 sm:py-5"
            id={detailId}
            aria-label="Selected image detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl leading-tight text-on-art sm:text-2xl">{detail.title}</h3>
                <p className="mt-2 max-w-[78ch] text-sm leading-relaxed text-on-art sm:text-base">
                  {detail.explanation}
                </p>
              </div>
              <button
                type="button"
                className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-lg text-on-art hover:bg-[#f7efdf1f]"
                onKeyDown={handleDetailKey}
                onClick={closeDetail}
                aria-label="Close image detail"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </section>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-rule px-5 py-2.5 sm:px-7">
        <a
          href={study.record}
          target={study.record.startsWith("https://") ? "_blank" : undefined}
          rel={study.record.startsWith("https://") ? "noreferrer" : undefined}
          className="inline-flex min-h-11 items-center gap-2 text-xs leading-relaxed text-muted-foreground hover:text-foreground"
        >
          {study.credit}
          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
          {study.record.startsWith("https://") ? (
            <span className="sr-only">opens in a new tab</span>
          ) : null}
        </a>
        {action}
      </div>
    </div>
  );
}
