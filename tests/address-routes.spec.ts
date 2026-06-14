import { expect, test, type Page } from "@playwright/test";

const validAddress = "0x29FC91357258B6Eb942dA93e4564a4A180B42f1C";
const minerAddress = "0x133bee9f2f023a2d97e5fafff945aa76de7e64d9";
const zeroActivityAddress = "0x000000000000000000000000000000000000dEaD";
const invalidAddress = "0xnot-an-address";

async function collectRuntimeErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (text.includes("Failed to load resource: the server responded with a status of 404")) return;
    errors.push(text);
  });
  return errors;
}

async function expectNoClientError(page: Page, errors: string[]) {
  await expect(page.getByText("Application error")).toHaveCount(0);
  await expect(page.getByText("client-side exception")).toHaveCount(0);
  expect(errors).toEqual([]);
}

async function gotoAddress(page: Page, address: string) {
  await page.goto(`/explorer/address/${address}`, { waitUntil: "domcontentloaded" });
}

test("valid address route renders without client-side exceptions", async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  await gotoAddress(page, validAddress);
  await expect(page.getByText("ACCOUNT").or(page.getByText("Address"))).toBeVisible();
  await expectNoClientError(page, errors);
});

test("miner address route renders without client-side exceptions", async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  await gotoAddress(page, minerAddress);
  await expect(page.getByText("ACCOUNT").or(page.getByText("Address"))).toBeVisible();
  await expectNoClientError(page, errors);
});

test("zero-activity address route renders without client-side exceptions", async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  await gotoAddress(page, zeroActivityAddress);
  await expect(page.getByText("ACCOUNT").or(page.getByText("Address"))).toBeVisible();
  await expectNoClientError(page, errors);
});

test("invalid address route fails gracefully", async ({ page }) => {
  const errors = await collectRuntimeErrors(page);
  await gotoAddress(page, invalidAddress);
  await expect(page.getByText("Invalid address.")).toBeVisible();
  await expectNoClientError(page, errors);
});
