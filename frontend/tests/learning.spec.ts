import { test, expect } from "@playwright/test";

test("3D assembly controls expose parts beside the model and reset consistently", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/stories/camera-opened-up/play/0");
  await expect(page.getByRole("heading", { name: "Take the camera apart." })).toBeVisible();
  await expect(page.locator(".assembly-viewport canvas")).toBeVisible();
  await page.getByRole("button", { name: "Recording plane", exact: true }).click();
  await expect(page.locator(".lab-feedback h2")).toHaveText("Recording plane");
  const slider = page.getByRole("slider", { name: /Separate the parts/ });
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("1");
  await page.reload();
  await expect(slider).toHaveValue("1");
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect(slider).toHaveValue("0");
  expect(errors).toEqual([]);
});
test("lens controls expose real, parallel and virtual states and preserve them on reload", async ({
  page,
}) => {
  await page.goto("/stories/camera-opened-up/play/2");
  await expect(page.getByRole("heading", { name: "The rays meet beyond the lens" })).toBeVisible();
  await page.getByRole("button", { name: "Object at F", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No finite image plane" })).toBeVisible();
  await page.getByRole("button", { name: "Inside the focus", exact: true }).click();
  await expect(page.getByRole("heading", { name: "An upright virtual image" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "An upright virtual image" })).toBeVisible();
});
test("sound stays opt-in and responds to controls, presets and Stop", async ({ page }) => {
  await page.goto("/stories/shape-a-sound/play/0");
  await expect(page.getByRole("button", { name: "Play sound", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Odd harmonics", exact: true }).click();
  await expect(page.locator(".lab-feedback h2")).toHaveText("Odd harmonics");
  await page.getByRole("button", { name: "Play sound", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop sound", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stop sound", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play sound", exact: true })).toBeVisible();
});
test("network inputs recompute the complete output and explanations stay local", async ({
  page,
}) => {
  await page.goto("/stories/signals-and-decisions/play/0");
  await expect(page.getByRole("button", { name: "Request: OFF", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Request: OFF", exact: true }).click();
  await expect(page.locator(".lab-feedback")).toContainText("Result: ON");
  await page.getByRole("button", { name: "Permission: ON", exact: true }).click();
  await expect(page.locator(".lab-feedback")).toContainText("Result: OFF");
  await page.getByRole("button", { name: "AND", exact: true }).click();
  await expect(page.locator(".lab-feedback h2")).toHaveText("AND · OFF");
});
test("pendulum starts paused and changing a parameter resets motion", async ({ page }) => {
  await page.goto("/stories/a-swing-in-time/play/0");
  await expect(page.getByRole("button", { name: "Release pendulum", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Release pendulum", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause experiment", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Moon · 1.62", exact: true }).click();
  await expect(page.getByRole("button", { name: "Release pendulum", exact: true })).toBeVisible();
  await expect(page.locator(".lab-feedback h2")).toContainText("4.94");
});
test("learning workbenches keep feedback reachable on phones and short windows", async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1000, height: 600 },
  ]) {
    await page.setViewportSize(viewport);
    for (const slug of [
      "camera-opened-up",
      "a-swing-in-time",
      "shape-a-sound",
      "signals-and-decisions",
    ]) {
      await page.goto(`/stories/${slug}/play/0`);
      await expect(page.locator(".lab-controls")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      ).toBe(true);
      expect(
        await page.locator(".learning-lab").evaluate((node) => {
          const parent = node.closest(".lesson-visual")!;
          return parent.clientHeight >= node.scrollHeight - 1;
        }),
      ).toBe(true);
      await page.locator(".lab-feedback").scrollIntoViewIfNeeded();
      await expect(page.locator(".lab-feedback")).toBeInViewport();
    }
  }
});
test("enlarged reading releases the complete sound workbench into document flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Larger story text" }).click();
  await page.goto("/stories/shape-a-sound/play/0");
  await expect(page.locator(".scene-player")).toHaveAttribute("data-reading-fit", "flow");
  expect(
    await page
      .locator(".learning-lab")
      .evaluate((node) => node.closest(".lesson-visual")!.clientHeight >= node.scrollHeight - 1),
  ).toBe(true);
});
