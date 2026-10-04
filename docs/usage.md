# Component integration guide

This guide describes the current public interface and how to supply product data to the autocomplete component. For installation and development commands, see the [README](../README.md).

## Import and registration

The root source entry point `src/index.ts` is a compatibility barrel that exports both generic
primitives and product-specific components. Importing the product entry registers the product
elements in the current browser's custom element registry.

| Entry point                         | Purpose                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/autocomplete/index.ts`         | Generic `SearchAutocompleteElement<T>`, `SearchProvider<T>`, messages, form-field, and header primitives. |
| `src/product-autocomplete/index.ts` | Product-specific `ce-auto-complete`, result components, and product types.                                |
| `src/index.ts`                      | Compatibility entry that re-exports the generic and product APIs.                                         |

The built package exposes these as `custom-elements-autocomplete/autocomplete` and
`custom-elements-autocomplete/product-autocomplete`; the package root remains a compatibility
entry exporting both.

The product entry registers these elements:

| Element                        | Exported class                    | Purpose                                                  |
| ------------------------------ | --------------------------------- | -------------------------------------------------------- |
| `ce-auto-complete`             | `AutoCompleteComponent`           | Product-configured input, search lifecycle, and results. |
| `ce-form-field`                | `FormFieldComponent`              | Generic form-field container.                            |
| `ce-search-result-items`       | `SearchResultItemsComponent`      | Product result collection and selection state.           |
| `ce-search-result-item`        | `SearchResultItemComponent`       | Product result button and expandable details.            |
| `ce-search-result-item-detail` | `SearchResultItemDetailComponent` | Product image and detail fields.                         |
| `ce-header`                    | `HeaderComponent`                 | Shared header wrapper with slotted content.              |

Registration checks whether each name is already defined. Applications should avoid defining unrelated elements under the same names. The components require a browser DOM and are not server-rendering entry points.

Within the repository's Vite applications, use relative source imports with `.js` extensions, as the existing application entry points do. Vite resolves these to the TypeScript modules.

## Design tokens and themes

Import the theming API from `custom-elements-autocomplete/theming` or the package root. The dedicated
theming entry does not register custom elements and can be imported without a browser DOM.

```ts
import {
  applyTheme,
  clearTheme,
  createTheme,
  darkTheme,
  lightTheme,
  tokens,
  type Theme,
  type PartialTheme,
} from 'custom-elements-autocomplete/theming';

// Page-wide theme, inherited through nested Shadow DOM.
applyTheme(document.documentElement, darkTheme);

// A container scopes its theme to descendants.
applyTheme(document.querySelector<HTMLElement>('#products')!, lightTheme);

// An instance can override its ancestor; reset restores inheritance.
const autocomplete = document.querySelector<HTMLElement>('ce-auto-complete')!;
const overrides: PartialTheme = { colorBrandStroke1: '#663399' };
const custom: Theme = createTheme(overrides); // Optional second argument: a base theme.
applyTheme(autocomplete, custom);
clearTheme(autocomplete);

