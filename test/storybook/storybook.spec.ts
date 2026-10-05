import { test, expect } from '@playwright/test';
import { StorybookPage } from '../e2e/pages/storybook-page.js';

test('[L2-012, L2-013, L2-014] static documentation and manifest controls', async ({
  page,
  request,
}) => {
  const index = await (await request.get('/index.json')).json();
  const entries = Object.values(index.entries) as { id: string; type: string; title: string }[];
  expect(
    entries.filter((entry) => entry.type === 'docs' && entry.title.startsWith('Components/')),
  ).toHaveLength(6);
  expect(entries.some((entry) => entry.title === 'Concepts/Developer/Generic Providers')).toBe(
    true,
  );
  expect(entries.some((entry) => entry.title.startsWith('Theme/'))).toBe(true);
  const storybook = new StorybookPage(page);
  await storybook.openDocs();
  await storybook.assertApi();
  await storybook.assertSource();
});

test('[L2-014] all six default component stories render', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const storybook = new StorybookPage(page);
  for (const [name, tag] of [
    ['auto-complete', 'ce-auto-complete'],
    ['form-field', 'ce-form-field'],
    ['header', 'ce-header'],
    ['search-result-item', 'ce-search-result-item'],
    ['search-result-item-detail', 'ce-search-result-item-detail'],
    ['search-result-items', 'ce-search-result-items'],
  ]) {
    await storybook.openStory(`components-${name}--default`);
    await storybook.assertComponent(tag);
  }
  expect(errors).toEqual([]);
});

test('[L2-014] local search, expansion, and failure recovery', async ({ page }) => {
  const storybook = new StorybookPage(page);
  await storybook.openStory();
  await page.clock.install();
  await storybook.search('wine');
  await page.clock.runFor(300);
  await storybook.expand();
  await storybook.openStory('components-auto-complete--failure-and-recovery');
  await storybook.assertStatus('Search failed. Please try again.');
  await storybook.search('beer');
  await page.clock.runFor(300);
  await storybook.assertProduct('Craft Beer');
});

test('[L2-014] loading, empty, unconfigured, and independent stories', async ({ page }) => {
  const storybook = new StorybookPage(page);
  await storybook.openStory('components-auto-complete--loading');
  await expect(page.getByText('Searching…')).toBeVisible();
  await storybook.openStory('components-auto-complete--empty');
  await storybook.assertStatus('No products found.');
  await storybook.openStory('components-auto-complete--unconfigured');
  await storybook.assertUnconfigured();
  await storybook.openStory('components-auto-complete--independent-instances');
  await storybook.search('wine');
  await storybook.assertProduct('Red Wine');
  await storybook.assertSecondQueryEmpty();
});

test('[L2-015] scoped themes, direction, responsive previews and local assets', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      external.push(request.url());
  });
  const storybook = new StorybookPage(page);
  for (const theme of ['light', 'dark', 'custom']) {
    await storybook.openStory('components-auto-complete--default', `theme:${theme};dir:rtl`);
    await storybook.assertTheme(theme, 'rtl');
  }
  for (const width of [375, 576, 768, 992, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await storybook.search('wine');
    await storybook.expand();
    await storybook.assertNoOverflow();
  }
  expect(external).toEqual([]);
});

test('[L2-014, L2-015] live generic providers and independent scopes', async ({ page }) => {
  const storybook = new StorybookPage(page);
  await storybook.openStory('concepts-developer-generic-search--default');
  await storybook.assertGeneric();
  await storybook.openStory('theme-independent-scopes--default');
  await storybook.assertScopes();
});

test('[L2-015] documentation toolbar changes previews while the shell stays light', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'The collapsed mobile manager toolbar is covered by scoped mobile preview checks.',
  );
  const storybook = new StorybookPage(page);
  await storybook.openDocs();
  await storybook.selectToolbar('Dark', 'RTL');
  await storybook.selectToolbar('Light', 'LTR');
});
