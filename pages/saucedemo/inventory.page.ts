import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class InventoryPage extends BasePage {
  readonly productNames: Locator;
  readonly sortSelect: Locator;
  readonly addToCartButtons: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.productNames = page.getByText(/^(Sauce Labs|Test\.allTheThings\(\))/);
    this.sortSelect = page.getByRole('combobox');
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    this.cartLink = page.getByRole('button', { name: /^Cart/ });
    this.cartBadge = page.getByText(/^\d+$/);
  }

  async sortByNameAscending(): Promise<void> {
    await this.sortSelect.selectOption('az');
  }

  async addFirstProductToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
