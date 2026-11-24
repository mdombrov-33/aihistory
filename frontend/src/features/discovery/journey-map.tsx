"use client";

// Select a connection on a textured flat map; no second 3D viewer or camera controls.

import { useId, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { mapJourneys } from "@/content/discovery/journeys";
import { mapJourneyGeometry } from "./journey-geometry";

export function JourneyMap() {
  const [selected, setSelected] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const titleId = useId();
  const journey = mapJourneys[selected];
  const geometry = mapJourneyGeometry(journey);

  return (
    <div className="journey-map overflow-hidden rounded-2xl border border-rule bg-card">
      <fieldset className="flex flex-wrap gap-2 border-b border-rule p-3 sm:px-6">
        <legend className="sr-only">Choose a connection</legend>
        {mapJourneys.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            className="min-h-11 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {item.from.name} — {item.to.name}
          </button>
        ))}
      </fieldset>
      <div className="relative bg-[#0b1724]">
        <svg
          viewBox="0 0 1000 500"
          className="block aspect-[2/1] w-full"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>
            {journey.from.name} to {journey.to.name}, a great-circle connection on a world map
          </title>
          <image
            href="/images/home/earth-map.webp"
            width="1000"
            height="500"
            onError={() => setImageFailed(true)}
            onLoad={() => setImageFailed(false)}
          />
          <rect width="1000" height="500" fill="#0b1724" fillOpacity=".15" />
          <path
            d={geometry.path}
            fill="none"
            stroke="#101820"
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={geometry.path}
            fill="none"
            stroke="#f0ca7e"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          {[geometry.from, geometry.to].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle r="5" fill="#f0ca7e" stroke="#101820" strokeWidth="2" />
              <text
                y={i === 0 ? 23 : -14}
                textAnchor="middle"
                fill="#fff5df"
                stroke="#101820"
                strokeWidth="5"
                paintOrder="stroke"
                className="text-[36px] sm:text-[22px] lg:text-[14px]"
                fontWeight="600"
              >
                {i === 0 ? journey.from.name : journey.to.name}
              </text>
            </g>
          ))}
        </svg>
        {imageFailed ? (
          <output className="absolute inset-x-3 bottom-3 rounded-lg bg-[#101820] p-3 text-sm text-on-art">
            The satellite image couldn’t load. The selected connection and explanation are still
            available.
          </output>
        ) : null}
      </div>
      <div
        className="grid gap-3 border-t border-rule px-5 py-5 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:gap-8 sm:px-7"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <p className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {journey.from.name} <ArrowRight className="size-4" aria-hidden="true" />{" "}
            {journey.to.name}
          </p>
          <h3 className="text-2xl leading-tight sm:text-3xl">{journey.title}</h3>
        </div>
        <div>
          <p className="max-w-[60ch] text-base leading-relaxed text-muted-foreground">
            {journey.explanation}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            About {geometry.kilometers.toLocaleString("en-US")} km along a great circle.
          </p>
        </div>
      </div>
      <a
        href="https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/"
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 items-center gap-2 border-t border-rule px-5 py-3 text-xs text-muted-foreground hover:text-foreground sm:px-7"
      >
        NASA Blue Marble · January 2004 composite · connections between approximate city centers
        <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="sr-only">opens in a new tab</span>
      </a>
    </div>
  );
}
