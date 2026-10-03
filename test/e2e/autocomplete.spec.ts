// Acceptance tests. Traces to L2-001 through L2-007.
import { test, expect } from '@playwright/test';
import { AutocompletePage } from './pages/autocomplete-page';

test('debounces the latest input at exactly 200ms', async ({ page }) => {
  // L2-002, L2-007
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.freezeTime();
  await demo.first.search('w');
  await demo.elapse(100);
  await demo.first.search('wine');
  await demo.elapse(199);
  await demo.expectRequests([]);
  await demo.elapse(1);
  await demo.expectRequests(['wine']);
  await demo.elapse(50);
  await demo.first.expectProducts(['Red Wine', 'White Wine']);
});

test('paste searches and results expand with correct product details', async ({ page }) => {
  // L2-002, L2-003
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.first.paste(' wine ');
  await demo.first.expectProducts(['Red Wine', 'White Wine']);
  await demo.first.select('Red Wine');
  await demo.first.expectExpanded('Red Wine');
  await expect(demo.first.item('Red Wine')).toContainText('$18.95');
  await expect(demo.first.item('Red Wine')).toContainText('750 ml');
  await expect(demo.first.item('Red Wine')).toContainText('Rich berry notes.');
  await demo.first.select('Red Wine');
  await demo.first.expectExpanded('Red Wine');
  await demo.first.select('White Wine');
  await demo.first.expectExpanded('Red Wine', false);
  await demo.first.expectExpanded('White Wine');
});

test('clearing cancels pending searches and removes results immediately', async ({ page }) => {
  // L2-002
  const demo = new AutocompletePage(page);
  await demo.open('slow');
  await demo.freezeTime();
  await demo.first.search('wine');
  await demo.elapse(200);
  await expect(demo.first.status).toHaveText('Searching…');
  await demo.first.search('   ');
  await demo.first.expectProducts([]);
  await demo.elapse(1000);
  await demo.first.expectProducts([]);
  await demo.expectRequests(['wine']);
});

test('ignores an older response even when the provider ignores cancellation', async ({ page }) => {
  // L2-002
  const demo = new AutocompletePage(page);
  await demo.open('stale');
  await demo.freezeTime();
  await demo.first.search('wine');
  await demo.elapse(200);
  await demo.first.search('beer');
  await demo.elapse(250);
  await demo.first.expectProducts(['Craft Beer']);
  await demo.elapse(1000);
  await demo.first.expectProducts(['Craft Beer']);
});

test('shows empty results and recovers after a failed search', async ({ page }) => {
  // L2-004
  const demo = new AutocompletePage(page);
  await demo.open('empty');
  await demo.first.search('nothing');
  await expect(demo.first.status).toHaveText('No products found.');
  await demo.open('error');
  await demo.first.search('wine');
  await expect(demo.first.status).toHaveText('Search failed. Please try again.');
  await demo.first.search('beer');
  await demo.first.expectProducts(['Craft Beer']);
});

test('reconnects cleanly and keeps instances independent', async ({ page }) => {
  // L2-005
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.first.search('wine');
  await demo.first.expectProducts(['Red Wine', 'White Wine']);
  await demo.second.search('beer');
  await demo.second.expectProducts(['Craft Beer']);
  await demo.disconnect();
  await demo.reconnect();
  await demo.first.search('beer');
  await demo.first.expectProducts(['Craft Beer']);
  await demo.expectRequests(['wine', 'beer']);
  await demo.second.expectProducts(['Craft Beer']);
});

test('disconnecting during a search permits a fresh search after reconnect', async ({ page }) => {
  // L2-005
  const demo = new AutocompletePage(page);
  await demo.open('slow');
  await demo.freezeTime();
  await demo.first.search('wine');
  await demo.elapse(200);
  await demo.disconnect();
  await demo.elapse(1000);
  await demo.reconnect();
  await demo.first.expectProducts([]);
  await demo.first.search('beer');
  await demo.elapse(1200);
  await demo.first.expectProducts(['Craft Beer']);
});

test('labels input and allows keyboard expansion with no overflow', async ({ page }) => {
  // L2-006
  const demo = new AutocompletePage(page);
  await demo.open();
  await demo.first.search('wine');
  await demo.first.expectProducts(['Red Wine', 'White Wine']);
  await demo.first.input.press('Tab');
  await page.keyboard.press('Enter');
  await demo.first.expectExpanded('Red Wine');
  for (const width of [375, 576, 768, 992, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await demo.expectNoOverflow();
  }
});

test('renders markup as text and uses a local image fallback', async ({ page }) => {
  // L2-003, L2-006
  const demo = new AutocompletePage(page);
  await demo.open('unsafe');
  await demo.first.search('wine');
  await demo.first.expectProducts(['<img src=x onerror=alert(1)>']);
  await demo.first.select('<img src=x onerror=alert(1)>');
  const image = demo.first.imageFor('<img src=x onerror=alert(1)>');
  await expect(image).toHaveAttribute('src', /^data:image\/svg\+xml/);
  expect(await demo.first.scriptCount()).toBe(0);
});

test('unconfigured component shows guidance without requests', async ({ page }) => {
  // L2-001
  const demo = new AutocompletePage(page);
  await demo.open('unconfigured');
  await expect(demo.first.status).toHaveText('Configure a search provider to search products.');
  await expect(demo.first.input).toBeDisabled();
  await demo.expectRequests([]);
});
