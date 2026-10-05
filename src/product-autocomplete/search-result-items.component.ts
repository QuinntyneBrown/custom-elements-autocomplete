import { html, render } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import './search-result-item.component.js';
import type { SearchResultItem } from './types.js';

export class SearchResultItemsComponent extends HTMLElement {
  private items: SearchResultItem[] = [];
  private selectedId?: number;
  get searchResultItems(): SearchResultItem[] {
    return this.items;
  }
  set searchResultItems(value: SearchResultItem[]) {
    this.items = value;
    if (!value.some((item) => item.id === this.selectedId)) this.selectedId = undefined;
    this.update();
  }
  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.update();
  }
  /** Expand the result identified by a product-select event. */
  public showSearchResultItemDetail: (event: Event) => void = (event) => {
    this.selectedId = (event as CustomEvent<number>).detail;
    this.update();
  };
  private update(): void {
    if (!this.isConnected || !this.shadowRoot) return;
    render(
      html`
        <style>
          :host {
            display: block;
          }
        </style>
        ${repeat(
          this.items,
          (item) => item.id,
          (item) => html`
            <ce-search-result-item
              .searchResultItem=${item}
              .isActive=${item.id === this.selectedId}
              @product-select=${this.showSearchResultItemDetail}
            ></ce-search-result-item>
          `,
        )}
      `,
      this.shadowRoot,
    );
  }
}
if (!customElements.get('ce-search-result-items'))
  customElements.define('ce-search-result-items', SearchResultItemsComponent);
