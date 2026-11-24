# Development and verification

Run application scripts in `frontend/` or use the root [Makefile](../../Makefile). Use the repo [.node-version](../../.node-version), package-manager pin and lockfile; installed tools/scripts are authoritative in [package.json](../../frontend/package.json).

## Local frontend

```sh
make install
make dev
```

Open `http://localhost:3000`. Bundled content and guest storage need no credentials, Docker or provider keys. The bootstrap restores the lockfile. Dev/build use the configured Webpack mode; change bundlers only with a verified development/build path.

| Command | Scope |
| --- | --- |
| `make` | Available shortcuts |
| `make format` | Oxfmt, then syntax-aware blank-line formatting |
| `make check` | Catalog consistency, read-only formatting, typed lint, TypeScript and docs |
| `make test` | Browser-independent contracts using Playwright's runner |
| `make build-check` | Production compilation and generated HTML/media/link checks |
| `make verify` | check + test + build-check; sequential, browser execution excluded |
| `make test-browser` | Build, then desktop/mobile browser journeys |
| `make browsers` | Install matching Chromium when needed |
| `make docs-check` | Local documentation links, headings, reachability and empty README |
| `make catalog` | Regenerate discovery summaries after content registration |
| `make start` | Serve an existing production build |

Make serializes targets because builds/type checks share Next-generated files. `make test-list` discovers cases only. `make clean` removes generated build/compiler/test output.

Dev/build sync catalog summaries; read-only checks reject a stale index. The [spacing pass](../../frontend/scripts/format-spacing.cjs) uses TypeScript parsing to separate code sections while preserving tokens/comments/import order. Oxc editor formatting alone runs Oxfmt; `make format` applies the full project policy.

[Frontend navigation](../../frontend/DEVELOPMENT.md#start-here) maps code ownership. `/screen-gallery` renders registered compositions. [Authoring](lesson-authoring.md) describes content registration.

## Verification

Select checks for the changed behavior:

- Documentation-only changes: `make docs-check` and diff review.
- Source changes: static checks plus meaningful model/state/contracts; use `make verify` for the integrated source/build path.
- Layout, forms or interaction changes: exercise the actual phone/desktop browser journey, keyboard/focus, themes, larger text and reduced motion as relevant. Audio needs listening/playback verification.
- Service integration: isolated database/API tests and the complete browser → API → data path; fixtures for ordinary tests and a separately bounded live-provider path.

Contracts live in `frontend/tests/contracts/` and launch no browser. Journeys live in `frontend/tests/browser/`; they start a production server when needed. Test discovery and source checks are not rendered approval. Report commands actually run, gaps and their reason. [Status](../status.md#verification-boundary) owns current environment limitations; the active plan holds only relevant unfinished-task evidence.

Oxc uses type-aware lint plus explicit React Hooks rules; TypeScript checking stays separate. Formatting/spacing checks are read-only. Preserve existing test tools; introduce Vitest/RTL for concrete service/component needs rather than a parallel suite for its own sake. Real database checks must cover migrations, authorization, concurrent reservations and duplicate jobs.

## Planned backend environment

PostgreSQL/pgvector and Mailpit run in isolated Compose development/test profiles, with pinned images and localhost-only ports. Mailpit captures account mail without external forwarding. Host processes supervise Next, the generation worker and local Inngest, forward signals and preserve local data on shutdown. Configure actual addresses centrally when these services are implemented; documented targets are not runnable scripts.

Keep safe placeholders in an environment example and credentials in ignored local configuration. Generate a missing local auth secret once without overwriting user settings. Validate configuration with Zod. Separate app/auth migrations from Mastra-owned storage initialization.

Prepared workflow mode is provider-free: saved stages traverse real persistence, validation and recovery with keys absent. Live mode requires accessible models and finite operation/job/day/month spend limits; it never silently substitutes fixture output. These modes are future service requirements, separate from today's bundled frontend.

[Implementation plan](../implementation-plan.md#service-integration) owns order and acceptance; [architecture](architecture.md) and [generation](generation.md) own contracts. Local work is independent of cloud provisioning.

## Primary references

[pnpm](https://pnpm.io/package_json), [Mailpit](https://mailpit.axllent.org/docs/configuration/runtime-options/), [Oxlint](https://oxc.rs/docs/guide/usage/linter/plugins), [Hooks rule](https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks.html), [Oxfmt](https://oxc.rs/docs/guide/usage/formatter), [Next.js testing](https://nextjs.org/docs/app/guides/testing/vitest), [Playwright](https://playwright.dev/docs/emulation).
