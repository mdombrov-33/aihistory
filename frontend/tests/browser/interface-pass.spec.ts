import { test, expect } from "@playwright/test";
import { preparedStories } from "../../src/content/lessons/registry";

test("homepage studies keep inspection, model viewpoints and map feedback beside their subjects", async ({
  page,
}) => {
  await page.goto("/");

  const moon = page.locator("#moon-showcase");

  await moon.scrollIntoViewIfNeeded();
  await expect(moon.locator(".native-object")).toHaveAttribute("data-status", "ready");
  await expect(moon.locator("iframe")).toHaveCount(0);
  await moon.getByRole("button", { name: "Turn it around", exact: true }).click();
  await expect(moon.locator("model-viewer")).toHaveAttribute("camera-orbit", "180deg 75deg 105%");

  const map = page.locator("#map-showcase");

  await expect(map.locator("canvas, model-viewer")).toHaveCount(0);
  await map.getByRole("button", { name: "San Francisco — Tokyo", exact: true }).click();
  await expect(
    map.getByRole("heading", { name: "One ocean, on both sides of the map." }),
  ).toBeVisible();

  await map.getByRole("button", { name: "New York — London", exact: true }).click();
  await expect(
    map.getByRole("heading", { name: "Across the North Atlantic.", exact: true }),
  ).toBeVisible();

  const art = page.locator("#art-showcase");

  await art.getByRole("button", { name: "Inspect The clouds", exact: true }).click();
  await expect(art.getByRole("heading", { name: "A different rhythm in the sky." })).toBeVisible();
  await expect(art.locator(".evidence-study-detail")).toBeInViewport();
  await art.getByRole("button", { name: "Close image detail", exact: true }).click();
  await expect(art.getByRole("button", { name: "Inspect The clouds", exact: true })).toBeFocused();

  await expect(art.getByRole("link", { name: "Explore Hokusai’s world" })).toHaveAttribute(
    "href",
    "/stories/great-wave-made-by-hand/play/2",
  );
});

