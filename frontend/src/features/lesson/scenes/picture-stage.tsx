"use client";

// Numbered image/place details with attached feedback and focus restoration.

import { useState, useRef, useEffect, useContext } from "react";
import { X } from "lucide-react";
import { Art, Frame, SceneAssets } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function PictureStage(
  props: StageProps & { beat: Extract<SceneBeat, { type: "place" | "illustrated" }> },
) {
  const { beat } = props;
  const points = beat.type === "place" ? beat.places : beat.annotations;
  const [selected, setSelected] = useState<string | null>(null);
  const detailTrigger = useRef<HTMLButtonElement | null>(null);
  const detail = points.find((p) => p.id === selected);
  const assets = useContext(SceneAssets);
  const size = assets.find((a) => a.src === beat.image)!;
  const crop = detail?.crop;

  const select = (id: string, trigger: HTMLButtonElement) => {
    props.onInspect();
    detailTrigger.current = trigger;
    setSelected((current) => (current === id ? null : id));
  };

  const close = () => {
    setSelected(null);
    detailTrigger.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!selected) return;

    const dismiss = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        document.querySelector('[role="dialog"]')
      )
        return;

      event.preventDefault();
      setSelected(null);
      detailTrigger.current?.focus({ preventScroll: true });
    };

    document.addEventListener("keydown", dismiss);

    return () => document.removeEventListener("keydown", dismiss);
  }, [selected]);

  return (
    <Frame
      props={props}
      visual={
        <div className="looking-exhibit">
          <div className="looking-art">
            <Art beat={beat} framing="cover" inspectionPoints={points} onInspect={props.onInspect}>
              {points.map((p, i) => (
                <button
                  key={p.id}
                  className="scene-marker image-hotspot"
                  aria-label={"Inspect " + p.label}
                  aria-expanded={selected === p.id}
                  aria-controls={beat.id + "-detail"}
                  style={{ left: p.x + "%", top: p.y + "%" }}
                  onClick={(event) => select(p.id, event.currentTarget)}
                >
                  <span className="marker-number">{i + 1}</span>
                </button>
              ))}
            </Art>
            {detail ? (
              <section
                id={beat.id + "-detail"}
                className="image-detail"
                aria-label={detail.title}
                aria-live="polite"
              >
                {crop ? (
                  <svg
                    viewBox={`${(crop.x / 100) * size.width} ${(crop.y / 100) * size.height} ${(crop.width / 100) * size.width} ${(crop.height / 100) * size.height}`}
                    role="img"
                    aria-label={"Magnified detail: " + detail.label}
                  >
                    <image href={beat.image} width={size.width} height={size.height} />
                  </svg>
                ) : null}
                <div>
                  <h2>{detail.title}</h2>
                  <p>{detail.body}</p>
                </div>
                <button className="detail-close" aria-label="Close detail" onClick={close}>
                  <X />
                </button>
              </section>
            ) : (
              <span id={beat.id + "-detail"} className="sr-only" />
            )}
          </div>
          {points.length ? (
            <div className="scene-selections detail-selections" aria-label="Image details">
              {points.map((p, i) => (
                <button
                  key={p.id}
                  aria-pressed={selected === p.id}
                  aria-controls={beat.id + "-detail"}
                  onClick={(event) => select(p.id, event.currentTarget)}
                >
                  <span>{i + 1}</span>
                  {p.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      }
    />
  );
}
