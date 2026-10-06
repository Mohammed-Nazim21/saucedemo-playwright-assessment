import { test as base } from '@playwright/test';
import checkoutData from '../data/checkout.json';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInformationPage } from '../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';

type CheckoutFixtures = {
  login: LoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  information: CheckoutInformationPage;
  overview: CheckoutOverviewPage;
  complete: CheckoutCompletePage;
};

// Fixtures are test-scoped by default and share the same isolated page.
export const test = base.extend<CheckoutFixtures>({
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventory: async ({ page }, use) => {
    await use(new InventoryPage(page, checkoutData.product.name));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page, checkoutData.product.name));
  },
  information: async ({ page }, use) => {
    await use(new CheckoutInformationPage(page));
  },
  overview: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page, checkoutData.product.name));
  },
  complete: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect } from '@playwright/test';
