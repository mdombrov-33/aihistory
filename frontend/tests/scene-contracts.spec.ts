import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { stories, getStory, getSceneCount } from "../src/content/catalog";
import { getLesson } from "../src/content/lessons";
import { preparedStories } from "../src/content/prepared-stories";
import { parsePreparedStory } from "../src/story/prepared-story";
import { compositionIds } from "../src/story/compositions";
import { buildSceneProgram } from "../src/features/player/scene-programs";
import { validateSceneProgram } from "../src/features/player/scene-schema";
import { SceneStage } from "../src/features/player/scene-stage";
import { imageFraming } from "../src/components/media/image-framing";
import { mapFraming } from "../src/features/player/map-framing";
import { paginate, paginationHref } from "../src/lib/pagination";

test("the collection retires the five legacy adapters and keeps complete independent bundles", () => {
  for (const slug of [
    "silk-roads",
    "race-to-the-moon",
    "florence-reborn",
    "life-in-edo",
    "across-the-atlantic",
  ]) {
    expect(getStory(slug)).toBeUndefined();
    expect(getLesson(slug)).toBeUndefined();
  }
  expect(stories.length).toBe(9);
  for (const bundle of preparedStories) {
    expect(bundle.version).toBe(2);
    expect(getLesson(bundle.summary.slug)).toEqual(bundle.lesson);
    const { sceneCount, ...summary } = stories.find((s) => s.slug === bundle.summary.slug)!;
    expect(summary).toEqual(bundle.summary);
    expect(sceneCount).toBe(bundle.lesson.scenes.length);
    expect(
      bundle.lesson.scenes
        .flatMap((s) => s.text)
        .join(" ")
        .split(/\s+/).length,
    ).toBeGreaterThan(400);
  }
});
test("storyboards cover all reading exactly once with purposeful compositions and registered media", () => {
  const presets = new Set<string>();
  let grouped = 0;
  for (const bundle of preparedStories) {
    expect(getSceneCount(getStory(bundle.summary.slug)!)).toBe(bundle.lesson.scenes.length);
    for (const [i, scene] of bundle.lesson.scenes.entries()) {
      const program = buildSceneProgram(bundle.summary, bundle.lesson, i);
      expect(
        program.beats.flatMap((b) =>
          Array.from({ length: b.passageEnd - b.passageStart + 1 }, (_, n) => b.passageStart + n),
        ),
      ).toEqual(scene.text.map((_, n) => n));
      for (const beat of program.beats) {
        presets.add(beat.composition);
        if (beat.passageEnd > beat.passageStart) grouped++;
        const paths = [
          beat.image,
          ...(beat.type === "comparison" ? [beat.left.image, beat.right.image] : []),
          ...(beat.type === "timeline" ? beat.events.map((e) => e.image) : []),
        ];
        for (const image of paths.filter(Boolean)) {
          expect(bundle.assets.some((a) => a.src === image)).toBe(true);
          expect(existsSync("public" + image)).toBe(true);
        }
        if (beat.type === "comparison") expect(beat.left.image).not.toBe(beat.right.image);
      }
    }
    for (const asset of bundle.assets) {
      expect(existsSync("public" + asset.src)).toBe(true);
      expect(asset.credit.length).toBeGreaterThan(10);
    }
  }
  expect([...presets].sort()).toEqual([...compositionIds].sort());
  expect(grouped).toBeGreaterThan(10);
});
test("all registered compositions render actual content using bundle assets and models", () => {
  const rendered = new Set<string>();
  for (const bundle of preparedStories)
    for (const [i, program] of bundle.programs.entries())
      for (const beat of program.beats) {
        if (rendered.has(beat.composition)) continue;
        const html = renderToStaticMarkup(
          createElement(SceneStage, {
            beat,
            assets: bundle.assets,
            models: bundle.models,
            slug: bundle.summary.slug,
            scene: bundle.lesson.scenes[i],
            sources: bundle.lesson.sources,
            reading: createElement(
              "section",
              { "aria-label": "Narrative" },
              bundle.lesson.scenes[i].text[beat.passageStart],
            ),
            audio: null,
            onInspect: () => {},
          }),
        );
        expect(html).toContain('data-composition="' + beat.composition + '"');
        expect(html).toContain('class="lesson-visual"');
        expect(html).toContain("Narrative");
        expect(html).not.toMatch(/NaN|undefined/);
        if (beat.type === "object") expect(html).toContain("native-object");
        if (beat.composition === "detail-study") {
          expect(html).toContain('aria-label="Image details"');
          expect(html).not.toContain('class="image-detail"');
        }
        rendered.add(beat.composition);
      }
  expect(rendered.size).toBe(compositionIds.length);
});
test("strict authoring rejects code, unknown media, broken references and invalid composition contracts", () => {
  const input = preparedStories.find((story) => story.summary.slug === "great-wave-made-by-hand")!;
  const mutate = (change: (copy: Record<string, any>) => void) => {
    const copy = structuredClone(input);
    change(copy);
    return () => parsePreparedStory(copy);
  };
  expect(
    mutate((c) => {
      c.programs[0].beats[0].jsx = "<script/>";
    }),
  ).toThrow();
  expect(
    mutate((c) => {
      c.programs[0].beats[0].image = "https://example.com/tracker.jpg";
    }),
  ).toThrow();
  expect(
    mutate((c) => {
      c.programs[0].sceneId = "orphan";
    }),
  ).toThrow(/IDs disagree/);
  expect(
    mutate((c) => {
      c.programs[0].beats[0].image = "/images/unregistered.jpg";
    }),
  ).toThrow(/unregistered asset/);
  expect(
    mutate((c) => {
      c.programs[0].beats[0].imageWidth = 1;
    }),
  ).toThrow(/dimensions/);
  expect(
    mutate((c) => {
      c.programs[0].beats[0].composition = "object-gallery";
    }),
  ).toThrow(/support/);
  expect(
    mutate((c) => {
      c.programs[0].beats[1].annotations[0].crop.width = 101;
    }),
  ).toThrow();
  const b = preparedStories.find((s) => s.models.length)!;
  const copy = structuredClone(b);
  if (copy.programs[0].beats[0].type !== "object") throw new Error("Missing object fixture");
  copy.programs[0].beats[0].objectId = "missing";
  expect(() => parsePreparedStory(copy)).toThrow(/unregistered model/);
  const atlas = structuredClone(b.programs[1]);
  if (atlas.beats[2].type !== "atlas") throw new Error("Missing map state fixture");
  atlas.beats[2].map.states![0].activeLocations = ["unknown"];
  expect(() =>
    validateSceneProgram(atlas, b.lesson.scenes[1].text.length, b.lesson.sources.length),
  ).toThrow(/unknown locations/);
});
test("coverage rejects duplicate, missing and overlapping narrative ranges", () => {
  const b = preparedStories.find((story) => story.summary.slug === "great-wave-made-by-hand")!,
    count = b.lesson.scenes[0].text.length;
  const check = (program: unknown) => validateSceneProgram(program, count, b.lesson.sources.length);
  const duplicate = structuredClone(b.programs[0]);
  duplicate.beats[1].id = duplicate.beats[0].id;
  expect(() => check(duplicate)).toThrow(/Duplicate/);
  const gap = structuredClone(b.programs[0]);
  gap.beats[1].passageStart++;
  expect(() => check(gap)).toThrow(/cover/);
  const missing = structuredClone(b.programs[0]);
  missing.beats.pop();
  expect(() => check(missing)).toThrow(/incomplete/);
  const reference = structuredClone(b.programs[0]);
  reference.beats[0].sourceIndices = [999];
  expect(() => check(reference)).toThrow(/unknown source/);
});
test("native models are local self-contained GLBs with fallback posters and multiple camera views", () => {
  for (const b of preparedStories)
    for (const object of b.models) {
      const model = readFileSync("public" + object.model);
      expect(model.toString("ascii", 0, 4)).toBe("glTF");
      expect(model.readUInt32LE(4)).toBe(2);
      expect(model.readUInt32LE(8)).toBe(model.byteLength);
      const gltf = JSON.parse(model.toString("utf8", 20, 20 + model.readUInt32LE(12)));
      expect(gltf.buffers.every((buffer: { uri?: string }) => !buffer.uri)).toBe(true);
      expect(gltf.images.every((image: { uri?: string }) => !image.uri)).toBe(true);
      expect(existsSync("public" + object.poster)).toBe(true);
      expect(existsSync("public" + object.model + ".provenance.json")).toBe(true);
      expect(object.views.length).toBeGreaterThanOrEqual(2);
    }
  for (const name of ["draco_wasm_wrapper.js", "draco_decoder.wasm", "draco_decoder.js", "LICENSE"])
    expect(existsSync("public/vendor/draco/" + name)).toBe(true);
});
test("nested comparison and timeline media resolve dimensions from the incoming bundle", () => {
  const assets = [{ src: "/images/new-agent-portrait.jpg", width: 1000, height: 2000 }];
  for (const type of ["comparison", "timeline"]) {
    const b =
      type === "timeline"
        ? preparedStories.find((s) => s.summary.slug === "shape-of-a-signal")!
        : preparedStories.find((story) => story.summary.slug === "great-wave-made-by-hand")!;
    const beat = structuredClone(
      b.programs
        .flatMap((p) => p.beats)
        .find(
          (x) => x.type === type && (type !== "timeline" || x.composition === "timeline-gallery"),
        )!,
    );
    if (beat.type === "comparison") beat.left.image = assets[0].src;
    if (beat.type === "timeline") beat.events[0].image = assets[0].src;
    const html = renderToStaticMarkup(
      createElement(SceneStage, {
        beat,
        assets,
        models: b.models,
        slug: b.summary.slug,
        scene: b.lesson.scenes[0],
        sources: b.lesson.sources,
        reading: null,
        audio: null,
        onInspect: () => {},
      }),
    );
    expect(html).toContain('width="1000" height="2000"');
  }
});
test("pagination clamps invalid and removed pages without losing filters or bookmark position", () => {
  const items = Array.from({ length: 19 }, (_, i) => i);
  expect(paginate(items, "2", 6).items).toEqual([6, 7, 8, 9, 10, 11]);
  expect(paginate(items, "999", 6).items).toEqual([18]);
  for (const value of ["NaN", "-2", "Infinity", "1.5"])
    expect(paginate(items, value, 6).page).toBe(1);
  expect(paginate([], "9", 6)).toMatchObject({
    items: [],
    page: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0,
  });
  const url = new URL(
    paginationHref("/my-space", "view=bookmarks&bookmarksPage=2&savedPage=3", "bookmarksPage", 1),
    "https://local.test",
  );
  expect(url.searchParams.get("view")).toBe("bookmarks");
  expect(url.searchParams.get("savedPage")).toBe("3");
  expect(url.searchParams.has("bookmarksPage")).toBe(false);
});

