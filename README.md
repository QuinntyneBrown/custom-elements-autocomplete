# Custom Elements Autocomplete

A TypeScript autocomplete library with reusable generic search primitives, a product-specific Web
Component, and a browser demo built with Shadow DOM, lit-html, and RxJS.

The `ce-auto-complete` element searches through a provider supplied by your application. Results display product names and images; selecting a result expands its category, volume, price, and tasting notes. The included demo uses local sample data and requires no API account or credentials.

## Features

- Search after a 200 ms input debounce, with loading, empty, and error states.
- Cancellation of superseded requests and protection against stale responses.
- Independent component instances and support for disconnecting and reconnecting elements.
- Accessible input labels, announced status updates, and keyboard-operable result buttons.
- Image fallbacks and product text rendered without interpreting HTML markup.
- ES module output and TypeScript declarations, with separate library and demo builds.

## Getting started

### Prerequisites

- Node.js 22.18.0 or later.
- npm, included with Node.js.
- Git to clone the repository.

### Run Storybook

```sh
git clone https://github.com/QuinntyneBrown/custom-elements-autocomplete.git
cd custom-elements-autocomplete
npm ci
npm start
```

Storybook opens docs-first at <http://127.0.0.1:6006/>. It follows the Fluent UI Web Components documentation setup, using Storybook 10 for Vite 8 compatibility. Run `npm run start:demo` for the interactive demo at <http://127.0.0.1:4200/src/dev-app/>. Search for `wine` or `beer`, select a result, and use the scenario selector to explore empty results, failures, and delayed responses. The second example maintains its own state. The root URL serves the same demo.

Use `npm run watch` to start the server without opening a browser.

## Use the component

Import the product entry to register its `ce-*` custom elements, then assign a
`ProductSearchProvider` to the autocomplete element. This example belongs in
`src/dev-app/main.ts` and uses the repository's local fixture provider:

```ts
import { AutoCompleteComponent } from '../product-autocomplete/index.js';
import { createFixtureProvider } from '../components-examples/fixture-search-provider.js';

const autocomplete = document.createElement('ce-auto-complete') as AutoCompleteComponent;
autocomplete.searchProvider = createFixtureProvider();
document.body.append(autocomplete);
```

Applications implement `search(query: string, signal?: AbortSignal): Promise<SearchResultItem[]>` to connect their own data. The component supplies a trimmed, nonblank query and an abort signal. An unconfigured component disables its input and displays configuration guidance.

See the [integration guide](docs/usage.md) for a complete provider example, the product data contract, and component behavior.

## Formatting and linting

Use Prettier for formatting and ESLint's recommended JavaScript and TypeScript rules for code checks:

