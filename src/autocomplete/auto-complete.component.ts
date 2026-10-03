import { html, render } from 'lit-html';
import { fromEvent, debounceTime, tap, type Subscription } from 'rxjs';
import './form-field.component.js';
import './search-result-items.component.js';
import type { ProductSearchProvider, SearchResultItem } from './types.js';
import styles from './auto-complete.component.css?inline';

export class AutoCompleteComponent extends HTMLElement {
  private provider?: ProductSearchProvider;
  private subscription?: Subscription;
  private controller?: AbortController;
  private revision = 0;
  private results: SearchResultItem[] = [];
  private status = '';

  get searchProvider(): ProductSearchProvider | undefined {
    return this.provider;
  }
  set searchProvider(value: ProductSearchProvider | undefined) {
    this.invalidate();
    this.provider = value;
    this.results = [];
    this.status = '';
    this.update();
    if (this.isConnected && this.shadowRoot) this.observeInput();
  }

  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.update();
    this.observeInput();
  }

  private observeInput(): void {
    this.subscription?.unsubscribe();
    const input = this.shadowRoot!.querySelector('input')!;
    this.subscription = fromEvent(input, 'input')
      .pipe(
        tap(() => {
          this.invalidate();
          this.results = [];
          this.status = '';
          this.update();
        }),
        debounceTime(200),
      )
      .subscribe(() => {
        void this.search(input.value.trim());
      });
  }

  disconnectedCallback(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.invalidate();
    if (this.status === 'Searching…') this.status = '';
  }

  private invalidate(): void {
    this.revision++;
    this.controller?.abort();
    this.controller = undefined;
  }

  private async search(query: string): Promise<void> {
    if (!query || !this.provider || !this.isConnected) return;
    const revision = this.revision;
    const controller = new AbortController();
    this.controller = controller;
    this.status = 'Searching…';
    this.update();
    try {
      const results = await this.provider.search(query, controller.signal);
      if (revision !== this.revision || !this.isConnected) return;
      this.results = results;
      this.status = results.length ? '' : 'No products found.';
    } catch {
      if (revision !== this.revision || !this.isConnected) return;
      this.results = [];
      this.status = 'Search failed. Please try again.';
    } finally {
      if (revision === this.revision && this.isConnected) {
        this.controller = undefined;
        this.update();
      }
    }
  }

  private update(): void {
    if (!this.isConnected || !this.shadowRoot) return;
    render(
      html`
        <style>
          ${styles}
        </style>
        <label for="query">Search products</label>
        <ce-form-field>
          <input
            id="query"
            type="search"
            role="textbox"
            placeholder="Try wine or beer"
            autocomplete="off"
            ?disabled=${!this.provider}
          />
        </ce-form-field>
        <p role="status" aria-live="polite">
          ${this.provider ? this.status : 'Configure a search provider to search products.'}
        </p>
        <ce-search-result-items .searchResultItems=${this.results}></ce-search-result-items>
      `,
      this.shadowRoot,
    );
  }
}
if (!customElements.get('ce-auto-complete'))
  customElements.define('ce-auto-complete', AutoCompleteComponent);
