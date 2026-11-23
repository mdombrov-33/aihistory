# Local development and verification

Use for setup, developer tools, provider modes, tests, and proof of completion. [Status](../status.md) records what exists; the `frontend/` package is installed; backend/workflow tools below remain planned.

## Runnable now

Use the repo [.node-version](../../.node-version) and pnpm version recorded in [package.json](../../frontend/package.json). From the repository root:

```sh
bash scripts/bootstrap-frontend.sh
pnpm --dir frontend dev
```

Open `http://localhost:3000`. The bootstrap restores dependencies from `frontend/pnpm-lock.yaml` without upgrading libraries or rewriting installed shadcn components. No credentials, Docker or provider keys are needed for this static frontend. `dev` and `build` explicitly use the supported Webpack option because Turbopack did not complete in the task sandbox.

```sh
pnpm --dir frontend check
pnpm --dir frontend build
pnpm --dir frontend start
pnpm --dir frontend test:scenes
pnpm --dir frontend test:browser
node frontend/scripts/check-frontend-build.mjs
node scripts/check-docs.mjs
```

`dev`/`build` synchronize the generated showcase catalog from canonical story bundles. `check` verifies that index is current, then runs read-only Oxfmt + type-aware Oxlint + strict TypeScript. `format` applies Oxfmt. `test:browser` uses a built production app, starts it if needed and runs desktop/mobile journeys. Install a matching Chromium browser with `pnpm --dir frontend exec playwright install chromium` if absent. `pnpm --dir frontend exec playwright test --list` only lists cases; it does not exercise them.

App scripts run in `frontend/`; `cd frontend` followed by `pnpm <script>` is equivalent to the root commands above. The short [frontend development pointer](../../frontend/DEVELOPMENT.md) links back to these shared docs.

Open `/screen-gallery` to inspect the 18 actual composition examples. [Authoring](lesson-authoring.md) describes the v2 story format and new-bundle checks.

Static checks, production compilation, scene/bundle contracts and the built-HTML link/media check run locally without provider keys. The browser-independent scene suite uses Playwright’s runner without launching a browser; Vitest/RTL and database integration tests remain target tooling for later milestones. Exact commands and current evidence are in the [implementation tracker](../implementation-plan.md#execution-tracker).

Browser execution is pending: the task sandbox denies server binding (`listen EPERM`) and browser-host access is unavailable. A build or test discovery is not a rendered responsive, interaction or audio check.

The documentation check validates local links, headings, reachability and README emptiness without contacting external services. [Frontend source map](../visuals/full-app-flow.md#frontend-implementation) identifies the current modules.

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
- Oxfmt is the single formatter; pin/review upgrades. Automatic fixes/format writes are deliberate; `check` is read-only. Strict TypeScript checking stays separate from linting.
- Vitest for validators, playback logic, permissions, and budget calculations; React Testing Library for observable client-component behavior. Async Server Components use browser tests.
- Real isolated PostgreSQL for migrations, concurrent reservations, and duplicate jobs. Use saved fixtures/provider responses in regular tests; live paid checks are a separate budgeted path.
- Current Playwright browser cases cover prepared guest flows, preview forms, framing, scene navigation, preferences, bookmarks and media recovery. Add real sign-in, jobs, production audio and private-access cases when those services exist. Cover phone/desktop, keyboard/focus, and reduced motion; emulation complements actual phone checks during design/launch work.
- Select checks for the changed behavior; exercise crossed component/API/data boundaries. Report commands actually run and relevant omissions. Documentation-only work uses the runnable documentation check.

## Starting slice

Use the four existing storyboards and nine implemented families as the frontend baseline. The next production slice persists representative existing content and connects real playback/evidence contracts. Historical decisions and relationship diagrams require supported extensions; they are not hidden capabilities of the current schema. The [implementation plan](../implementation-plan.md) defines remaining setup and acceptance work.

Impeccable is installed as a local agent skill and is not a product runtime dependency. Detailed tasks/acceptance criteria live in the [implementation plan](../implementation-plan.md#execution-tracker); version candidates and unresolved compatibility gates are in its [research inputs](../implementation-plan.md#compatibility-and-local-configuration).

## Primary references

[pnpm configuration](https://pnpm.io/package_json), [Mailpit](https://mailpit.axllent.org/docs/configuration/runtime-options/), [Oxlint plugins](https://oxc.rs/docs/guide/usage/linter/plugins), [Hooks rule](https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks.html), [Oxfmt](https://oxc.rs/docs/guide/usage/formatter), [Next.js testing](https://nextjs.org/docs/app/guides/testing/vitest), [Playwright](https://playwright.dev/docs/emulation).
