// Equirectangular alignment with NASA's global texture; D3 clips paths at the date line.

import { geoDistance, geoEquirectangular, geoInterpolate, geoPath } from "d3-geo";
import type { MapJourney } from "@/content/discovery/journeys";

const projection = geoEquirectangular()
  .scale(1000 / (2 * Math.PI))
  .translate([500, 250]);

export function mapJourneyGeometry(journey: MapJourney) {
  const interpolate = geoInterpolate(journey.from.coordinates, journey.to.coordinates);
  const coordinates = Array.from({ length: 97 }, (_, i) => interpolate(i / 96));

  return {
    path: geoPath(projection)({ type: "LineString", coordinates }) ?? "",
    from: projection(journey.from.coordinates)!,
    to: projection(journey.to.coordinates)!,
    kilometers:
      Math.round((geoDistance(journey.from.coordinates, journey.to.coordinates) * 6371) / 100) *
      100,
  };
}
