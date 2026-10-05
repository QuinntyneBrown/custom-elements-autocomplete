## Project Overview

This project is a TypeScript product autocomplete library and browser demo built with native Web Components, open Shadow DOM, lit-html, and RxJS. An injected search provider supplies products after a 200 ms input debounce. Selecting a result expands its category, volume, price, and tasting notes. Demos use local fixtures without external API credentials.

The Tessera-inspired layout separates production code in `src/autocomplete/`, shared examples in `src/components-examples/`, and entry points in `src/dev-app/` and `src/e2e-app/`. Vite builds the library and standalone demo; `npm start` opens docs-first Storybook on port 6006; `npm run start:demo` opens the interactive demo.

## Working conventions

- Keep fixture data and scenario controls out of production components. Preserve the `ce-*` custom-element names and typed public exports.
- Reuse Shadow DOM on reconnection, unsubscribe on disconnect, cancel superseded requests, and ignore stale responses. Render product strings as text.
- Requirements live in `docs/specs/L1.md` and `L2.md`; acceptance tests identify the L2 requirements they cover.
- Add Jest tests under `test/unit/`. Keep Playwright locators and interactions in `test/e2e/pages/`; use controlled time and local providers.
- Run `npm run format` for Prettier formatting and `npm run lint:fix` for available ESLint fixes. Use two-space indentation, single quotes, semicolons, trailing commas, a 100-character print width, and LF line endings. Keep generated artifacts and the npm lockfile excluded from formatting.
- Validate lint and formatting with `npm run lint` and `npm run format:check`; both run in CI. ESLint uses recommended JavaScript and TypeScript rules without type-aware analysis.
- Validate changes with `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, `npm run build:demo`, `npm run e2e`, `npm run build-storybook`, and `npm run test:storybook`. Install Chromium with `npx playwright install chromium` before browser tests. Playwright owns port 4200 for demo tests and port 6006 for static Storybook tests. Generate the ignored custom-elements manifest with `npm run analyze`; keep stories in `src/components-examples/stories/`.
