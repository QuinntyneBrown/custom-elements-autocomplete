# Security policy

This document describes how to report suspected vulnerabilities and the security responsibilities of applications that integrate Custom Elements Autocomplete.

## Supported code

Security fixes are targeted at the current code on the repository's default branch. The package is not currently published to npm, and this project does not maintain separate supported release lines or provide a guaranteed response or remediation schedule.

When reporting a problem, identify the affected commit and whether it also reproduces with the latest code.

## Report a vulnerability

Email [quinntynebrown@gmail.com](mailto:quinntynebrown@gmail.com) to report a suspected vulnerability privately. Do not disclose vulnerability details, exploit code, credentials, or private data in a public issue or pull request.

If GitHub private vulnerability reporting is enabled, you may also use **Report a vulnerability** on the repository's [security advisories page](https://github.com/QuinntyneBrown/custom-elements-autocomplete/security/advisories). Availability depends on repository settings; see [GitHub's reporting documentation](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository).

In the private report, include:

- A summary of the vulnerability and potential impact.
- The affected commit, components, and configuration.
- Reproduction steps or a minimal proof of concept.
- Browser, operating system, and relevant dependency versions.
- Any proposed mitigation and whether the issue has already been disclosed elsewhere.

Use synthetic data for reproductions. Do not include live credentials or unrelated personal information.

## Assessment and disclosure

Maintainers assess reports, request additional information when needed, and coordinate a fix and disclosure with the reporter. Timing depends on impact, reproducibility, and maintainer availability. Reporter attribution should be agreed before publication.

For a vulnerability in a third-party dependency, use that dependency's reporting process. Notify this project privately when its use of the dependency creates an additional exposure.

## Integration considerations

- Keep privileged credentials on a server. Browser code and bundled assets are visible to users.
- Validate provider responses and use image URLs from sources appropriate for your application. Product text is rendered as text, but image URLs can cause browser requests to the supplied locations.
- Treat open Shadow DOM as component encapsulation, not a security boundary.
- Use HTTPS for remote services and apply authentication, authorization, input limits, and rate limiting at the service boundary.
- Review dependencies and configure your deployment's content security policy for the assets and services it uses.

The supplied demos use local fixtures and assets. Connecting an external provider introduces application-specific data handling and service responsibilities.

For ordinary bugs or questions without a security impact, use the channels in [SUPPORT.md](SUPPORT.md).
