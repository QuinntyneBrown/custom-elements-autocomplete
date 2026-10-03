import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { createFixtureProvider } from '../../src/components-examples/fixture-search-provider.js';

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

test('local product searches are case insensitive and complete after the configured delay', async () => {
  const result = createFixtureProvider().search('WINE');
  await jest.advanceTimersByTimeAsync(50);
  expect((await result).map((item) => item.name)).toEqual(['Red Wine', 'White Wine']);
});

test('fixture requests honor abort signals', async () => {
  const controller = new AbortController();
  const result = createFixtureProvider('slow').search('wine', controller.signal);
  const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' });
  controller.abort();
  await assertion;
  expect(jest.getTimerCount()).toBe(0);
});

test('already-aborted fixture requests reject immediately', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(createFixtureProvider().search('wine', controller.signal)).rejects.toMatchObject({
    name: 'AbortError',
  });
  expect(jest.getTimerCount()).toBe(0);
});
