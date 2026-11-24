"use client";

// Discovery map demonstration with authored locations and local feedback.

import { useId, useState } from "react";
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import land from "@/content/geography/natural-earth-land.json";
import type { SceneBeat } from "@/features/lesson/contracts/scene";

export function RouteStudy({ map }: { map: Extract<SceneBeat, { type: "atlas" }>["map"] }) {
  const [selected, setSelected] = useState(0);
  const captionId = useId();

  const projection = geoMercator().fitExtent(
    [
      [90, 80],
      [850, 310],
    ],
    { type: "LineString", coordinates: map.locations.map((p) => p.coordinates) },
  );

  const path = geoPath(projection);

  const connection =
    path({ type: "LineString", coordinates: map.locations.map((p) => p.coordinates) }) ?? "";

  const point = map.locations[selected];

  return (
    <div className="route-study">
      <svg
        viewBox="0 0 940 390"
        role="img"
        aria-label="Explore the Atlantic connection"
        aria-describedby={captionId}
      >
        <rect width="940" height="390" className="map-water" />
        <path d={path(land as GeoPermissibleObjects) ?? ""} className="map-ground" />
        <path d={connection} className="map-connection-outline" />
        <path d={connection} className="map-connection" />
        {map.locations.map((p, i) => {
          const xy = projection(p.coordinates)!;

          return (
            <g key={p.id} className={i === selected ? "map-location is-selected" : "map-location"}>
              <circle cx={xy[0]} cy={xy[1]} r={i === selected ? 8 : 5} />
              <text x={xy[0]} y={xy[1] + (i % 2 === 0 ? 29 : -20)} textAnchor="middle">
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="route-study-controls" aria-label="Explore connected cities">
        {map.locations.map((p, i) => (
          <button key={p.id} aria-pressed={i === selected} onClick={() => setSelected(i)}>
            {p.name}
          </button>
        ))}
      </div>
      <div className="route-study-caption" id={captionId} aria-live="polite">
        <strong>{point.name}</strong>
        <p>{point.description}</p>
      </div>
      <small>Physical geography · approximate city positions · schematic connections</small>
    </div>
  );
}
