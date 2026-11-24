# Local development and verification

Use for setup, developer tools, provider modes, tests, and proof of completion. [Status](../status.md) records what exists; the `frontend/` package is installed; backend/workflow tools below remain planned.

## Runnable now

Use the repo [.node-version](../../.node-version) and pnpm version recorded in [package.json](../../frontend/package.json). From the repository root:

```sh
make install
make dev
```

Open `http://localhost:3000`. The bootstrap restores dependencies from `frontend/pnpm-lock.yaml` without upgrading libraries or rewriting installed shadcn components. No credentials, Docker or provider keys are needed for this static frontend. `dev` and `build` explicitly use the supported Webpack option because Turbopack did not complete in the task sandbox.

```sh
make                 # List available commands
make format          # Format code and add blank-line separation
make check           # Catalog, formatting, lint, types and documentation
make test            # Browser-independent contracts
make build-check     # Production build and built-HTML validation
make verify          # check + test + build-check, sequentially
make test-browser    # Production build and desktop/mobile browser journeys
make start           # Serve an existing production build
```

The root [Makefile](../../Makefile) wraps existing package scripts and shared checks; it adds no replacement toolchain. `make` shows every target, including individual lint/type/format checks, `catalog`, `docs-check` and `clean`. `clean` removes only generated build/compiler/test output. Targets run sequentially because Next.js builds and TypeScript checks share generated files.

`dev`/`build` synchronize the generated showcase catalog from canonical story bundles. The package `check` verifies that index is current, then runs read-only Oxfmt + type-aware Oxlint + strict TypeScript; `make check` also validates documentation. `format` applies Oxfmt, then the [TypeScript-parser blank-line pass](../../frontend/scripts/format-spacing.cjs). Both are checked by `format:check`; code that is indented but lacks section/function separation fails that check. Browser testing uses a built production app, starts it if needed and runs desktop/mobile journeys. Install a matching Chromium browser with `make browsers` if absent. `make test-list` only lists cases; it does not exercise them. `make verify` deliberately excludes browser execution.

App scripts run in `frontend/`; `cd frontend` followed by `pnpm <script>` is equivalent to the root commands above. The [frontend navigation guide](../../frontend/DEVELOPMENT.md#start-here) maps the engine, controls, data, state and styles and links back to shared docs.

Open `/screen-gallery` to inspect the 26 actual composition examples. [Authoring](lesson-authoring.md) describes the v2 story format and new-bundle checks.

Static checks, production compilation, scene/bundle contracts and the built-HTML link/media check run locally without provider keys. The browser-independent suite in `frontend/tests/contracts/` uses Playwright’s runner without launching a browser; cross-route journeys live in `frontend/tests/browser/`; Vitest/RTL and database integration tests remain target tooling for later milestones. Exact commands and current evidence are in the [implementation tracker](../implementation-plan.md#execution-tracker).

Browser execution is pending: the task sandbox denies server binding (`listen EPERM`) and browser-host access is unavailable. A build or test discovery is not a rendered responsive, interaction or audio check.

The documentation check validates local links, headings, reachability and README emptiness without contacting external services. [Frontend source map](../../frontend/DEVELOPMENT.md#start-here) identifies the current modules.

## Planned backend environment

- pnpm with the frontend package lockfile and exact package-manager pin; supported Node LTS compatible with Next.js/Mastra, pinned at scaffolding. Do not inherit global versions silently.
- Docker Compose for PostgreSQL/pgvector and Mailpit, with pinned images and published ports bound to localhost. Mailpit captures verification/reset emails; external forwarding/relay stays disabled.
- Host development processes for Next.js, generation worker, and local Inngest. Exact commands, versions, ports, and startup supervision belong to setup work.
- **Current prepared frontend:** bundled JSON/media and browser-local guest activity; no database, worker or provider keys.
- **Planned prepared workflow mode:** saved stage outputs/media through the real database/workflow/validation/player, with no paid provider calls. This is a future integration acceptance path, not an existing environment switch.
- **Live mode:** real research/generation/embeddings, requiring credentials and finite spend limits. Mark prepared data clearly; failed live work never silently becomes example output.

## Later application commands

The current [package scripts](../../frontend/package.json) are authoritative for frontend work. `pnpm test` and process supervision for PostgreSQL, Mailpit, Mastra and Inngest are not implemented yet. Extend the existing scripts as those milestones gain actual services and checks; do not report planned commands as runnable.

## Verification

- Oxlint type-aware TypeScript plus applicable React/Next/accessibility rules. Explicitly enable `react/rules-of-hooks` and `react/exhaustive-deps`; enabling plugins alone is insufficient. Audit actual coverage rather than assume parity with another lint configuration.
- Oxfmt owns standard formatting; the small syntax-aware spacing pass adds the project’s blank-line policy without reordering imports or rewriting tokens. UI wrappers and `.d.ts` files are excluded from that pass. Pin/review upgrades. Automatic formatting writes are deliberate; `check` is read-only. Strict TypeScript checking stays separate from linting.
- Vitest for validators, playback logic, permissions, and budget calculations; React Testing Library for observable client-component behavior. Async Server Components use browser tests.
- Real isolated PostgreSQL for migrations, concurrent reservations, and duplicate jobs. Use saved fixtures/provider responses in regular tests; live paid checks are a separate budgeted path.
- Current Playwright browser cases cover prepared guest flows, preview forms, framing, scene navigation, preferences, bookmarks and media recovery. Add real sign-in, jobs, production audio and private-access cases when those services exist. Cover phone/desktop, keyboard/focus, and reduced motion; emulation complements actual phone checks during design/launch work.
- Select checks for the changed behavior; exercise crossed component/API/data boundaries. Report commands actually run and relevant omissions. Documentation-only work uses the runnable documentation check.

## Starting slice

Use the nine prepared lessons and 15 implemented families as the frontend baseline. The [learning engine](learning-engine.md) records the four new workbench families and exploration candidates. The next production slice persists representative existing content and connects real playback/evidence contracts. Richer decisions, relationships and new scientific models require supported extensions; they are not hidden capabilities of the current schema. The [implementation plan](../implementation-plan.md) defines remaining setup and acceptance work.

Impeccable is installed as a local agent skill and is not a product runtime dependency. Detailed tasks/acceptance criteria live in the [implementation plan](../implementation-plan.md#execution-tracker); version candidates and unresolved compatibility gates are in its [research inputs](../implementation-plan.md#compatibility-and-local-configuration).

## Primary references

[pnpm configuration](https://pnpm.io/package_json), [Mailpit](https://mailpit.axllent.org/docs/configuration/runtime-options/), [Oxlint plugins](https://oxc.rs/docs/guide/usage/linter/plugins), [Hooks rule](https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks.html), [Oxfmt](https://oxc.rs/docs/guide/usage/formatter), [Next.js testing](https://nextjs.org/docs/app/guides/testing/vitest), [Playwright](https://playwright.dev/docs/emulation).
