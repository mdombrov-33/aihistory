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
    <div className="route-study h-full flex flex-col [&_svg]:w-full [&_svg]:[aspect-ratio:940/390] [&_svg]:max-h-[390px] [&_svg]:bg-(--map-water) [&_>_small]:px-6 [&_>_small]:pt-0 [&_>_small]:pb-4 [&_>_small]:text-[10px] [&_>_small]:text-muted-foreground">
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
            <g
              key={p.id}
              className={
                i === selected
                  ? "map-location is-selected [&_circle]:fill-[#34232d] [&_circle]:stroke-[#f7c681] [&_circle]:[stroke-width:2] [&_text]:fill-[#fff0d6] [&_text]:stroke-[#3f2e23] [&_text]:[stroke-width:5px] [&_text]:[paint-order:stroke] [&_text]:text-[18px] [&_text]:font-heading max-[760px]:[&_text]:[stroke-width:6px] max-[760px]:[&_text]:text-[36px]"
                  : "map-location [&_circle]:fill-[#34232d] [&_circle]:stroke-[#f7c681] [&_circle]:[stroke-width:2] [&_text]:fill-[#fff0d6] [&_text]:stroke-[#3f2e23] [&_text]:[stroke-width:5px] [&_text]:[paint-order:stroke] [&_text]:text-[18px] [&_text]:font-heading max-[760px]:[&_text]:[stroke-width:6px] max-[760px]:[&_text]:text-[36px]"
              }
            >
              <circle cx={xy[0]} cy={xy[1]} r={i === selected ? 8 : 5} />
              <text x={xy[0]} y={xy[1] + (i % 2 === 0 ? 29 : -20)} textAnchor="middle">
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        className="route-study-controls py-2.5 px-5 gap-1.5 flex flex-wrap bg-card max-[760px]:px-2.5 max-[760px]:gap-0.5 [&_button]:py-2 [&_button]:px-3 [&_button]:min-h-11 [&_button]:text-[13px] [&_button]:rounded-[6px] [&_button]:text-foreground max-[760px]:[&_button]:px-2 max-[760px]:[&_button]:text-[12px]"
        aria-label="Explore connected cities"
      >
        {map.locations.map((p, i) => (
          <button key={p.id} aria-pressed={i === selected} onClick={() => setSelected(i)}>
            {p.name}
          </button>
        ))}
      </div>
      <div
        className="route-study-caption px-6 pt-4 pb-3 max-[760px]:px-4.5 max-[760px]:pb-4 [&_strong]:font-heading [&_strong]:text-[25px] [&_p]:max-w-[65ch] [&_p]:text-[15px] [&_p]:leading-[1.55] [&_p]:mt-1.5"
        id={captionId}
        aria-live="polite"
      >
        <strong>{point.name}</strong>
        <p>{point.description}</p>
      </div>
      <small>Physical geography · approximate city positions · schematic connections</small>
    </div>
  );
}
