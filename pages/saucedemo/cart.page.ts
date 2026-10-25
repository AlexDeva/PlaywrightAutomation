import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.getByText(/^Sauce Labs /);
    this.removeButtons = page.getByRole('button', { name: 'Remove' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async removeFirstItem(): Promise<void> {
    await this.removeButtons.first().click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
