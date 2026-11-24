"use client";

// Responsive geographic or schematic map with local selection feedback.

import { useState, useRef, useEffect, useId } from "react";
import { geoPath, type GeoPermissibleObjects } from "d3-geo";
import land from "@/content/geography/natural-earth-land.json";
import { mapFraming } from "./map-framing";
import { Frame } from "./scene-context";
import type { SceneBeat } from "../contracts/scene";
import type { StageProps } from "./scene-types";

export function AtlasStage(props: StageProps & { beat: Extract<SceneBeat, { type: "atlas" }> }) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const [state, setState] = useState(0);
  const active = beat.map.states?.[state];

  const locations = active
    ? beat.map.locations.filter((p) => active.activeLocations.includes(p.id))
    : beat.map.locations;

  const line = { type: "LineString" as const, coordinates: locations.map((p) => p.coordinates) };
  const canvas = useRef<HTMLDivElement>(null);
  const gridId = useId();
  const [bounds, setBounds] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!canvas.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      if (width > 0 && height > 0)
        setBounds({ width: Math.max(280, width), height: Math.max(220, height) });
    });

    observer.observe(canvas.current);

    return () => observer.disconnect();
  }, []);

  const { projection, local } = mapFraming(
    locations.map((p) => p.coordinates),
    bounds.width,
    bounds.height,
  );

  const path = geoPath(projection);
  const focus = locations[Math.min(selected, locations.length - 1)];

  return (
    <Frame
      props={props}
      visual={
        <div className="atlas-exhibit">
          <div className="atlas-map">
            <div
              className="atlas-canvas py-[15px] px-0 overflow-hidden relative text-foreground min-w-0 min-h-0 bg-surface-deep max-[760px]:pt-0 [&_>_svg]:overflow-hidden [&_>_svg]:w-full [&_>_svg]:max-h-[440px] [&_>_svg]:block [&_>_svg]:h-full max-[760px]:[&_>_svg]:max-h-[265px] max-[760px]:[&_>_svg]:min-h-[200px]"
              ref={canvas}
              data-geography={local ? "schematic" : "physical"}
            >
              <svg
                viewBox={`0 0 ${bounds.width} ${bounds.height}`}
                role="img"
                aria-label={
                  local
                    ? "Approximate local positions; schematic connection, no coastline"
                    : "Physical geography and schematic connections"
                }
              >
                <rect width={bounds.width} height={bounds.height} className="map-water" />
                {local ? (
                  <>
                    <defs>
                      <pattern id={gridId} width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M 48 0 L 0 0 0 48" className="map-grid" />
                      </pattern>
                    </defs>
                    <rect width={bounds.width} height={bounds.height} fill={`url(#${gridId})`} />
                    <text x="24" y="32" className="map-mode-label">
                      Local positions · schematic
                    </text>
                    <text x={bounds.width - 28} y="32" textAnchor="end" className="map-mode-label">
                      N ↑
                    </text>
                  </>
                ) : (
                  <path d={path(land as GeoPermissibleObjects) ?? ""} className="map-ground" />
                )}
                <path d={path(line) ?? ""} className="map-connection-outline" />
                <path d={path(line) ?? ""} className="map-connection" />
                {locations.map((p, i) => {
                  const xy = projection(p.coordinates);

                  return xy ? (
                    <g
                      key={p.id}
                      className={
                        focus.id === p.id
                          ? "map-location is-selected [&_circle]:fill-[#34232d] [&_circle]:stroke-[#f7c681] [&_circle]:[stroke-width:2] [&_text]:fill-[#fff0d6] [&_text]:stroke-[#3f2e23] [&_text]:[stroke-width:5px] [&_text]:[paint-order:stroke] [&_text]:text-[18px] [&_text]:font-heading max-[760px]:[&_text]:[stroke-width:6px] max-[760px]:[&_text]:text-[36px]"
                          : "map-location [&_circle]:fill-[#34232d] [&_circle]:stroke-[#f7c681] [&_circle]:[stroke-width:2] [&_text]:fill-[#fff0d6] [&_text]:stroke-[#3f2e23] [&_text]:[stroke-width:5px] [&_text]:[paint-order:stroke] [&_text]:text-[18px] [&_text]:font-heading max-[760px]:[&_text]:[stroke-width:6px] max-[760px]:[&_text]:text-[36px]"
                      }
                    >
                      <circle cx={xy[0]} cy={xy[1]} r={focus.id === p.id ? 8 : 5} />
                      <text x={xy[0]} y={xy[1] + (i % 2 === 0 ? 30 : -20)} textAnchor="middle">
                        {p.name}
                      </text>
                    </g>
                  ) : null;
                })}
              </svg>
            </div>
            <div
              className="map-focus [&_h2]:mx-0 [&_h2]:text-[23px] [&_h2]:leading-[1.15] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:m-0 [&_p]:text-[15px] [&_p]:leading-[1.5]"
              aria-live="polite"
            >
              <h2>{focus.name}</h2>
              <p>{active?.description ?? focus.description}</p>
            </div>
          </div>
          <div
            className="scene-selections py-2 px-3 gap-1 flex flex-wrap bg-background [border-top:1px_solid_var(--line-soft)] [&_button]:py-2 [&_button]:px-3 [&_button]:gap-2 [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:min-h-11 [&_button]:rounded-[6px] [&_button]:text-foreground [&_button]:text-[14px] [&_button]:text-left [&_button]:max-w-full [&_button]:[overflow-wrap:anywhere]"
            aria-label={active ? "Network states" : "Places"}
          >
            {beat.map.states
              ? beat.map.states.map((s, i) => (
                  <button
                    key={s.label}
                    aria-pressed={state === i}
                    onClick={() => {
                      props.onInspect();
                      setState(i);
                      setSelected(0);
                    }}
                  >
                    {s.label}
                  </button>
                ))
              : locations.map((p, i) => (
                  <button
                    key={p.id}
                    aria-pressed={selected === i}
                    onClick={() => {
                      props.onInspect();
                      setSelected(i);
                    }}
                  >
                    {p.name}
                  </button>
                ))}
          </div>
          <details className="atlas-note m-0 px-5 overflow-auto pt-2 pb-4 text-muted-foreground text-[12px] leading-[1.5] max-h-30 [&_summary]:min-h-11 [&_summary]:flex [&_summary]:items-center [&_summary]:cursor-pointer [&_summary]:text-primary [&_summary]:text-[14px]">
            <summary>About this map</summary>
            <p>{beat.map.note}</p>
          </details>
        </div>
      }
    />
  );
}
