import { test as base } from '@playwright/test';
import { CartPage } from '../pages/saucedemo/cart.page';
import { CheckoutPage } from '../pages/saucedemo/checkout.page';
import { InventoryPage } from '../pages/saucedemo/inventory.page';
import { LoginPage } from '../pages/saucedemo/login.page';
import { PlaygroundPage } from '../pages/playground/playground.page';

type FrameworkFixtures = {
  sauceLoginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  playgroundPage: PlaygroundPage;
};

export const test = base.extend<FrameworkFixtures>({
  sauceLoginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  playgroundPage: async ({ page }, use) => {
    await use(new PlaygroundPage(page));
  },
});

export { expect } from '@playwright/test';