// Token references can also be used in a consumer's stylesheet strings.
const styles = `button:focus-visible { outline: 3px solid ${tokens.colorBrandStroke1}; }`;
```

`Theme` includes semantic colors, native `colorScheme`, fonts, spacing, border radii, and stroke
widths. All values are strings including CSS units. `lightTheme`, `darkTheme`, custom themes, and
`tokens` are immutable. `createTheme` fills unspecified values from its base without changing inputs.

Each token references a prefixed custom property, such as
`var(--ce-colorBrandStroke1, #176d91)`. Components use light fallbacks when no theme is applied,
without modifying global styles. Raw CSS overrides work on any ancestor or component host:

```css
.branded-products {
  --ce-colorBrandStroke1: #663399;
  --ce-borderRadiusMedium: 1rem;
}
```

`applyTheme` replaces all supported inline token values on its target. `clearTheme` removes all
supported inline token properties, including manually assigned ones, while preserving unrelated
styles and custom properties. A reset restores styles from the CSS cascade rather than storing a
previous inline theme. Page and instance selectors in the examples demonstrate light, dark, and
custom purple themes. Themes do not follow system preferences or persist across page loads.

Theme changes use the CSS cascade and preserve focus, query, results, expanded selection, requests,
and Shadow DOM identity. Theme application does not trigger rendering or create subscriptions.

`npm run build` produces separate generic (`dist/autocomplete/autocomplete.js`) and product
(`dist/autocomplete/product-autocomplete.js`) entry points, plus the compatibility entry
(`dist/autocomplete/index.js`). The JavaScript bundles retain imports of lit-html and RxJS; configure
a consuming application's bundler to resolve those dependencies. They are not standalone scripts to
load directly without dependency resolution. The project is currently marked `private` and has no
configured npm release.

## Implement a provider

The provider contract is:

```ts
interface SearchProvider<T> {
  search(query: string, signal?: AbortSignal): Promise<T[]>;
}

type ProductSearchProvider = SearchProvider<SearchResultItem>;
```

The following example can replace `src/dev-app/main.ts`. It supplies local data and uses the built-in image fallback:

```ts
import {
  AutoCompleteComponent,
  type ProductSearchProvider,
  type SearchResultItem,
} from '../product-autocomplete/index.js';

const products: SearchResultItem[] = [
  {
    id: 1,
    name: 'Sample Red Wine',
    image_thumb_url: null,
    image_url: null,
    price_in_cents: 1895,
    primary_category: 'Wine',
    tasting_note: 'Rich berry notes.',
    volume_in_milliliters: '750',
  },
];

const provider: ProductSearchProvider = {
  async search(query, signal) {
    signal?.throwIfAborted();
    return products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  },
};

const autocomplete = document.createElement('ce-auto-complete') as AutoCompleteComponent;
autocomplete.searchProvider = provider;
document.body.append(autocomplete);
```

For a remote provider, forward the signal to `fetch`, check the response status, and validate the returned data before mapping it to `SearchResultItem[]`. Keep privileged API credentials on a server. The library includes no production backend or built-in LCBO API integration.

## Reuse the generic primitive

For another domain, extend `SearchAutocompleteElement<T>` from the generic entry point and supply
its search-result template. The generic base owns the labeled input, debounce, cancellation, stale
response guard, status handling, and lifecycle cleanup; the subclass owns only its domain's result
rendering and any customized messages.

```ts
import { html, type TemplateResult } from 'lit-html';
import { SearchAutocompleteElement, type SearchProvider } from '../autocomplete/index.js';

interface Article {
  slug: string;
  title: string;
}

const allArticles: Article[] = [{ slug: 'search-design', title: 'Search design' }];

class ArticleAutocomplete extends SearchAutocompleteElement<Article> {
  protected override renderResults(results: Article[]): TemplateResult {
    return html`<ul>
      ${results.map((article) => html`<li>${article.title}</li>`)}
    </ul>`;
  }
}

customElements.define('ce-article-autocomplete', ArticleAutocomplete);

const articles: SearchProvider<Article> = {
  async search(query, signal) {
    signal?.throwIfAborted();
    return allArticles.filter((article) =>
      article.title.toLowerCase().includes(query.toLowerCase()),
    );
  },
};

const autocomplete = document.createElement('ce-article-autocomplete') as ArticleAutocomplete;
autocomplete.searchProvider = articles;
document.body.append(autocomplete);
```

The generic entry does not register a result-rendering element or impose a result data shape.
`SearchAutocompleteElement<T>` is an abstract base class, so a domain-specific subclass must provide
`renderResults` and register its own custom-element name. Override the `messages` getter to
customize its search label, placeholder, and status text.

## Product data

All properties below are required. Image URL properties may be `null`.

| Property                | Type             | Meaning                                                           |
| ----------------------- | ---------------- | ----------------------------------------------------------------- |
| `id`                    | `number`         | Unique product identifier used for keyed rendering and selection. |
| `name`                  | `string`         | Product name.                                                     |
| `image_thumb_url`       | `string \| null` | Thumbnail URL displayed in the result button.                     |
| `image_url`             | `string \| null` | Image URL displayed in the expanded details.                      |
| `price_in_cents`        | `number`         | Price in cents; `1895` displays as `$18.95`.                      |
| `primary_category`      | `string`         | Product category.                                                 |
| `tasting_note`          | `string`         | Product description or tasting notes.                             |
| `volume_in_milliliters` | `string`         | Volume value; `'750'` displays as `750 ml`.                       |

Return unique IDs within each result set. The provider is responsible for validating its data; TypeScript types do not validate a remote response at runtime.

Missing and failed images use a built-in SVG fallback. Product strings are rendered as text. Image URLs are used as browser image sources and should come from locations permitted by your application's security and privacy requirements.

## Search behavior

Input changes immediately clear displayed results and invalidate prior requests. After 200 ms without another input event, the component searches using the trimmed query. Blank input clears results without calling the provider.

Changing the input, replacing `searchProvider`, or disconnecting the component cancels active work. A revision check prevents an obsolete response from updating the UI even if the provider ignores the abort signal. Disconnecting also releases the input subscription; reconnecting reuses the existing Shadow DOM and restores observation.

Assigning a new provider clears results and pending work. It does not automatically search the current query; another input change starts the next search. Setting `searchProvider` to `undefined` disables the input and displays configuration guidance.

While a request is pending, the component displays a loading status. An empty result displays an empty state; a rejected request displays an error. Later input can start a new search after a failure. Error details from the provider are not exposed in the UI.

## Selection and accessibility

Each result is a native button. Clicking it or activating it with Enter or Space expands that product's details. Selecting another product collapses the previous product; selecting the same product again leaves it expanded.

Result buttons communicate expansion through `aria-expanded` and reference their details with `aria-controls`. The input has an accessible label, status messages use a polite live region, and the supplied styles provide visible focus indicators. The interface does not implement a full ARIA combobox or arrow-key result navigation.

`ce-search-result-item` dispatches a bubbling, composed `product-select` event with the numeric product ID in `detail`. The result collection uses that event to maintain selection. Integrations may observe it:

```ts
autocomplete.addEventListener('product-select', (event) => {
  const productId = (event as CustomEvent<number>).detail;
  console.log('Selected product:', productId);
});
```

## Styling and application boundaries

Components use open Shadow DOM and include their own styles. Global CSS does not directly style their internal elements. The current library does not expose a documented theme token or CSS part API; host layout and application styling can be configured outside the component.

Keep example controls, fixture products, and development scenario logic outside production components. Each autocomplete instance owns its query, requests, results, and selection independently.

The library's fixed price format and milliliter display suit the included demo. Currency selection, localization, alternative product schemas, and broader browser coverage would require additional implementation and verification.