```sh
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

`lint` and `format:check` check files without changing them; `lint:fix` applies available lint fixes and `format` writes formatted files. CI runs both checks. Type-aware linting is not enabled.

The [Prettier configuration](.prettierrc.json) uses two-space indentation, single quotes, semicolons, trailing commas, a 100-character print width, and LF line endings. The [ESLint configuration](eslint.config.js) sets browser and Node globals and disables formatting rules that conflict with Prettier. Dependencies, generated artifacts, caches, and the npm lockfile are excluded. No Git hooks are installed.

## Build and test

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `npm start`               | Start docs-first Storybook on port 6006.                        |
| `npm run start:demo`      | Start Vite and open the development demo.                       |
| `npm run analyze`         | Generate the public custom-elements manifest.                   |
| `npm run build-storybook` | Build standalone documentation in dist/storybook.               |
| `npm run test:storybook`  | Test the static Storybook in desktop and mobile Chromium.       |
| `npm run watch`           | Start Vite without opening a browser.                           |
| `npm run typecheck`       | Check source, tests, and TypeScript configuration.              |
| `npm run build`           | Build the library and declarations in `dist/autocomplete/`.     |
| `npm run build:demo`      | Build the standalone demo in `dist/demo/`.                      |
| `npm run preview:demo`    | Serve the demo after building it.                               |
| `npm test`                | Run the Jest unit tests.                                        |
| `npm run test:watch`      | Run unit tests in watch mode.                                   |
| `npm run test:coverage`   | Write unit test coverage to `coverage/`.                        |
| `npm run e2e`             | Run Playwright tests with desktop and mobile Chromium projects. |

Install the browser used by the acceptance tests before running them:

```sh
npx playwright install chromium
npm run e2e
```

Playwright starts its own Vite server on port 4200. Stop any development server using that port first. Failure screenshots and traces are written to `test-results/`; the HTML report is written to `playwright-report/`. These generated files and coverage reports are excluded from version control.

The [CI workflow](.github/workflows/ci.yml) checks lint, formatting, and types, runs unit tests, builds the library and demo, and runs the browser tests. See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete local verification sequence.

## Project structure

| Path                                                     | Purpose                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`src/autocomplete/`](src/autocomplete/)                 | Generic provider and autocomplete lifecycle primitives.                |
| [`src/product-autocomplete/`](src/product-autocomplete/) | Product result types, rendering components, and product adapter.       |
| [`src/index.ts`](src/index.ts)                           | Compatibility entry point exporting generic and product APIs.          |
| [`src/components-examples/`](src/components-examples/)   | Shared examples, fixture providers, sample products, and local assets. |
| [`src/dev-app/`](src/dev-app/)                           | Interactive development demo.                                          |
| [`src/e2e-app/`](src/e2e-app/)                           | Controlled application for browser acceptance tests.                   |
| [`test/unit/`](test/unit/)                               | Jest component and provider tests.                                     |
| [`test/e2e/`](test/e2e/)                                 | Playwright acceptance tests and page objects.                          |
| [`test/fixtures/`](test/fixtures/)                       | Shared unit test data.                                                 |
| [`docs/specs/`](docs/specs/)                             | Requirements and acceptance criteria.                                  |
| [`tools/`](tools/)                                       | Cross-platform test launcher.                                          |

## Project status and compatibility

The repository provides a library build and a static demo. The package is marked `private` and is not configured for npm publication. The library build keeps lit-html and RxJS as external dependencies; a consuming application's bundler must resolve them. The demo bundles its dependencies for static hosting.

Browser acceptance tests cover desktop Chromium and an emulated mobile Chromium device. Other browser engines are not currently included in CI. The interface provides search and result expansion; it does not implement arrow-key combobox navigation. Prices display a dollar sign and two decimal places without configurable currency or locale formatting.

## Contributing and support

Contributions to code, tests, documentation, and accessibility are welcome. Read the [contribution guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

- For questions, troubleshooting, and feature requests, see [SUPPORT.md](SUPPORT.md).
- To report a vulnerability, follow [SECURITY.md](SECURITY.md).
- For component integration, see [docs/usage.md](docs/usage.md).

## License

This project is licensed under the [MIT License](LICENSE). Dependencies remain subject to their respective licenses.

## Design tokens and themes

The library exports typed tokens, light/dark presets, and scoped theme helpers. Both examples include
page and instance theme selectors. See the [integration guide](docs/usage.md#design-tokens-and-themes)
for custom themes and CSS overrides.

## Storybook

Run `npm run analyze` to generate the public custom-elements manifest. `npm start` regenerates it before starting Storybook. Use `npm run build-storybook` to build `dist/storybook`, `npm run preview-storybook` to serve that build, and `npm run test:storybook` to verify it in Chromium. The generated manifest is exported as `custom-elements-autocomplete/custom-elements.json`.

Stories live in `src/components-examples/stories/`; `.storybook/api.ts` derives API controls from the manifest. Theme and direction toolbar settings apply to individual previews. The documentation shell remains light. Storybook configuration, stories, and fixtures stay outside library builds.
