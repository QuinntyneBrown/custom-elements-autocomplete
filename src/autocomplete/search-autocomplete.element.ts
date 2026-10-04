import { html, render, type TemplateResult } from 'lit-html';
import { fromEvent, debounceTime, tap, type Subscription } from 'rxjs';
import './form-field.component.js';
import type { SearchProvider } from './types.js';
import styles from './search-autocomplete.element.styles.js';

export interface SearchAutocompleteMessages {
  label: string;
  placeholder: string;
  searching: string;
  empty: string;
  failed: string;
  unconfigured: string;
}

export const defaultSearchAutocompleteMessages: SearchAutocompleteMessages = {
  label: 'Search',
  placeholder: 'Type to search',
  searching: 'Searching…',
  empty: 'No results found.',
  failed: 'Search failed. Please try again.',
  unconfigured: 'Configure a search provider to search.',
};

type SearchState = 'idle' | 'searching' | 'empty' | 'failed';

export abstract class SearchAutocompleteElement<T> extends HTMLElement {
  private provider?: SearchProvider<T>;
  private subscription?: Subscription;
  private controller?: AbortController;
  private revision = 0;
  private results: T[] = [];
  private state: SearchState = 'idle';

  get searchProvider(): SearchProvider<T> | undefined {
    return this.provider;
  }
  set searchProvider(value: SearchProvider<T> | undefined) {
    this.invalidate();
    this.provider = value;
    this.results = [];
    this.state = 'idle';
    this.update();
    if (this.isConnected && this.shadowRoot) this.observeInput();
  }

  protected get messages(): SearchAutocompleteMessages {
    return defaultSearchAutocompleteMessages;
  }

  protected abstract renderResults(results: T[]): TemplateResult;

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
          this.state = 'idle';
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
    if (this.state === 'searching') this.state = 'idle';
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
    this.state = 'searching';
    this.update();
    try {
      const results = await this.provider.search(query, controller.signal);
      if (revision !== this.revision || !this.isConnected) return;
      this.results = results;
      this.state = results.length ? 'idle' : 'empty';
    } catch {
      if (revision !== this.revision || !this.isConnected) return;
      this.results = [];
      this.state = 'failed';
    } finally {
      if (revision === this.revision && this.isConnected) {
        this.controller = undefined;
        this.update();
      }
    }
  }

  private update(): void {
    if (!this.isConnected || !this.shadowRoot) return;
    const status =
      this.state === 'idle'
        ? ''
        : this.state === 'searching'
          ? this.messages.searching
          : this.state === 'empty'
            ? this.messages.empty
            : this.messages.failed;
    render(
      html`
        <style>
          ${styles}
        </style>
        <label for="query">${this.messages.label}</label>
        <ce-form-field>
          <input
            id="query"
            type="search"
            role="textbox"
            placeholder=${this.messages.placeholder}
            autocomplete="off"
            ?disabled=${!this.provider}
          />
        </ce-form-field>
        <p role="status" aria-live="polite">
          ${this.provider ? status : this.messages.unconfigured}
        </p>
        ${this.renderResults(this.results)}
      `,
      this.shadowRoot,
    );
  }
}