test("all four palettes keep reading, input boundaries, focus and diagram ink above contrast thresholds", () => {
  const css = readFileSync("src/app/theme.css", "utf8");
  const declarations = (block: string) =>
    Object.fromEntries(
      [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
    );
  const material = declarations(css.match(/:root\s*\{([^}]+)/)![1]);
  const luminance = (hex: string) => {
    const values = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const ratio = (a: string, b: string) => {
    const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (high + 0.05) / (low + 0.05);
  };
  for (const theme of ["worlds", "parchment", "forest", "mineral"]) {
    const colors = {
      ...material,
      ...declarations(css.match(new RegExp("\\." + theme + "\\s*\\{([^}]+)"))![1]),
    };
    const color = (role: string): string => {
      const value = colors[role];
      const ref = value.match(/^var\(--([\w-]+)\)$/);
      return ref ? color(ref[1]) : value;
    };
    for (const surface of ["background", "card", "secondary", "muted", "accent", "popover"]) {
      for (const text of ["foreground", "muted-foreground"])
        expect(
          ratio(color(text), color(surface)),
          `${theme} ${text} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      for (const control of ["input", "ring"])
        expect(
          ratio(color(control), color(surface)),
          `${theme} ${control} on ${surface}`,
        ).toBeGreaterThanOrEqual(3);
    }
    expect(
      ratio(color("primary-foreground"), color("primary")),
      theme + " selected control text",
    ).toBeGreaterThanOrEqual(4.5);
    for (const surface of ["background", "card", "popover"])
      expect(ratio(color("primary"), color(surface)), theme + " link").toBeGreaterThanOrEqual(4.5);
    for (const ink of ["paper-ink", "paper-muted"])
      expect(ratio(color(ink), color("paper-material")), theme + " " + ink).toBeGreaterThanOrEqual(
        4.5,
      );
    for (const line of ["paper-line", "paper-accent"])
      expect(
        ratio(color(line), color("paper-material")),
        theme + " " + line,
      ).toBeGreaterThanOrEqual(3);
    for (const surface of ["map-water", "map-land"])
      expect(
        Math.max(
          ratio(color("paper-ink"), color(surface)),
          ratio(color("paper-material"), color(surface)),
        ),
        theme + " route outline",
      ).toBeGreaterThanOrEqual(3);
  }
});

test("image framing fills unmarked panes and keeps every prepared hotspot inside its initial viewport", () => {
  for (const [vw, vh] of [
    [340, 340],
    [390, 520],
    [720, 540],
    [1000, 420],
  ]) {
    const cover = imageFraming(1200, 800, vw, vh, "cover");
    expect(cover.x).toBeLessThanOrEqual(0);
    expect(cover.y).toBeLessThanOrEqual(0);
    expect(cover.x + 1200 * cover.scale).toBeGreaterThanOrEqual(vw - 0.001);
    expect(cover.y + 800 * cover.scale).toBeGreaterThanOrEqual(vh - 0.001);
    for (const bundle of preparedStories)
      for (const beat of bundle.programs.flatMap((p) => p.beats)) {
        const points =
          beat.type === "place"
            ? beat.places
            : beat.type === "illustrated"
              ? [
                  ...beat.annotations,
                  ...(beat.reveal?.marks.flatMap((mark) =>
                    mark.points.map(([x, y]) => ({ x, y })),
                  ) ?? []),
                ]
              : [];
        if (!points.length) continue;
        const asset = bundle.assets.find((a) => a.src === beat.image)!;
        const fit = imageFraming(
          asset.width,
          asset.height,
          vw,
          vh,
          "cover",
          beat.focalPoint,
          points,
        );
        for (const point of points) {
          const x = fit.x + (point.x / 100) * asset.width * fit.scale;
          const y = fit.y + (point.y / 100) * asset.height * fit.scale;
          expect(x).toBeGreaterThanOrEqual(22);
          expect(x).toBeLessThanOrEqual(vw - 22);
          expect(y).toBeGreaterThanOrEqual(22);
          expect(y).toBeLessThanOrEqual(vh - 22);
        }
      }
    for (const targets of [
      [{ x: 0, y: 0 }],
      [{ x: 100, y: 100 }],
      [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
      ],
    ]) {
      const edge = imageFraming(2000, 1000, vw, vh, "cover", [0, 100], targets);
      for (const point of targets) {
        const x = edge.x + (point.x / 100) * 2000 * edge.scale;
        const y = edge.y + (point.y / 100) * 1000 * edge.scale;
        expect(x).toBeGreaterThanOrEqual(22);
        expect(x).toBeLessThanOrEqual(vw - 22);
        expect(y).toBeGreaterThanOrEqual(22);
        expect(y).toBeLessThanOrEqual(vh - 22);
      }
    }
  }
});
test("local geography falls back to a schematic; projections remain finite at each viewport and network state", () => {
  for (const [width, height] of [
    [340, 250],
    [720, 480],
    [1000, 700],
  ]) {
    for (const bundle of preparedStories)
      for (const beat of bundle.programs.flatMap((p) => p.beats)) {
        if (beat.type !== "atlas") continue;
        const groups = beat.map.states?.map((s) =>
          beat.map.locations.filter((p) => s.activeLocations.includes(p.id)),
        ) ?? [beat.map.locations];
        for (const locations of groups) {
          const coords = locations.map((p) => p.coordinates);
          const { projection, local } = mapFraming(coords, width, height);
          for (const point of coords) {
            const xy = projection(point)!;
            expect(xy.every(Number.isFinite)).toBe(true);
            expect(xy[0]).toBeGreaterThanOrEqual(79.99);
            expect(xy[0]).toBeLessThanOrEqual(width - 79.99);
            expect(xy[1]).toBeGreaterThanOrEqual(84.99);
            expect(xy[1]).toBeLessThanOrEqual(height - 84.99);
          }
          if (locations.some((p) => p.id === "pompeii" || p.id === "washington"))
            expect(local).toBe(true);
          if (locations.some((p) => p.id === "valentia")) expect(local).toBe(false);
        }
      }
    const { projection } = mapFraming([[14, 40]], width, height);
    expect(projection([14, 40])!.every(Number.isFinite)).toBe(true);
  }
});
