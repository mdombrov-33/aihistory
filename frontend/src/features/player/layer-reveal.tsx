"use client";
import { useId, useState } from "react";
import { ImageExplorer } from "@/components/media/image-explorer";
import type { ImageReveal } from "./reveal-schema";

function RevealOverlay({ guide, amount }: { guide: ImageReveal; amount: number }) {
  const clip = useId().replaceAll(":", "");
  return (
    <svg
      className="reveal-overlay"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width={amount} height="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {guide.marks.map((mark) => {
          const points = [...mark.points, ...(mark.closed ? [mark.points[0]] : [])]
            .map((p) => p.join(","))
            .join(" ");
          return (
            <g key={mark.id}>
              <polyline
                className="reveal-guide-outline"
                points={points}
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                className="reveal-guide-line"
                points={points}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function LayerReveal({
  src,
  alt,
  caption,
  width,
  height,
  guide,
  onInspect,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  guide: ImageReveal;
  onInspect: () => void;
}) {
  const [amount, setAmount] = useState(0);
  const input = useId(),
    description = useId();
  const change = (next: number) => {
    onInspect();
    setAmount(next);
  };
  return (
    <section className="layer-reveal" aria-label="Artwork with a revealable guide">
      <ImageExplorer
        src={src}
        alt={alt}
        caption={caption}
        width={width}
        height={height}
        framing="cover"
        inspectionPoints={guide.marks.flatMap((mark) => mark.points.map(([x, y]) => ({ x, y })))}
        onInspect={onInspect}
        showChildrenInDialog
      >
        <RevealOverlay guide={guide} amount={amount} />
      </ImageExplorer>
      <div className="reveal-controls">
        <label htmlFor={input}>{guide.label}</label>
        <input
          id={input}
          type="range"
          min="0"
          max="100"
          step="1"
          value={amount}
          aria-describedby={description}
          aria-valuetext={
            amount === 0
              ? "Original artwork"
              : amount === 100
                ? "Full composition guide"
                : `${amount}% of guide revealed`
          }
          onChange={(event) => change(Number(event.target.value))}
        />
        <button onClick={() => change(amount > 0 ? 0 : 100)}>
          {amount > 0 ? "Hide guide" : "Show guide"}
        </button>
        <p id={description}>{guide.description}</p>
      </div>
    </section>
  );
}
