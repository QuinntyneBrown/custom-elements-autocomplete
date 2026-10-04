import { html, render } from 'lit-html';
import type { SearchResultItem } from './types.js';
import { fallbackImage, useFallback } from './image.js';
import styles from './search-result-item-detail.component.styles.js';

export class SearchResultItemDetailComponent extends HTMLElement {
  private item?: SearchResultItem;
  get searchResultItem(): SearchResultItem | undefined {
    return this.item;
  }
  set searchResultItem(value: SearchResultItem | undefined) {
    this.item = value;
    this.update();
  }

  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.update();
  }

  private update(): void {
    if (!this.isConnected || !this.shadowRoot) return;
    const item = this.item;
    render(
      html`
        <style>
          ${styles}
        </style>
        ${
          item
            ? html`
                <img
                  src=${item.image_url || fallbackImage}
                  alt=${item.name}
                  @error=${useFallback}
                />
                <div>
                  <p class="category">${item.primary_category}</p>
                  <h3>${item.name}, ${item.volume_in_milliliters} ml</h3>
                  <p class="price">$${(item.price_in_cents / 100).toFixed(2)}</p>
                  <p>${item.tasting_note}</p>
                </div>
              `
            : ''
        }
      `,
      this.shadowRoot,
    );
  }
}
if (!customElements.get('ce-search-result-item-detail'))
  customElements.define('ce-search-result-item-detail', SearchResultItemDetailComponent);
