import { readFile, stat } from "node:fs/promises";
import { test, expect } from "../fixtures/test.fixture";
import checkoutData from "../data/checkout.json";
import { resolveEnvironment } from "../config/environment";
import { amountInCents } from "../utils/money.utils";

test(`buy ${checkoutData.product.name} and download the PDF receipt`, async ({
  page,
  login,
  inventory,
  cart,
  information,
  overview,
  complete,
}, testInfo) => {
  // The public site lazy-loads the PDF renderer after the receipt button is clicked.
  test.setTimeout(60_000);

  const { product, customer } = checkoutData;
  const environment = resolveEnvironment();

  await test.step("Log in with the isolated page fixture", async () => {
    await login.goto();
    await login.login(environment.username, environment.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.logo).toBeVisible();
    await expect(inventory.title).toHaveText("Products");
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  await test.step("Verify the backpack and add exactly one to the cart", async () => {
    await expect(inventory.productName).toHaveText(product.name);
    await expect(inventory.price).toHaveText(product.price);
    await inventory.addToCart();
    await expect(inventory.removeButton).toBeVisible();
    await expect(inventory.cartBadge).toHaveText("1");
  });

  await test.step("Verify the cart product, price, and quantity", async () => {
    await inventory.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cart.title).toHaveText("Your Cart");
    await expect(cart.items).toHaveCount(1);
    await expect(cart.productName).toHaveText(product.name);
    await expect(cart.price).toHaveText(product.price);
    await expect(cart.quantity).toHaveText("1");
    await cart.checkout();
  });

  await test.step("Enter and verify checkout information", async () => {
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(information.title).toHaveText("Checkout: Your Information");
    await information.fillInformation(customer);
    await information.continue();
  });

  await test.step("Verify the overview product and displayed totals", async () => {
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(overview.title).toHaveText("Checkout: Overview");
    await expect(overview.items).toHaveCount(1);
    await expect(overview.productName).toHaveText(product.name);
    await expect(overview.price).toHaveText(product.price);
    await expect(overview.quantity).toHaveText("1");
    await expect(overview.subtotal).toHaveText(`Item total: ${product.price}`);
    await expect(overview.tax).toHaveText(/^Tax: \$\d+\.\d{2}$/);
    await expect(overview.total).toHaveText(/^Total: \$\d+\.\d{2}$/);

    const subtotal = amountInCents(await overview.subtotal.innerText());
    const tax = amountInCents(await overview.tax.innerText());
    const total = amountInCents(await overview.total.innerText());
    expect(subtotal, "Subtotal equals the price of one backpack").toBe(
      amountInCents(product.price),
    );
    expect(
      total,
      "Total equals subtotal plus the displayed tax, in cents",
    ).toBe(subtotal + tax);
    await expect(overview.cancelButton).toBeVisible();
    await overview.finish();
  });

  await test.step("Confirm that the order completed", async () => {
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(complete.title).toHaveText("Checkout: Complete!");
    await expect(complete.successMessage).toBeVisible();
    await expect(complete.backHomeButton).toBeVisible();
  });

  await test.step("Download and validate the required PDF receipt", async () => {
    const download = await complete.downloadReceipt();
    expect(
      await download.failure(),
      "Receipt download must succeed",
    ).toBeNull();

    // Each browser project and retry gets its own output directory.
    const receiptPath = testInfo.outputPath("receipt.pdf");
    await download.saveAs(receiptPath);
    const receiptStats = await stat(receiptPath);
    expect(receiptStats.isFile(), "Receipt must be saved as a file").toBe(true);
    expect(
      receiptStats.size,
      "Saved receipt must not be empty",
    ).toBeGreaterThan(0);
    const receipt = await readFile(receiptPath);
    expect(
      receipt.subarray(0, 5).toString("ascii"),
      "Receipt must start with the PDF signature",
    ).toBe("%PDF-");
    await testInfo.attach("PDF receipt", {
      path: receiptPath,
      contentType: "application/pdf",
    });
  });
});
