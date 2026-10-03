import { expect, type Locator } from '@playwright/test';

/** Owns locators and operations for one component, including its open Shadow DOM. */
export class AutocompleteComponent {
  readonly input: Locator;
  readonly status: Locator;
  constructor(readonly root: Locator) {
    this.input = root.getByRole('textbox', { name: 'Search products' });
    this.status = root.getByRole('status');
  }
  async search(query: string): Promise<void> {
    await this.input.fill(query);
  }
  async paste(query: string): Promise<void> {
    await this.input.evaluate((input, value) => {
      (input as HTMLInputElement).value = value;
      input.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: value }),
      );
    }, query);
  }
  item(name: string): Locator {
    return this.root.locator('ce-search-result-item').filter({
      has: this.root.page().getByRole('button', { name, exact: true }),
    });
  }
  async select(name: string): Promise<void> {
    await this.root.getByRole('button', { name, exact: true }).click();
  }
  imageFor(name: string): Locator {
    return this.root.getByRole('img', { name, exact: true });
  }
  async scriptCount(): Promise<number> {
    return this.root.locator('script').count();
  }
  async expectProducts(names: string[]): Promise<void> {
    await expect(this.root.locator('ce-search-result-item button')).toHaveText(names);
  }
  async expectExpanded(name: string, expanded = true): Promise<void> {
    await expect(this.root.getByRole('button', { name, exact: true })).toHaveAttribute(
      'aria-expanded',
      String(expanded),
    );
    const detail = this.item(name).locator('ce-search-result-item-detail');
    if (expanded) await expect(detail).toBeVisible();
    else await expect(detail).toBeHidden();
  }
}