test("appearance stays in settings, persists and discovery filters real lessons", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("combobox", { name: "Appearance", exact: true })).toHaveCount(0);
  await page.goto("/settings");
  await page.getByRole("button", { name: /Mineral/ }).click();
  await expect(page.locator("html")).toHaveClass(/mineral/);
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/mineral/);
  await page.getByRole("button", { name: "Music", exact: true }).click();
  await expect(page.locator(".story-card")).toHaveCount(1);
  await expect(page.locator(".story-card")).toHaveAttribute("href", "/stories/shape-a-sound");
  await page.getByRole("button", { name: "All topics", exact: true }).click();
  await expect(page.locator(".story-card")).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test("the image-story composition fills its column and whole-source inspection stays available", async ({
  page,
}) => {
  await page.goto("/stories/invention-of-photography/play/2?passage=1");

  const art = page.locator(".lesson-visual .image-explorer");

  await expect(art).toHaveAttribute("data-framing", "cover");
  await expect
    .poll(() =>
      art.evaluate((el) => {
        const frame = el.querySelector(".image-explorer-window")!.getBoundingClientRect();
        const image = el.querySelector("img")!.getBoundingClientRect();

        return (
          image.left <= frame.left + 2 &&
          image.top <= frame.top + 2 &&
          image.right >= frame.right - 2 &&
          image.bottom >= frame.bottom - 2
        );
      }),
    )
    .toBe(true);
  await art.getByRole("button", { name: "Fit whole image" }).click();
  await expect(art).toHaveAttribute("data-exploring", "true");
  await art.getByRole("button", { name: "Enlarge image" }).click();
  await expect(page.getByRole("dialog", { name: "Look closer" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(art.getByRole("button", { name: "Enlarge image" })).toBeFocused();
});
test("maps, detail crops, process operations and object viewpoints change actual content", async ({
  page,
}) => {
  await page.goto("/stories/shape-of-a-signal/play/1?passage=4");
  await page.getByRole("button", { name: "1866 · an ocean segment" }).click();
  await expect(page.locator(".map-focus h2")).toHaveText("Newfoundland");
  await page.goto("/stories/great-wave-made-by-hand/play/0?passage=2");
  await page.getByRole("button", { name: "Inspect Distant Fuji", exact: true }).click();
  await expect(page.locator(".image-detail h2")).toHaveText("Small, but the series’ anchor");
  await page.goto("/stories/shape-of-a-signal/play/0?passage=2");
  await page.getByRole("button", { name: /Make a pattern/ }).click();
  await expect(page.locator(".operation h2")).toHaveText("Make a pattern");
  await page.goto("/stories/shape-of-a-signal/play/2?passage=4");
  await page.getByRole("button", { name: "Contact and adjustment", exact: true }).click();
  await expect(page.locator("model-viewer")).toHaveAttribute("camera-orbit", "100deg 55deg 80%");
});
test("desktop screens bound page scroll; mobile and enlarged text preserve every grouped paragraph", async ({
  page,
  isMobile,
}) => {
  await page.goto("/stories/shape-of-a-signal/play/0");
  await expect(page.locator("#passage-0")).toBeVisible();
  await expect(page.locator("#passage-1")).toBeVisible();

  if (!isMobile)
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 2),
    ).toBe(true);

  await page.goto("/settings");
  await page.getByRole("switch", { name: "Larger story text" }).check();
  await page.goto("/stories/great-wave-made-by-hand/play/0");
  await expect(page.locator(".scene-player")).toHaveAttribute("data-reading-fit", "flow");
  await expect(page.locator("#passage-1")).toBeVisible();
});

for (const bundle of preparedStories)
  test(`${bundle.summary.slug} advances through its storyboard and finishes`, async ({ page }) => {
    await page.goto(`/stories/${bundle.summary.slug}/play/0`);

    for (const [sceneIndex, program] of bundle.programs.entries())
      for (const [i, beat] of program.beats.entries()) {
        await expect(page.locator(`[data-composition="${beat.composition}"]`)).toBeVisible();

        const chapter = bundle.lesson.scenes[sceneIndex].chapter;

        const chapterScreens = bundle.programs.flatMap((entry, index) =>
          bundle.lesson.scenes[index].chapter === chapter ? entry.beats : [],
        );

        const screen = chapterScreens.findIndex((entry) => entry.id === beat.id);

        await expect(page.locator(".story-position")).toContainText(
          `Screen ${screen + 1} of ${chapterScreens.length}`,
        );
        await expect(page.locator(`#passage-${beat.passageStart}`)).toBeVisible();
        await expect(page.locator(`#passage-${beat.passageEnd}`)).toBeVisible();
        await page.locator('[data-primary-action="true"]').click();

        if (i === program.beats.length - 1 && sceneIndex < bundle.programs.length - 1)
          await expect(page).toHaveURL(new RegExp(`/play/${sceneIndex + 1}$`));
      }

    await expect(page).toHaveURL(new RegExp(`/stories/${bundle.summary.slug}/sources$`));
    await page.goto("/my-space");
    await expect(
      page.locator(".space-story-status").getByText("Finished", { exact: true }),
    ).toBeVisible();
  });

test("the gallery changes compositions without mounting every heavy viewer", async ({ page }) => {
  await page.goto("/screen-gallery");
  await expect(page.locator(".gallery-selector button")).toHaveCount(26);
  await page.getByRole("button", { name: "Object in the round", exact: true }).click();
  await expect(page.locator(".gallery-scene .native-object")).toHaveCount(1);
  await page.getByRole("button", { name: "A source speaks", exact: true }).click();
  await expect(page.locator(".gallery-scene .native-object")).toHaveCount(0);
  await expect(page.locator(".source-quotation blockquote")).toContainText("What hath God wrought");
});
test("an unavailable 3D asset keeps the source and reading available and can retry", async ({
  page,
}) => {
  await page.route("**/models/moon.glb", (route) => route.abort());
  await page.goto("/");

  const preview = page.locator("#moon-showcase");

  await preview.scrollIntoViewIfNeeded();
  await expect(preview.locator(".native-object")).toHaveAttribute("data-status", "error");
  await expect(preview.getByRole("link", { name: /Source record/ })).toBeVisible();
  await page.unroute("**/models/moon.glb");
  await preview.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(preview.locator(".native-object")).toHaveAttribute("data-status", "ready");
});

test("the artwork keeps its source and can recover from an image failure", async ({ page }) => {
  const artwork = (url: URL) =>
    url.pathname.endsWith("/images/showcase/great-wave/red-fuji.jpg") ||
    (url.pathname === "/_next/image" &&
      (url.searchParams.get("url") ?? "").startsWith("/images/showcase/great-wave/red-fuji.jpg"));

  await page.route(artwork, (route) => route.abort());
  await page.goto("/");

  const preview = page.locator("#art-showcase");

  await preview.scrollIntoViewIfNeeded();
  await expect(
    preview.getByText(
      "The image couldn’t load. You can continue reading and open its source record.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(preview.getByRole("button", { name: /^Inspect / })).toHaveCount(0);
  await expect(preview.getByRole("link", { name: /The Met, JP9/ })).toHaveAttribute(
    "href",
    /metmuseum.org/,
  );
  await page.unroute(artwork);
  await preview.getByRole("button", { name: "Try image again", exact: true }).click();
  await expect(
    preview.getByRole("button", { name: "Inspect The clouds", exact: true }),
  ).toBeVisible();
});

test("every annotated screen starts with reachable pins and shows details beside the image", async ({
  page,
}) => {
  for (const bundle of preparedStories)
    for (const [sceneIndex, program] of bundle.programs.entries())
      for (const beat of program.beats) {
        const points =
          beat.type === "place" ? beat.places : beat.type === "illustrated" ? beat.annotations : [];

        if (!points.length) continue;

        await page.goto(
          `/stories/${bundle.summary.slug}/play/${sceneIndex}?passage=${beat.passageStart}`,
        );

        const pins = page.locator(".scene-marker");

        await expect(pins).toHaveCount(points.length);
        await expect
          .poll(() =>
            pins.evaluateAll((elements) =>
              elements.every((el) => {
                const pin = el.getBoundingClientRect();
                const viewport = el.closest(".image-explorer-window")!.getBoundingClientRect();

                return (
                  pin.left >= viewport.left - 1 &&
                  pin.right <= viewport.right + 1 &&
                  pin.top >= viewport.top - 1 &&
                  pin.bottom <= viewport.bottom + 1
                );
              }),
            ),
          )
          .toBe(true);
        // This explicitly exercises a scrolled reading pane: the response stays with the image.
        await page.locator(".lesson-reading").evaluate((el) => (el.scrollTop = el.scrollHeight));
        await pins.first().click();
        await expect(page.locator(".image-detail h2")).toHaveText(points[0].title);
        await expect(page.locator(".image-detail")).toBeInViewport();
        await expect(page.locator(".lesson-reading .image-detail")).toHaveCount(0);
        await page.getByRole("button", { name: "Close detail", exact: true }).click();
        await expect(page.locator(".image-detail")).toHaveCount(0);
        await expect(pins.first()).toBeFocused();
      }
});
test("comparison sources use one large inspectable pane with immediate switching", async ({
  page,
}) => {
  for (const bundle of preparedStories)
    for (const [sceneIndex, program] of bundle.programs.entries())
      for (const beat of program.beats) {
        if (beat.type !== "comparison") continue;

        await page.goto(
          `/stories/${bundle.summary.slug}/play/${sceneIndex}?passage=${beat.passageStart}`,
        );

        const exhibit = page.locator(".comparison-exhibit");

        await expect(exhibit.locator(".image-explorer")).toHaveCount(1);
        await exhibit.getByRole("button", { name: beat.right.label, exact: true }).click();
        await expect(exhibit.locator(".image-coordinate-plane img")).toHaveAttribute(
          "alt",
          beat.right.alt,
        );
        await expect(exhibit.locator(".selection-explanation")).toContainText(
          beat.right.explanation,
        );

        const frame = await exhibit.locator(".image-explorer-window").boundingBox();

        expect(frame!.height).toBeGreaterThan(240);
        await exhibit.getByRole("button", { name: "Fit whole image", exact: true }).click();
        await expect(exhibit.locator(".image-explorer")).toHaveAttribute("data-exploring", "true");
      }
});
test("local maps avoid false coastlines and adapt their canvas to the actual pane", async ({
  page,
}) => {
  await page.goto("/stories/pompeii/play/1?passage=2");

  const canvas = page.locator(".atlas-canvas");

  await expect(canvas).toHaveAttribute("data-geography", "schematic");
  await expect(canvas.locator(".map-ground")).toHaveCount(0);
  await expect(canvas.getByText("Local positions · schematic", { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      canvas.evaluate((el) => {
        const svg = el.querySelector("svg")!;

        return (
          Math.abs(svg.viewBox.baseVal.width - el.clientWidth) < 2 &&
          Math.abs(svg.viewBox.baseVal.height - el.clientHeight) < 2
        );
      }),
    )
    .toBe(true);

  const bounds = await canvas.boundingBox();

  expect(bounds!.height).toBeGreaterThan(220);
});
