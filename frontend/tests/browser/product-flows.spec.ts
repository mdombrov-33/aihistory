// Connected task journeys through local product state; no external service calls.

import { test, expect, type Page } from "@playwright/test";

async function account(page: Page) {
  await page.goto("/sign-in?next=%2Faccount");
  await page.getByLabel("Email address").fill("reader@example.test");
  await page.getByLabel("Password", { exact: true }).fill("a-sample-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/account");
}

test("Premium review and sample usage preserve free library access", async ({ page }) => {
  await page.goto("/premium");
  await page.getByRole("radio", { name: /Premium/ }).check();
  await page.getByRole("link", { name: "Review Premium" }).click();
  await page.getByRole("button", { name: "Use Premium preview" }).click();
  await expect(page).toHaveURL("/account/membership");
  await page.getByText("Try usage states", { exact: true }).click();
  await page.getByRole("button", { name: "Limit reached", exact: true }).click();
  await expect(
    page.getByText("The sample lesson allowance is used.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("The sample lesson allowance is used.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel preview membership" }).click();
  await page.getByRole("button", { name: "Confirm cancellation preview" }).click();
  await expect(page.getByText("Cancellation preview", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: "Return to the library", exact: true }).click();
  await expect(page.locator(".result-story").first()).toBeVisible();
});
test("a learning trail keeps ordered lessons, chosen interests and private notes", async ({
  page,
}) => {
  await page.goto("/guide");
  await page.getByRole("button", { name: "Art & ideas", exact: true }).click();
  await page.getByLabel("Trail name", { exact: true }).fill("Seeing movement");
  await page.getByLabel("The question you’re following").fill("How do artists show movement?");
  await page.getByRole("button", { name: "Create learning trail", exact: true }).click();
  await page.getByRole("button", { name: "Add to trail", exact: true }).first().click();
  await page.getByRole("button", { name: "Add to trail", exact: true }).first().click();

  const trail = page.getByRole("region", { name: "Current learning trail" });

  await expect(trail.locator("ol > li")).toHaveCount(2);
  await trail
    .getByRole("button", { name: /Move .* up/ })
    .last()
    .click();
  await page.getByLabel("Your private notes").fill("Private thought: follow the shapes.");
  await page.getByRole("button", { name: "Save notes", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Seeing movement", exact: true })).toBeVisible();
  await expect(page.getByLabel("Your private notes")).toHaveValue(
    "Private thought: follow the shapes.",
  );
  await expect(page.getByRole("button", { name: "Art & ideas", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
test("a question survives outline editing, preparation failure, retry and link revocation", async ({
  page,
}) => {
  await page.goto("/create");
  await page
    .getByLabel("What would you like to understand?")
    .fill("How do waves carry information?");
  await page.getByRole("button", { name: "Preview lesson outline", exact: true }).click();
  await page.getByLabel("Chapter 1", { exact: true }).fill("Begin with a visible signal");
  await page.getByRole("button", { name: "Try preparation preview" }).click();
  await page.getByText("Explore preparation states", { exact: true }).click();
  await page.getByRole("button", { name: "Recoverable error", exact: true }).click();
  await page.getByRole("button", { name: "Retry preparation preview", exact: true }).click();
  await page.getByRole("button", { name: "Preview opening ready" }).click();
  await page.getByRole("button", { name: "Preview complete delivery" }).click();
  await page.getByRole("button", { name: "Sharing & publication" }).click();
  await page.getByRole("radio", { name: "Anyone with a link", exact: true }).check();

  const url = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("history-worlds:journey:v1")!);
    const id = state.creations[0].id;

    return "/creations/" + id + "?share=" + state.product.sharing[id].token;
  });

  await page.getByRole("button", { name: "Revoke link" }).click();
  await page.goto(url);
  await expect(
    page.getByRole("heading", { name: "This preview link is no longer available." }),
  ).toBeVisible();
});
test("account verification and password recovery have complete local paths", async ({ page }) => {
  await account(page);
  await page.getByRole("link", { name: "Verify email", exact: true }).click();
  await page.getByRole("button", { name: "Try an expired link" }).click();
  await page.getByRole("button", { name: "Preview replacement link" }).click();
  await page.getByRole("button", { name: "Verify email in preview" }).click();
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Email verified in local preview.", { exact: false })).toBeVisible();
  await page.goto("/new-password");
  await page.getByLabel("New password", { exact: true }).fill("new-sample-password");
  await page.getByLabel("Confirm new password", { exact: true }).fill("a-different-password");
  await page.getByRole("button", { name: "Save password preview" }).click();
  await expect(page.getByRole("alert")).toContainText("do not match");
  await page.getByLabel("Confirm new password", { exact: true }).fill("new-sample-password");
  await page.getByRole("button", { name: "Save password preview" }).click();
  await expect(page.getByRole("heading", { name: "Password change previewed." })).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("history-worlds:journey:v1")),
  ).not.toContain("new-sample-password");
});
test("community drafts can be rated, edited and removed without public writes", async ({
  page,
}) => {
  await account(page);
  await page.goto("/stories/great-wave-made-by-hand");
  await page.getByRole("button", { name: "Like this lesson", exact: true }).click();
  await page.getByRole("button", { name: "Rate clarity 4 out of 5" }).click();
  await page.getByLabel("Your thoughts").fill("The comparison made the shapes easier to see.");
  await page.getByRole("button", { name: "Save local comment" }).click();
  await page.getByRole("button", { name: "Edit local comment" }).click();
  await page.getByLabel("Edit your comment").fill("I want to explore this comparison again.");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.reload();
  await expect(
    page.getByText("I want to explore this comparison again.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete local comment" }).click();
  await expect(page.getByText("No local comments yet.", { exact: false })).toBeVisible();
});
test("free-text lesson questions keep unsupported answers honest", async ({ page }) => {
  await page.goto("/stories/great-wave-made-by-hand/play/0");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await page.getByLabel("Ask about this lesson").fill("Explain an unrelated quantum algorithm");
  await page.getByRole("button", { name: "Find relevant context" }).click();
  await expect(
    page.getByRole("heading", { name: "This question needs a new answer." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Follow this as a new question" })).toHaveAttribute(
    "href",
    /create\?q=/,
  );
});

test("password recovery preserves a plan-review destination", async ({ page }) => {
  await page.goto("/sign-in?next=%2Fpremium%2Freview");
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/reset-password\?next=/);
  await page.getByLabel("Email address").fill("reader@example.test");
  await page.getByRole("button", { name: "Preview recovery" }).click();
  await page.getByRole("link", { name: "Open password-reset preview" }).click();
  await page.getByLabel("New password", { exact: true }).fill("new-sample-password");
  await page.getByLabel("Confirm new password").fill("new-sample-password");
  await page.getByRole("button", { name: "Save password preview" }).click();
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL("/premium/review");
});
test("invalid profile input is rejected and cancelling a comment edit discards changes", async ({
  page,
}) => {
  await account(page);
  await page.getByLabel("Email", { exact: true }).fill("a@b");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("alert")).toContainText("complete email");
  await page.goto("/stories/great-wave-made-by-hand");
  await page.getByLabel("Your thoughts").fill("Keep this original local comment.");
  await page.getByRole("button", { name: "Save local comment" }).click();
  await page.getByRole("button", { name: "Edit local comment" }).click();
  await page.getByLabel("Edit your comment").fill("This edit should be discarded.");
  await page.getByRole("button", { name: "Cancel edit", exact: true }).click();
  await page.reload();
  await expect(page.getByText("Keep this original local comment.", { exact: true })).toBeVisible();
  await expect(page.getByText("This edit should be discarded.", { exact: true })).toHaveCount(0);
});
