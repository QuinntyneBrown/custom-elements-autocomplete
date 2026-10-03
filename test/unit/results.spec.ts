import { afterEach, expect, test } from '@jest/globals';
import {
  SearchResultItemsComponent,
  SearchResultItemComponent,
  SearchResultItemDetailComponent,
} from '../../src/index.js';
import { fallbackImage } from '../../src/product-autocomplete/image.js';
import { product } from '../fixtures/products.js';

afterEach(() => document.body.replaceChildren());

function list(): SearchResultItemsComponent {
  const element = document.createElement('ce-search-result-items') as SearchResultItemsComponent;
  element.searchResultItems = [product, { ...product, id: 2, name: 'Second wine' }];
  document.body.append(element);
  return element;
}
function items(element: SearchResultItemsComponent): SearchResultItemComponent[] {
  return Array.from(
    element.shadowRoot!.querySelectorAll<SearchResultItemComponent>('ce-search-result-item'),
  );
}
function click(item: SearchResultItemComponent): void {
  item.shadowRoot!.querySelector('button')!.click();
}

test('selection stays expanded and switches to another item', () => {
  const element = list();
  const [first, second] = items(element);
  click(first);
  click(first);
  expect(first.isActive).toBe(true);
  expect(first.shadowRoot!.querySelector('button')!.getAttribute('aria-expanded')).toBe('true');
  click(second);
  expect(first.isActive).toBe(false);
  expect(second.isActive).toBe(true);
  expect(
    first.shadowRoot!.querySelector('ce-search-result-item-detail')!.hasAttribute('hidden'),
  ).toBe(true);
});

test('same-ID data updates render without replacing the result element', () => {
  const element = list();
  const first = items(element)[0];
  click(first);
  element.searchResultItems = [{ ...product, name: 'Updated', price_in_cents: 99 }];
  expect(items(element)[0]).toBe(first);
  expect(first.shadowRoot!.querySelector('button')!.textContent).toContain('Updated');
  const detail = first.shadowRoot!.querySelector('ce-search-result-item-detail')!;
  expect(detail.shadowRoot!.textContent).toContain('$0.99');
  expect(first.isActive).toBe(true);
});

test('removed selections do not reactivate when the same ID returns', () => {
  const element = list();
  click(items(element)[0]);
  element.searchResultItems = [];
  element.searchResultItems = [product];
  expect(items(element)[0].isActive).toBe(false);
});

test('details render category, price, volume, and notes', () => {
  const element = document.createElement(
    'ce-search-result-item-detail',
  ) as SearchResultItemDetailComponent;
  element.searchResultItem = product;
  document.body.append(element);
  expect(element.shadowRoot!.textContent).toContain('Wine');
  expect(element.shadowRoot!.textContent).toContain('$18.95');
  expect(element.shadowRoot!.textContent).toContain('750 ml');
  expect(element.shadowRoot!.textContent).toContain('Rich berry notes.');
  expect(element.shadowRoot!.querySelector('img')!.alt).toBe(product.name);
});

test('missing and broken images use the built-in fallback', () => {
  const element = list();
  const first = items(element)[0];
  const thumbnail = first.shadowRoot!.querySelector('img')!;
  expect(thumbnail.src).toBe(fallbackImage);
  first.searchResultItem = { ...product, image_thumb_url: 'https://invalid.example/broken.png' };
  thumbnail.dispatchEvent(new Event('error'));
  expect(thumbnail.src).toBe(fallbackImage);
  thumbnail.dispatchEvent(new Event('error'));
  expect(thumbnail.src).toBe(fallbackImage);
});

test('product markup is text and cannot create active HTML', () => {
  const element = list();
  element.searchResultItems = [{ ...product, name: '<script>alert(1)</script>' }];
  const first = items(element)[0];
  expect(first.shadowRoot!.querySelector('button')!.textContent).toContain(
    '<script>alert(1)</script>',
  );
  expect(first.shadowRoot!.querySelector('script')).toBeNull();
});

test('all supporting elements reconnect using their existing shadow roots', () => {
  for (const tag of [
    'ce-form-field',
    'ce-header',
    'ce-search-result-item',
    'ce-search-result-item-detail',
    'ce-search-result-items',
  ]) {
    const element = document.createElement(tag);
    document.body.append(element);
    const root = element.shadowRoot;
    element.remove();
    document.body.append(element);
    expect(element.shadowRoot).toBe(root);
  }
});

test('empty result components render safely before data arrives', () => {
  for (const tag of ['ce-search-result-item', 'ce-search-result-item-detail']) {
    const element = document.createElement(tag);
    document.body.append(element);
    expect(element.shadowRoot!.querySelector('img')).toBeNull();
  }
});
