import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { AutoCompleteComponent, type ProductSearchProvider } from '../../src/index.js';
import { product } from '../fixtures/products.js';

function create(provider?: ProductSearchProvider): AutoCompleteComponent {
  const element = document.createElement('ce-auto-complete') as AutoCompleteComponent;
  element.searchProvider = provider;
  document.body.append(element);
  return element;
}
function input(element: AutoCompleteComponent, value: string): void {
  const field = element.shadowRoot!.querySelector('input')!;
  field.value = value;
  field.dispatchEvent(new Event('input'));
}
function status(element: AutoCompleteComponent): string {
  return element.shadowRoot!.querySelector('[role="status"]')!.textContent!.trim();
}
function itemCount(element: AutoCompleteComponent): number {
  return element
    .shadowRoot!.querySelector('ce-search-result-items')!
    .shadowRoot!.querySelectorAll('ce-search-result-item').length;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  document.body.replaceChildren();
  jest.useRealTimers();
});

describe('search input and request states', () => {
  test('debounces at 200ms and trims the latest input', async () => {
    const search = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([product]);
    const element = create({ search });
    input(element, 'w');
    await jest.advanceTimersByTimeAsync(100);
    input(element, ' wine ');
    await jest.advanceTimersByTimeAsync(199);
    expect(search).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(1);
    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0][0]).toBe('wine');
    expect(search.mock.calls[0][1]).toBeInstanceOf(AbortSignal);
    expect(itemCount(element)).toBe(1);
  });

  test('blank input immediately clears results without searching', async () => {
    const search = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([product]);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    input(element, '  ');
    expect(itemCount(element)).toBe(0);
    expect(status(element)).toBe('');
    await jest.advanceTimersByTimeAsync(200);
    expect(search).toHaveBeenCalledTimes(1);
  });

  test('clearing before debounce prevents the pending search', async () => {
    const search = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([]);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(199);
    input(element, '');
    await jest.advanceTimersByTimeAsync(1000);
    expect(search).not.toHaveBeenCalled();
  });

  test('shows loading, then empty results', async () => {
    const pending = deferred<[]>();
    const element = create({ search: () => pending.promise });
    input(element, 'unknown');
    await jest.advanceTimersByTimeAsync(200);
    expect(status(element)).toBe('Searching…');
    pending.resolve([]);
    await jest.advanceTimersByTimeAsync(0);
    expect(status(element)).toBe('No products found.');
  });

  test('a rejected request does not prevent the next search', async () => {
    const search = jest
      .fn<ProductSearchProvider['search']>()
      .mockRejectedValueOnce(new Error('failure'))
      .mockResolvedValue([product]);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    expect(status(element)).toBe('Search failed. Please try again.');
    input(element, 'beer');
    await jest.advanceTimersByTimeAsync(200);
    expect(itemCount(element)).toBe(1);
    expect(status(element)).toBe('');
  });

  test('handles a provider that throws synchronously', async () => {
    const element = create({
      search: () => {
        throw new Error('failure');
      },
    });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    expect(status(element)).toBe('Search failed. Please try again.');
  });

  test('shows configuration guidance and makes no unconfigured request', async () => {
    const element = create();
    expect(status(element)).toBe('Configure a search provider to search products.');
    expect(element.shadowRoot!.querySelector('input')!.disabled).toBe(true);
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    expect(itemCount(element)).toBe(0);
  });
});

