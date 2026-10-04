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

  async expectAppearance(background: string, foreground: string, focus: string): Promise<void> {
    await expect(this.input).toHaveCSS('background-color', background);
    await expect(this.input).toHaveCSS('color', foreground);
    const button = this.root.locator('ce-search-result-item button').first();
    if (await button.count()) {
      await expect(button).toHaveCSS('color', foreground);
      await expect(this.root.locator('ce-search-result-item').first()).toHaveCSS(
        'background-color',
        background,
      );
      await button.hover();
      await this.input.focus();
      await this.input.press('Tab');
      await expect(button).toHaveCSS('outline-color', focus);
    }
  }

  async captureIdentity() {
    return this.root.evaluateHandle((element) => ({
      root: element.shadowRoot,
      input: element.shadowRoot!.querySelector('input'),
    }));
  }

  async expectHover(background: string): Promise<void> {
    const button = this.root.locator('ce-search-result-item button').first();
    await button.hover();
    await expect(button).toHaveCSS('background-color', background);
  }

  async expectDetailColors(foreground: string, brand: string): Promise<void> {
    const detail = this.root.locator('ce-search-result-item-detail').filter({ visible: true });
    await expect(detail).toHaveCSS('color', foreground);
    await expect(detail.locator('.category')).toHaveCSS('color', brand);
  }

  async expectStatusColor(color: string): Promise<void> {
    await expect(this.status).toHaveCSS('color', color);
  }

  async expectCustomDimensions(): Promise<void> {
    await expect(this.input).toHaveCSS('padding-right', '32px');
    await expect(this.input).toHaveCSS('border-radius', '16px');
    await expect(this.status).toHaveCSS('font-size', '17.6px');
  }

  async expectIdentity(
    snapshot: Awaited<ReturnType<AutocompleteComponent['captureIdentity']>>,
  ): Promise<void> {
    expect(
      await this.root.evaluate(
        (element, saved) =>
          element.shadowRoot === saved.root &&
          element.shadowRoot!.querySelector('input') === saved.input,
        snapshot,
      ),
    ).toBe(true);
  }

  async focusInput(): Promise<void> {
    await this.input.focus();
  }

  async expectQueryAndFocus(query: string): Promise<void> {
    await expect(this.input).toHaveValue(query);
    await expect(this.input).toBeFocused();
  }
}
