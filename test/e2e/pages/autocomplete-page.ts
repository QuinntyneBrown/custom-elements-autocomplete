import { expect, type Page } from '@playwright/test';
import { AutocompleteComponent } from './autocomplete-component';

export class AutocompletePage {
  readonly first: AutocompleteComponent;
  readonly second: AutocompleteComponent;
  constructor(readonly page: Page) {
    this.first = new AutocompleteComponent(page.locator('#first'));
    this.second = new AutocompleteComponent(page.locator('#second'));
  }
  async open(
    scenario:
      'normal' | 'empty' | 'error' | 'slow' | 'stale' | 'unsafe' | 'unconfigured' = 'normal',
  ): Promise<void> {
    await this.page.clock.install();
    await this.page.goto('/src/e2e-app/?scenario=' + scenario);
    await expect(this.first.input).toBeVisible();
  }
  async freezeTime(): Promise<void> {
    await this.page.clock.pauseAt(new Date(Date.now() + 1000));
  }
  async elapse(ms: number): Promise<void> {
    await this.page.clock.runFor(ms);
  }
  async expectRequests(queries: string[]): Promise<void> {
    await expect(this.page.getByTestId('requests')).toHaveText(JSON.stringify(queries));
  }
  async disconnect(): Promise<void> {
    await this.page.getByRole('button', { name: 'Disconnect first' }).click();
  }
  async reconnect(): Promise<void> {
    await this.page.getByRole('button', { name: 'Reconnect first' }).click();
  }
  async expectNoOverflow(): Promise<void> {
    expect(
      await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
}
