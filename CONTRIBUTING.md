# Contributing

Thank you for considering a contribution to Custom Elements Autocomplete. This guide explains how to propose changes, work in the repository, and prepare a pull request.

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Use the process in [SECURITY.md](SECURITY.md) for suspected vulnerabilities.

## Propose a change

Search [existing issues](https://github.com/QuinntyneBrown/custom-elements-autocomplete/issues) and pull requests before opening a new report. For a substantial API or behavior change, open an issue to discuss the problem, proposed behavior, and tradeoffs before implementation. Small corrections can be submitted directly.

Bug reports should include a minimal reproduction, expected and actual behavior, the affected commit, browser and operating system, and relevant command output. Remove credentials and personal information from logs and attachments.

Feature requests should describe the user need, an example workflow, and any alternatives considered.

## Set up your environment

Use Node.js 22.18.0 or later and npm. Fork the repository, clone your fork, and create a branch for your change.

```sh
npm ci
npx playwright install chromium
npm start
```

On Linux, Playwright may also require system dependencies. The CI workflow installs them with `npx playwright install --with-deps chromium`.

## Development conventions

- Keep production code in `src/autocomplete/` and example data and scenario controls in `src/components-examples/` or the applications.
- Preserve the `ce-*` element names and typed public exports unless an agreed change requires otherwise.
- Follow the surrounding TypeScript and CSS style and the repository's [EditorConfig](.editorconfig). Use two spaces for indentation.
- Use `npm run format` for Prettier formatting and `npm run lint:fix` for available ESLint fixes. Formatting and lint rules are configured in [.prettierrc.json](.prettierrc.json) and [eslint.config.js](eslint.config.js).
- Keep component instances independent. Reuse their Shadow DOM on reconnection, unsubscribe on disconnect, cancel superseded work, and ignore stale responses.
- Render product strings as text. Keep API credentials and other secrets out of browser code, fixtures, and commits.
- Use controlled time and local providers in tests. Keep Playwright locators and interactions in `test/e2e/pages/`.
- Update documentation when commands, public interfaces, or observable behavior change.

Requirements are recorded in [L1.md](docs/specs/L1.md) and [L2.md](docs/specs/L2.md). When changing documented behavior, update the relevant requirements and acceptance criteria. Identify the covered L2 requirements in browser acceptance tests.

## Verify your change

Run the same checks used by CI:

```sh
npm run lint
npm run format:check
npm run typecheck
npm test -- --runInBand
npm run build
npm run build:demo
npm run e2e
```

Stop the development server before running browser tests; Playwright owns port 4200 during its run. Use `npx playwright show-report` to inspect the HTML report. Test traces and screenshots are retained on failure.

Add or update tests for behavior changes. Jest covers component and provider logic; Playwright covers browser interaction, rendered styles, and responsive behavior. Review keyboard interaction and focus behavior for user interface changes.

Documentation-only changes should be checked for accurate commands, valid links, and consistency with the current code. Run the full checks if a documentation change also modifies examples or application code.

Jest's launcher enables Node's experimental VM Modules support for ESM tests. The associated experimental warning is expected; test failures still require investigation.

## Submit a pull request

Keep the change focused and give the pull request a title that describes its outcome. Include:

- The problem and the resulting behavior.
- A related issue, if one exists.
- The checks run and their results, including any checks you could not run.
- Screenshots for visible changes and migration guidance for public API changes.

Do not commit `node_modules/`, `dist/`, coverage, or browser test reports. Update `package-lock.json` when changing dependencies. Review the diff for unrelated edits and sensitive information before submission.

Maintainers review correctness, maintainability, accessibility, compatibility, and test coverage. Address review feedback and keep the description aligned with the final change. Review and merge timing depend on maintainer availability.

## Contribution licensing

By submitting a contribution, you agree that it may be distributed under the project's [MIT License](LICENSE). Submit only material you have the right to contribute and retain any required attribution for reused work.
