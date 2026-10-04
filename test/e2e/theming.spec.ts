// Traces to: L2-008, L2-009, L2-010, L2-011
import { expect, test } from '@playwright/test';
import { AutocompletePage } from './pages/autocomplete-page';

test('themes inherit through shadow roots and instance reset restores the page theme', async ({
  page,
}) => {
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.first.search('wine');
  await demo.first.select('Red Wine');
  await demo.clearPageTheme();
  await demo.first.expectAppearance('rgb(255, 255, 255)', 'rgb(23, 43, 58)', 'rgb(23, 109, 145)');
  await demo.setTheme('dark');
  await demo.first.expectHover('rgb(32, 58, 73)');
  await demo.first.expectDetailColors('rgb(232, 240, 245)', 'rgb(155, 205, 229)');
  await demo.first.expectStatusColor('rgb(179, 199, 212)');
  await demo.first.expectAppearance('rgb(21, 35, 46)', 'rgb(232, 240, 245)', 'rgb(100, 181, 218)');
  await demo.second.expectAppearance('rgb(21, 35, 46)', 'rgb(232, 240, 245)', 'rgb(100, 181, 218)');
  await demo.setInstanceTheme('light');
  await demo.first.expectAppearance('rgb(255, 255, 255)', 'rgb(23, 43, 58)', 'rgb(23, 109, 145)');
  await demo.second.expectAppearance('rgb(21, 35, 46)', 'rgb(232, 240, 245)', 'rgb(100, 181, 218)');
  await demo.setInstanceTheme('inherit');
  await demo.first.expectAppearance('rgb(21, 35, 46)', 'rgb(232, 240, 245)', 'rgb(100, 181, 218)');
  await demo.setTheme('custom');
  await demo.first.expectHover('rgb(237, 245, 248)');
  await demo.first.expectDetailColors('rgb(23, 43, 58)', 'rgb(102, 51, 153)');
  await demo.first.expectAppearance('rgb(255, 255, 255)', 'rgb(23, 43, 58)', 'rgb(102, 51, 153)');
  await demo.first.expectExpanded('Red Wine');
});

test('container CSS overrides control spacing, typography and radius', async ({ page }) => {
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.overrideContainerTokens({
    spacingHorizontalM: '2rem',
    borderRadiusMedium: '1rem',
    fontSizeBase200: '1.1rem',
  });
  await demo.first.expectCustomDimensions();
  await demo.second.expectAppearance('rgb(255, 255, 255)', 'rgb(23, 43, 58)', 'rgb(23, 109, 145)');
});

test('interactive dev demo exposes working theme controls', async ({ page }) => {
  const demo = new AutocompletePage(page);
  await demo.openDemo();
  await demo.first.search('wine');
  await demo.first.select('Red Wine');
  await demo.setTheme('dark');
  await demo.first.expectAppearance('rgb(21, 35, 46)', 'rgb(232, 240, 245)', 'rgb(100, 181, 218)');
  await demo.setInstanceTheme('custom');
  await demo.first.expectAppearance('rgb(255, 255, 255)', 'rgb(23, 43, 58)', 'rgb(102, 51, 153)');
  await demo.first.expectExpanded('Red Wine');
});

test('live CSS changes preserve focus, identity, results, selection and request count', async ({
  page,
}) => {
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.first.search('wine');
  await demo.first.select('Red Wine');
  const identity = await demo.first.captureIdentity();
  await demo.first.focusInput();
  await demo.setThemeWithoutMovingFocus('dark');
  await demo.first.expectQueryAndFocus('wine');
  await demo.first.expectIdentity(identity);
  await demo.first.expectProducts(['Red Wine', 'White Wine']);
  await demo.first.expectExpanded('Red Wine');
  await demo.expectRequests(['wine']);
  await identity.dispose();
});

test('theme switching leaves pending search and reconnection usable', async ({ page }) => {
  const demo = new AutocompletePage(page);
  await demo.open('slow');
  await demo.freezeTime();
  await demo.first.search('wine');
  await demo.elapse(200);
  await expect(demo.first.status).toHaveText('Searching…');
  await demo.setTheme('dark');
  await demo.elapse(1000);
  await demo.first.expectProducts(['Red Wine', 'White Wine']);
  const identity = await demo.first.captureIdentity();
  await demo.disconnect();
  await demo.setTheme('custom');
  await demo.reconnect();
  await demo.first.expectIdentity(identity);
  await demo.first.expectAppearance('rgb(255, 255, 255)', 'rgb(23, 43, 58)', 'rgb(102, 51, 153)');
  await demo.expectRequests(['wine']);
  await identity.dispose();
});

test('themes remain responsive at all supported widths', async ({ page }) => {
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.first.search('wine');
  await demo.first.select('Red Wine');
  for (const width of [375, 576, 768, 992, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark', 'custom'] as const) {
      await demo.setTheme(theme);
      await demo.first.expectExpanded('Red Wine');
      await demo.expectNoOverflow();
    }
  }
});
