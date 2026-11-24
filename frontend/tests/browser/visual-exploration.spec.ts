import { test, expect } from "@playwright/test";

test("artwork starts unmarked and its guide follows keyboard control and enlargement", async ({
  page,
}) => {
  await page.goto("/stories/great-wave-made-by-hand/play/0");

  const reveal = page.getByRole("slider", { name: "Reveal the composition guide" });

  await expect(reveal).toHaveValue("0");
  await page.getByRole("button", { name: "Show guide", exact: true }).click();
  await expect(reveal).toHaveValue("100");
  await page.getByRole("button", { name: "Enlarge image", exact: true }).click();

  const dialog = page.getByRole("dialog");

  await expect(dialog.locator(".reveal-overlay clipPath rect")).toHaveAttribute("width", "100");

  const ids = await page
    .locator(".reveal-overlay clipPath")
    .evaluateAll((nodes) => nodes.map((node) => node.id));

  expect(new Set(ids).size).toBe(ids.length);
  await page.keyboard.press("Escape");
  await reveal.focus();
  await reveal.press("Home");
  await expect(reveal).toHaveAttribute("aria-valuetext", "Original artwork");
});

test("object movement starts still, pauses when sought and resets", async ({ page }) => {
  await page.goto("/stories/camera-opened-up/play/1");

  const exhibit = page.locator(".moving-exhibit");

  await expect(exhibit).toHaveAttribute("data-playing", "false");

  const explanation = page.locator(".moving-caption p").first();
  const originalExplanation = await explanation.innerText();

  await page.getByRole("button", { name: "Play movement", exact: true }).click();
  await expect(exhibit).toHaveAttribute("data-playing", "true");
  await expect(page.locator(".moving-caption h2")).toHaveText("Opening");
  await expect(explanation).toHaveText(originalExplanation);
  await expect(page.locator(".moving-caption h2")).toHaveAttribute("aria-live", "off");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(exhibit).toHaveAttribute("data-playing", "false");

  const movement = page.getByRole("slider", { name: "Movement", exact: true });

  await movement.focus();
  await movement.press("End");
  await expect(page.locator(".moving-caption h2")).toHaveText("Closed again");
  await expect(explanation).toHaveText(originalExplanation);
  await page.getByRole("button", { name: "Reset movement and camera", exact: true }).click();
  await expect(movement).toHaveValue("0");
  await expect(page.locator(".moving-caption h2")).toHaveText("Closed");
});

test("reduced motion provides still poses without automatic playback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/stories/camera-opened-up/play/1");
  await expect(page.getByRole("button", { name: "Play movement", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".moving-caption h2")).toHaveText("Open");
  await expect(page.locator(".moving-exhibit")).toHaveAttribute("data-playing", "false");
  await expect(page.getByRole("slider", { name: "Movement", exact: true })).toHaveValue("0.4");
});

test("visual controls remain with their subject on short and narrow screens", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1000, height: 600 },
  ]) {
    await page.setViewportSize(viewport);

    for (const [route, selector] of [
      ["great-wave-made-by-hand/play/0", ".layer-reveal"],
      ["camera-opened-up/play/1", ".moving-exhibit"],
    ]) {
      await page.goto(`/stories/${route}`);
      await expect(page.locator(selector)).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      expect(
        await page.locator(selector).evaluate((node) => node.scrollHeight <= node.clientHeight + 1),
      ).toBe(true);
    }
  }
});
