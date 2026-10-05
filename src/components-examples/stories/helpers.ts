import { render, type TemplateResult } from 'lit-html';
import { applyStoryArgs } from '../../../.storybook/api.js';
import { createAutocompleteExample } from '../autocomplete-example.js';
import { createFixtureProvider, type FixtureScenario } from '../fixture-search-provider.js';
import type {
  AutoCompleteComponent,
  ProductSearchProvider,
} from '../../product-autocomplete/index.js';

export type StoryArgs = Record<string, unknown>;

class StoryPreview extends HTMLElement {
  onReady?: () => void;
  private initialized = false;
  connectedCallback(): void {
    if (!this.initialized) {
      this.initialized = true;
      queueMicrotask(() => {
        if (this.isConnected) this.onReady?.();
      });
    }
  }
}
if (!customElements.get('ce-story-preview'))
  customElements.define('ce-story-preview', StoryPreview);

export function renderComponent(template: TemplateResult, args: StoryArgs): HTMLElement {
  const wrapper = document.createElement('ce-story-preview') as StoryPreview;
  render(template, wrapper);
  const component = wrapper.firstElementChild as HTMLElement;
  if (component) applyStoryArgs(component, args);
  return wrapper;
}

const loadingProvider: ProductSearchProvider = {
  search(_query, signal) {
    return new Promise((_resolve, reject) => {
      const abort = (): void => reject(new DOMException('Search canceled', 'AbortError'));
      if (signal?.aborted) abort();
      else signal?.addEventListener('abort', abort, { once: true });
    });
  },
};

export function renderAutocomplete(args: StoryArgs): HTMLElement {
  const scenario = String(args.scenario ?? 'normal');
  const provider =
    scenario === 'unconfigured'
      ? undefined
      : scenario === 'loading'
        ? loadingProvider
        : createFixtureProvider(scenario as FixtureScenario);
  const wrapper = document.createElement('ce-story-preview') as StoryPreview;
  const component = createAutocompleteExample(provider);
  applyStoryArgs(component, args);
  wrapper.append(component);
  if (args.query) wrapper.onReady = () => seedQuery(component, String(args.query));
  return wrapper;
}

export function seedQuery(component: AutoCompleteComponent, query: string): void {
  const input = component.shadowRoot!.querySelector('input')!;
  input.value = query;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export const providerSource = `import { AutoCompleteComponent } from 'custom-elements-autocomplete/product-autocomplete';
const products = [{ id: 1, name: 'Red Wine', image_thumb_url: null, image_url: null, price_in_cents: 1895, primary_category: 'Wine', tasting_note: 'Rich berry notes.', volume_in_milliliters: '750' }];
const autocomplete = document.createElement('ce-auto-complete') as AutoCompleteComponent;
autocomplete.searchProvider = {
  async search(query, signal) {
    signal?.throwIfAborted();
    return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
  },
};
document.body.append(autocomplete);`;

export function componentSource(
  tag: string,
  className: string,
  property: string,
  value: unknown,
): string {
  return `import { ${className} } from 'custom-elements-autocomplete/product-autocomplete';
const element = document.createElement('${tag}') as ${className};
element.${property} = ${JSON.stringify(value)};
document.body.append(element);`;
}
