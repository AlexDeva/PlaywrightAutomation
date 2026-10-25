import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class PlaygroundPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(section: string): Promise<void> {
    await this.navigate(`/${section}`);
  }

  button(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  text(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }
}