describe('cancellation and stale responses', () => {
  test('changing providers cancels a scheduled debounce without starting another search', async () => {
    const old = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([product]);
    const next = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([]);
    const element = create({ search: old });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(100);
    element.searchProvider = { search: next };
    await jest.advanceTimersByTimeAsync(500);
    expect(old).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    input(element, 'beer');
    await jest.advanceTimersByTimeAsync(200);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('query changes abort immediately, before the next debounce finishes', async () => {
    const pending = deferred<(typeof product)[]>();
    const search = jest.fn<ProductSearchProvider['search']>().mockReturnValue(pending.promise);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    const signal = search.mock.calls[0][1]!;
    input(element, 'beer');
    expect(signal.aborted).toBe(true);
    pending.resolve([product]);
    await jest.advanceTimersByTimeAsync(0);
    expect(itemCount(element)).toBe(0);
  });

  test('late old results never replace a newer response', async () => {
    const old = deferred<(typeof product)[]>();
    const search = jest
      .fn<ProductSearchProvider['search']>()
      .mockReturnValueOnce(old.promise)
      .mockResolvedValue([]);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    input(element, 'beer');
    await jest.advanceTimersByTimeAsync(200);
    old.resolve([product]);
    await jest.advanceTimersByTimeAsync(0);
    expect(itemCount(element)).toBe(0);
    expect(status(element)).toBe('No products found.');
  });

  test('an old rejection does not replace a newer success with an error', async () => {
    const old = deferred<(typeof product)[]>();
    const search = jest
      .fn<ProductSearchProvider['search']>()
      .mockReturnValueOnce(old.promise)
      .mockResolvedValue([product]);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    input(element, 'beer');
    await jest.advanceTimersByTimeAsync(200);
    old.reject(new Error('late failure'));
    await jest.advanceTimersByTimeAsync(0);
    expect(itemCount(element)).toBe(1);
    expect(status(element)).toBe('');
  });

  test('changing providers invalidates an in-flight request', async () => {
    const pending = deferred<(typeof product)[]>();
    const old = jest.fn<ProductSearchProvider['search']>().mockReturnValue(pending.promise);
    const element = create({ search: old });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    const search = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([]);
    element.searchProvider = { search };
    expect(old.mock.calls[0][1]!.aborted).toBe(true);
    pending.resolve([product]);
    await jest.advanceTimersByTimeAsync(0);
    expect(itemCount(element)).toBe(0);
    input(element, 'beer');
    await jest.advanceTimersByTimeAsync(200);
    expect(search).toHaveBeenCalledTimes(1);
  });
});

describe('connection lifecycle', () => {
  test('disconnecting before debounce prevents provider calls', async () => {
    const search = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([]);
    const element = create({ search });
    input(element, 'wine');
    element.remove();
    await jest.advanceTimersByTimeAsync(1000);
    input(element, 'beer');
    await jest.advanceTimersByTimeAsync(1000);
    expect(search).not.toHaveBeenCalled();
  });

  test('disconnect aborts pending work and ignores detached responses', async () => {
    const pending = deferred<(typeof product)[]>();
    const search = jest.fn<ProductSearchProvider['search']>().mockReturnValue(pending.promise);
    const element = create({ search });
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    element.remove();
    expect(search.mock.calls[0][1]!.aborted).toBe(true);
    pending.resolve([product]);
    await jest.advanceTimersByTimeAsync(0);
    expect(itemCount(element)).toBe(0);
    document.body.append(element);
    expect(status(element)).toBe('');
  });

  test('reconnection keeps the shadow root and creates only one subscription', async () => {
    const search = jest.fn<ProductSearchProvider['search']>().mockResolvedValue([product]);
    const element = create({ search });
    const root = element.shadowRoot;
    for (let i = 0; i < 3; i++) {
      element.remove();
      document.body.append(element);
    }
    input(element, 'wine');
    await jest.advanceTimersByTimeAsync(200);
    expect(element.shadowRoot).toBe(root);
    expect(search).toHaveBeenCalledTimes(1);
    expect(itemCount(element)).toBe(1);
  });

  test('instances keep their results independent', async () => {
    const first = create({ search: async () => [product] });
    const second = create({ search: async () => [] });
    input(first, 'wine');
    input(second, 'beer');
    await jest.advanceTimersByTimeAsync(200);
    expect(itemCount(first)).toBe(1);
    expect(itemCount(second)).toBe(0);
  });
});
