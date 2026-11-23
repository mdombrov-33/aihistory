import { geoMercator } from "d3-geo";

/** Generalized world coastlines must never masquerade as city-scale geography. */
export function mapFraming(coordinates: [number, number][], width = 800, height = 600) {
  const longitudes = coordinates.map(([x]) => x);
  const latitudes = coordinates.map(([, y]) => y);
  const local =
    Math.max(...longitudes) - Math.min(...longitudes) < 8 &&
    Math.max(...latitudes) - Math.min(...latitudes) < 8;
  const projection = geoMercator();
  const distinct = new Set(coordinates.map((point) => point.join(","))).size;
  if (distinct < 2)
    projection
      .center(coordinates[0])
      .translate([width / 2, height / 2])
      .scale(width / 6);
  else
    projection.fitExtent(
      [
        [80, 85],
        [width - 80, height - 85],
      ],
      {
        type: "MultiPoint",
        coordinates,
      },
    );
  return { projection, local };
}
