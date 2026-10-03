# Support

Use this guide to find documentation, ask questions, and report problems with Custom Elements Autocomplete.

## Documentation

- [README.md](README.md): installation, commands, project structure, and compatibility.
- [Integration guide](docs/usage.md): component registration, providers, and product data.
- [CONTRIBUTING.md](CONTRIBUTING.md): local development and pull requests.
- [Requirements](docs/specs/L2.md): expected behavior and acceptance criteria.

## Questions and bug reports

Search [existing issues](https://github.com/QuinntyneBrown/custom-elements-autocomplete/issues) before opening a new issue. Use the bug report template for defects or a regular issue for usage questions.

Include the command or interaction that produced the problem, expected and actual behavior, the affected commit, and your Node.js, npm, browser, and operating system versions. A small reproduction is more useful than a complete application. Remove credentials, personal data, and unrelated logs before posting.

For feature requests, describe the problem you want to solve and how the proposed change would help. Use the feature request template when available.

## Common setup issues

| Symptom                                        | Action                                                                                                                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency installation fails                  | Check that Node.js meets the version in `package.json`, then use `npm ci` with the committed lockfile. Include the installation error if the problem persists. |
| Vite reports that port 4200 is in use          | Stop the process using that port. Both the demo and the browser test server require it.                                                                        |
| Playwright cannot find Chromium                | Run `npx playwright install chromium`. On Linux, system libraries may require `npx playwright install --with-deps chromium`.                                   |
| The component's input is disabled              | Set the element's `searchProvider` property to a valid provider. See the [integration guide](docs/usage.md).                                                   |
| The demo's failure scenario keeps failing      | Search for `beer` to demonstrate recovery or switch the scenario to normal search. The failure scenario rejects queries containing `wine`.                     |
| Jest prints an experimental VM Modules warning | The launcher enables Node's ESM VM support. Review the test summary to distinguish this warning from a failure.                                                |

## Private reports

Follow [SECURITY.md](SECURITY.md) for vulnerabilities and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for conduct concerns. Do not post sensitive details in public support issues.

## Support expectations

Support is provided through the issue tracker as maintainers are available. There is no guaranteed response time or commercial support agreement. Clear reproductions and complete environment details help maintainers evaluate reports.
