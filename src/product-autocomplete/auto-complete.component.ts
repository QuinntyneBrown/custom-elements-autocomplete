import { html, type TemplateResult } from 'lit-html';
import { SearchAutocompleteElement } from '../autocomplete/search-autocomplete.element.js';
import type { SearchAutocompleteMessages } from '../autocomplete/search-autocomplete.element.js';
import './search-result-items.component.js';
import type { SearchResultItem } from './types.js';

export class AutoCompleteComponent extends SearchAutocompleteElement<SearchResultItem> {
  protected override get messages(): SearchAutocompleteMessages {
    return {
      label: 'Search products',
      placeholder: 'Try wine or beer',
      searching: 'Searching…',
      empty: 'No products found.',
      failed: 'Search failed. Please try again.',
      unconfigured: 'Configure a search provider to search products.',
    };
  }

  protected override renderResults(results: SearchResultItem[]): TemplateResult {
    return html`<ce-search-result-items .searchResultItems=${results}></ce-search-result-items>`;
  }
}
if (!customElements.get('ce-auto-complete'))
  customElements.define('ce-auto-complete', AutoCompleteComponent);
