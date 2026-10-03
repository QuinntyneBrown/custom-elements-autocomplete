import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { html, type TemplateResult } from 'lit-html';
import {
  SearchAutocompleteElement,
  defaultSearchAutocompleteMessages,
  type SearchProvider,
} from '../../src/autocomplete/index.js';

interface Article {
  slug: string;
  title: string;
}

class ArticleAutocomplete extends SearchAutocompleteElement<Article> {
  protected override get messages() {
    return { ...defaultSearchAutocompleteMessages, label: 'Search articles' };
  }

  protected override renderResults(results: Article[]): TemplateResult {
    return html`<ul>
      ${results.map((article) => html`<li data-slug=${article.slug}>${article.title}</li>`)}
    </ul>`;
  }
}

if (!customElements.get('test-article-autocomplete')) {
  customElements.define('test-article-autocomplete', ArticleAutocomplete);
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  document.body.replaceChildren();
  jest.useRealTimers();
});

describe('generic autocomplete primitive', () => {
  test('uses a domain-specific provider and renderer without product components', async () => {
    const article: Article = { slug: 'search-design', title: 'Search design' };
    const provider: SearchProvider<Article> = {
      search: jest.fn<SearchProvider<Article>['search']>().mockResolvedValue([article]),
    };
    const element = document.createElement('test-article-autocomplete') as ArticleAutocomplete;
    element.searchProvider = provider;
    document.body.append(element);

    const input = element.shadowRoot!.querySelector('input')!;
    expect(input.labels?.[0].textContent).toBe('Search articles');
    input.value = 'search';
    input.dispatchEvent(new Event('input'));
    await jest.advanceTimersByTimeAsync(200);

    expect(provider.search).toHaveBeenCalledWith('search', expect.any(AbortSignal));
    expect(element.shadowRoot!.querySelector('[data-slug="search-design"]')?.textContent).toBe(
      'Search design',
    );
    expect(element.shadowRoot!.querySelector('ce-search-result-items')).toBeNull();
  });
});
