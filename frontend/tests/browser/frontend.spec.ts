import { test, expect } from "@playwright/test";

test("discovery opens the new collection without legacy routes or missing artwork", async ({
  page,
}) => {
  const errors: string[] = [];

  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".story-card")).toHaveCount(4);
  await expect
    .poll(() =>
      page
        .locator(".story-card img")
        .evaluateAll((images) =>
          images.every((i) => i instanceof HTMLImageElement && i.complete && i.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.locator('.story-card[href="/stories/pompeii"]').click();
  await page.getByRole("link", { name: "Start as guest" }).click();
  await expect(page.locator('[data-composition="panorama-explore"]')).toBeVisible();
  await page.getByRole("button", { name: "Full text", exact: true }).click();
  await expect(page.locator(".full-chapter-text article")).toHaveCount(5);
  expect(errors).toEqual([]);
});
test("search and filters find the new topics", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("What would you like to understand?").fill("telegraph");
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await expect(page.locator(".result-story")).toHaveCount(1);
  await page.goto("/explore?topic=Art%20%26%20ideas");
  await expect(page.locator(".result-story")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "The Great Wave, made by hand" })).toBeVisible();
  await page.goto("/explore?q=unmatchableword");
  await expect(
    page.getByRole("heading", { name: "No story fits those filters yet." }),
  ).toBeVisible();
});
test("a bookmark restores an exact paragraph inside a multi-paragraph screen", async ({ page }) => {
  await page.goto("/stories/shape-of-a-signal/play/0?passage=1");
  await page.getByRole("button", { name: "Keep passage 2", exact: true }).click();
  await page.goto("/my-space?view=bookmarks");
  await page.locator('.bookmark-row a[href*="passage=1"]').click();
  await expect(page).toHaveURL(/shape-of-a-signal\/play\/0\?passage=1/);
  await page.reload();
  await expect(page.locator("#passage-1")).toHaveAttribute("data-current", "true");
  await expect(page.locator("#passage-0")).toBeVisible();
  await expect(page.getByRole("button", { name: "Keep passage 2", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
test("themes and reading preferences persist across pages and reload", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: /Parchment/ }).click();
  await expect(page.locator("html")).toHaveClass(/parchment/);
  await page.getByRole("switch", { name: "Larger story text" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/parchment/);
  await expect(page.getByRole("switch", { name: "Larger story text" })).toBeChecked();
  await page.getByRole("button", { name: /Forest/ }).click();
  await expect(page.locator("html")).toHaveClass(/forest/);

  for (const name of ["Mineral", "Worlds", "Parchment", "Forest"]) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    await expect(page.getByRole("button", { name: new RegExp(name) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("html")).toHaveClass(new RegExp(name.toLowerCase()));
    expect(
      await page
        .locator("html")
        .evaluate(
          (node) =>
            ["worlds", "mineral", "parchment", "forest"].filter((n) => node.classList.contains(n))
              .length,
        ),
    ).toBe(1);
  }
});

test("creation saves a local question and does not invent a running job", async ({ page }) => {
  await page.goto("/create");
  await page
    .getByLabel("What would you like to understand?")
    .fill("How did people share news across an ocean?");
  await page.getByRole("button", { name: "Save question & preview the flow" }).click();
  await expect(page).toHaveURL(/creations\//);
  await expect(page.getByText("No job is running now.", { exact: false })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "How did people share news across an ocean?" }),
  ).toBeVisible();
});

test("auth UI has valid forms and a usable guest path", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(
    page.getByRole("button", { name: "Continue with Google", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
  await page.getByLabel("Email address").fill("guest@example.com");
  await page.getByLabel("Password", { exact: true }).fill("sample-password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("link", { name: "Continue as guest" }).click();
  await expect(page).toHaveURL("/my-space");
  await page.goto("/reset-password");
  await page.getByLabel("Email address").fill("guest@example.com");
  await page.getByRole("button", { name: "Preview recovery" }).click();
  await expect(
    page.getByText("No account is created, no email is sent,", { exact: false }),
  ).toBeVisible();
});

test("key routes and compositions stay within the viewport with named controls", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/explore",
    "/screen-gallery",
    "/stories/pompeii",
    "/stories/pompeii/play/0",
    "/stories/shape-of-a-signal/play/1",
    "/stories/invention-of-photography/play/1",
    "/sign-in",
    "/create",
    "/my-space",
    "/settings",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      route,
    ).toBe(true);
    expect(
      await page
        .getByRole("button")
        .evaluateAll(
          (buttons) =>
            buttons.filter(
              (b) =>
                !b.textContent?.trim() &&
                !b.getAttribute("aria-label") &&
                !b.getAttribute("aria-labelledby"),
            ).length,
        ),
      route,
    ).toBe(0);
  }
});
