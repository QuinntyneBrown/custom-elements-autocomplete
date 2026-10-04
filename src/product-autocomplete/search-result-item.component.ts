import { html, render } from 'lit-html';
import './search-result-item-detail.component.js';
import type { SearchResultItem } from './types.js';
import { fallbackImage, useFallback } from './image.js';
import styles from './search-result-item.component.styles.js';

export class SearchResultItemComponent extends HTMLElement {
  private item?: SearchResultItem;
  private active = false;
  get searchResultItem(): SearchResultItem | undefined {
    return this.item;
  }
  set searchResultItem(value: SearchResultItem | undefined) {
    this.item = value;
    this.update();
  }
  get isActive(): boolean {
    return this.active;
  }
  set isActive(value: boolean) {
    this.active = value;
    this.classList.toggle('active', value);
    this.update();
  }

  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.update();
  }

  private select = (): void => {
    if (this.item)
      this.dispatchEvent(
        new CustomEvent('product-select', {
          detail: this.item.id,
          bubbles: true,
          composed: true,
        }),
      );
  };

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
                <button
                  type="button"
                  aria-expanded=${String(this.active)}
                  aria-controls="details"
                  @click=${this.select}
                >
                  <img src=${item.image_thumb_url || fallbackImage} alt="" @error=${useFallback} />
                  <span>${item.name}</span>
                </button>
                <ce-search-result-item-detail
                  id="details"
                  ?hidden=${!this.active}
                  .searchResultItem=${item}
                ></ce-search-result-item-detail>
              `
            : ''
        }
      `,
      this.shadowRoot,
    );
  }
}
if (!customElements.get('ce-search-result-item'))
  customElements.define('ce-search-result-item', SearchResultItemComponent);
