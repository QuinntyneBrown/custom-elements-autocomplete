import type { ProductSearchProvider, SearchResultItem } from '../product-autocomplete/index.js';
import { products } from './products.js';

export type FixtureScenario = 'normal' | 'empty' | 'error' | 'slow' | 'stale' | 'unsafe';
export const fixtureScenarios: FixtureScenario[] = [
  'normal',
  'empty',
  'error',
  'slow',
  'stale',
  'unsafe',
];

/** Deterministic demo data; scenarios never alter production component behavior. */
export function createFixtureProvider(
  scenario: FixtureScenario = 'normal',
  onRequest?: (query: string) => void,
): ProductSearchProvider {
  return {
    search(query: string, signal?: AbortSignal): Promise<SearchResultItem[]> {
      onRequest?.(query);
      const delay = scenario === 'slow' || (scenario === 'stale' && query === 'wine') ? 1000 : 50;
      return new Promise((resolve, reject) => {
        const abort = (): void => {
          clearTimeout(timer);
          signal?.removeEventListener('abort', abort);
          reject(new DOMException('Search canceled', 'AbortError'));
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener('abort', abort);
          if (scenario === 'error' && query.toLowerCase().includes('wine')) {
            reject(new Error('Simulated provider failure'));
          } else if (scenario === 'empty') {
            resolve([]);
          } else if (scenario === 'unsafe') {
            resolve([
              {
                ...products[0],
                name: '<img src=x onerror=alert(1)>',
                image_url: null,
                image_thumb_url: null,
              },
            ]);
          } else {
            resolve(
              products
                .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
                .map((product) => ({ ...product })),
            );
          }
        }, delay);
        if (scenario !== 'stale') {
          if (signal?.aborted) abort();
          else signal?.addEventListener('abort', abort, { once: true });
        }
      });
    },
  };
}
