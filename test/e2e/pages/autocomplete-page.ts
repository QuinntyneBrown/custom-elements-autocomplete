import { expect, type Page } from '@playwright/test';
import { AutocompleteComponent } from './autocomplete-component';
import type { PartialTheme } from '../../../src/theming/index.js';

export class AutocompletePage {
  private clockInstalled = false;
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
    await this.installClock();
    await this.page.goto('/src/e2e-app/?scenario=' + scenario);
    await expect(this.first.input).toBeVisible();
  }
  async freezeTime(): Promise<void> {
    await this.page.clock.pauseAt(new Date(Date.now() + 1000));
  }

  async openDemo(): Promise<void> {
    await this.installClock();
    await this.page.goto('/src/dev-app/');
    await expect(this.first.input).toBeVisible();
  }

  async overrideContainerTokens(overrides: PartialTheme): Promise<void> {
    await this.page.locator('#primary').evaluate((container, values) => {
      for (const [key, value] of Object.entries(values)) {
        (container as HTMLElement).style.setProperty(`--ce-${key}`, value);
      }
    }, overrides);
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

  async setTheme(theme: 'light' | 'dark' | 'custom'): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption(theme);
  }

  async setInstanceTheme(theme: 'inherit' | 'light' | 'dark' | 'custom'): Promise<void> {
    await this.page.getByRole('combobox', { name: 'First instance theme' }).selectOption(theme);
  }

  async setThemeWithoutMovingFocus(theme: 'light' | 'dark' | 'custom'): Promise<void> {
    await this.page
      .getByRole('combobox', { name: 'Theme', exact: true })
      .evaluate((select, value) => {
        (select as HTMLSelectElement).value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, theme);
  }

  async clearPageTheme(): Promise<void> {
    await this.page.evaluate(() => {
      const style = document.documentElement.style;
      for (const name of Array.from(style))
        if (name.startsWith('--ce-')) style.removeProperty(name);
    });
  }

  private async installClock(): Promise<void> {
    if (this.clockInstalled) return;
    await this.page.clock.install();
    this.clockInstalled = true;
  }
}
