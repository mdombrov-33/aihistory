"use client";

// Reveals registered editorial geometry over an inspectable original image.

import { useId, useState } from "react";
import { ImageExplorer } from "@/features/lesson/media/image-explorer";
import type { ImageReveal } from "./schema";

function RevealOverlay({ guide, amount }: { guide: ImageReveal; amount: number }) {
  const clip = useId().replaceAll(":", "");

  return (
    <svg
      className="reveal-overlay absolute top-0 right-0 bottom-0 left-0 w-full h-full pointer-events-none"
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
    <section
      className="layer-reveal h-full min-h-0 grid grid-rows-[minmax(0,_1fr)_auto]"
      aria-label="Artwork with a revealable guide"
    >
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
      <div className="reveal-controls px-4.5 grid grid-cols-[auto_minmax(90px,_1fr)_auto] items-center gap-y-1 gap-x-4 pt-2.5 pb-3 [border-top:1px_solid_var(--line-soft)] bg-background max-[760px]:px-3.5 max-[760px]:grid-cols-[minmax(0,_1fr)_auto] max-[760px]:gap-y-0 max-[760px]:gap-x-3 max-[760px]:pt-2 [&_label]:text-[15px] max-[760px]:[&_label]:col-[1] [&_input]:w-full [&_input]:min-w-0 [&_input]:h-11 [&_input]:[accent-color:var(--primary)] [&_input]:[cursor:ew-resize] max-[760px]:[&_input]:col-[1] max-[760px]:[&_input]:row-[2] [&_button]:py-2 [&_button]:px-3 [&_button]:min-h-11 [&_button]:text-primary [&_button]:text-[15px] max-[760px]:[&_button]:col-[2] max-[760px]:[&_button]:row-[1/3] [&_p]:m-0 [&_p]:col-span-full [&_p]:text-[13px] [&_p]:leading-[1.45] [&_p]:text-muted-foreground">
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
