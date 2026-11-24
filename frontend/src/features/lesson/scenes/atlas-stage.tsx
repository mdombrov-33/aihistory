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
              className="atlas-canvas"
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
                      className={focus.id === p.id ? "map-location is-selected" : "map-location"}
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
            <div className="map-focus" aria-live="polite">
              <h2>{focus.name}</h2>
              <p>{active?.description ?? focus.description}</p>
            </div>
          </div>
          <div className="scene-selections" aria-label={active ? "Network states" : "Places"}>
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
          <details className="atlas-note">
            <summary>About this map</summary>
            <p>{beat.map.note}</p>
          </details>
        </div>
      }
    />
  );
}
