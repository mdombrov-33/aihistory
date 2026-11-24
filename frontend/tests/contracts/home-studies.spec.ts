// Protect the two reported regressions: unreachable image pins and geographic route seams.

import { test, expect } from "@playwright/test";
import { redFujiStudy } from "../../src/content/discovery/home-studies";
import { mapJourneys } from "../../src/content/discovery/journeys";
import { mapJourneyGeometry } from "../../src/features/discovery/journey-geometry";
import { imageFraming } from "../../src/features/lesson/media/image-framing";

test("homepage image details remain reachable at phone, tablet and wide exhibit sizes", () => {
  for (const study of [redFujiStudy]) {
    for (const [width, height] of [
      [300, 288],
      [728, 360],
      [1428, 588],
    ]) {
      const fit = imageFraming(
        study.width,
        study.height,
        width,
        height,
        "cover",
        [50, 50],
        study.details,
      );

      for (const pin of study.details) {
        const x = fit.x + (pin.x * study.width * fit.scale) / 100;
        const y = fit.y + (pin.y * study.height * fit.scale) / 100;

        expect(x).toBeGreaterThanOrEqual(22);
        expect(x).toBeLessThanOrEqual(width - 22);
        expect(y).toBeGreaterThanOrEqual(22);
        expect(y).toBeLessThanOrEqual(height - 22);
      }
    }
  }
});

test("geographic paths match the texture and split Pacific connections at the date line", () => {
  const atlantic = mapJourneyGeometry(mapJourneys[0]);

  expect(atlantic.from[0]).toBeCloseTo(294.43, 1);
  expect(atlantic.to[0]).toBeCloseTo(499.65, 1);
  expect(atlantic.to[1]).toBeCloseTo(106.92, 1);
  expect(atlantic.kilometers).toBe(5600);
  expect(atlantic.path.match(/M/g)).toHaveLength(1);

  const pacific = mapJourneyGeometry(mapJourneys[1]);

  expect(pacific.kilometers).toBe(8300);
  expect(pacific.path.match(/M/g)).toHaveLength(2);
  expect(pacific.path).not.toMatch(/NaN|Infinity/);

  for (const journey of mapJourneys) {
    const { from, to, path } = mapJourneyGeometry(journey);

    expect(path.length).toBeGreaterThan(10);

    for (const point of [from, to]) {
      expect(point[0]).toBeGreaterThanOrEqual(0);
      expect(point[0]).toBeLessThanOrEqual(1000);
      expect(point[1]).toBeGreaterThanOrEqual(0);
      expect(point[1]).toBeLessThanOrEqual(500);
    }
  }
});
