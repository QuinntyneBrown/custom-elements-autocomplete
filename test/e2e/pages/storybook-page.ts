import { expect, type Page } from '@playwright/test';

export class StorybookPage {
  constructor(readonly page: Page) {}
  async openStory(id = 'components-auto-complete--default', globals = ''): Promise<void> {
    await this.page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(this.page.locator('.component-preview').first()).toBeVisible();
  }
  async search(query: string): Promise<void> {
    await this.page.locator('ce-auto-complete').first().getByRole('textbox').fill(query);
  }
  async expand(name = 'Red Wine'): Promise<void> {
    await this.page.getByRole('button', { name, exact: true }).first().click();
    await expect(this.page.getByText('Rich berry notes.').first()).toBeVisible();
  }
  async assertNoOverflow(): Promise<void> {
    expect(
      await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  async openDocs(id = 'components-auto-complete--docs'): Promise<void> {
    await this.page.goto(`/?path=/docs/${id}`, { waitUntil: 'domcontentloaded' });
    await expect(
      this.page
        .frameLocator('#storybook-preview-iframe')
        .getByRole('heading', { name: 'Auto Complete', exact: true }),
    ).toBeVisible();
  }
  async assertStatus(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible();
  }
  async assertUnconfigured(): Promise<void> {
    await expect(this.page.getByRole('textbox')).toBeDisabled();
  }
  async assertProduct(name: string): Promise<void> {
    await expect(this.page.getByRole('button', { name, exact: true })).toBeVisible();
  }
  async assertSecondQueryEmpty(): Promise<void> {
    await expect(this.page.getByRole('textbox').nth(1)).toHaveValue('');
  }
  async assertTheme(theme: string, direction: string): Promise<void> {
    const preview = this.page.locator('.component-preview').first();
    await expect(preview).toHaveAttribute('dir', direction);
    expect(
      await preview.evaluate((element) => element.style.getPropertyValue('--ce-colorBrandStroke1')),
    ).toBe(theme === 'custom' ? '#663399' : theme === 'dark' ? '#64b5da' : '#176d91');
  }
  async assertApi(): Promise<void> {
    const docs = this.page.frameLocator('#storybook-preview-iframe');
    await expect(docs.getByText('searchProvider', { exact: true }).first()).toBeVisible();
    await expect(docs.getByText('--ce-colorBrandStroke1', { exact: true }).first()).toBeVisible();
  }
  async selectToolbar(theme: string, direction: string): Promise<void> {
    await this.page.getByRole('button', { name: /^Scoped component theme/ }).click();
    await this.page.getByText(theme, { exact: true }).last().click();
    await this.page.getByRole('button', { name: /^Text direction/ }).click();
    await this.page.getByText(direction, { exact: true }).last().click();
    const docs = this.page.frameLocator('#storybook-preview-iframe');
    await expect(docs.locator('.component-preview').first()).toHaveAttribute(
      'dir',
      direction.toLowerCase(),
    );
    await expect(docs.locator('.component-preview').first()).toHaveCSS(
      'color-scheme',
      theme === 'Dark' ? 'dark' : 'light',
    );
    expect(
      await docs
        .locator('.sbdocs-wrapper')
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    ).toBe('rgb(255, 255, 255)');
  }
  async assertGeneric(): Promise<void> {
    await this.page.getByRole('textbox').fill('Toronto');
    await expect(this.page.getByRole('listitem')).toHaveText('Toronto');
  }
  async assertScopes(): Promise<void> {
    const scopes = this.page.locator('section.component-preview');
    await expect(scopes).toHaveCount(2);
    await expect(scopes.nth(0)).toHaveCSS('color-scheme', 'light');
    await expect(scopes.nth(1)).toHaveCSS('color-scheme', 'dark');
  }
  async assertComponent(tag: string): Promise<void> {
    const element = this.page.locator(tag).first();
    await expect(element).toBeVisible();
    expect(await element.evaluate((element) => element.shadowRoot !== null)).toBe(true);
  }
  async assertSource(): Promise<void> {
    const docs = this.page.frameLocator('#storybook-preview-iframe');
    await docs.getByRole('switch', { name: 'Show code', exact: true }).first().click();
    await expect(docs.locator('pre:visible').first()).toContainText(
      'autocomplete.searchProvider =',
    );
    await expect(docs.locator('pre:visible').first()).not.toContainText('lit$');
  }
}
