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

## Backend observability

This is the first backend implementation slice, before feature services. It is planned, not installed. Operational diagnostics cover HTTP requests, dependencies, process health and worker recovery; [Mastra tracing](generation.md#tracing) covers agent/workflow execution. Both must be correlatable without duplicating instrumentation.

### Logging and error boundaries

- Use Pino through one server-owned logger factory. Inject child loggers into services; bind request context with AsyncLocalStorage. Use `LOG_LEVEL` and validated configuration, pretty output in local development and single-line JSON on stderr in machine-readable mode. Keep stdout available for command output.
- Bind UTC timestamp, level, stable event name, service, environment and available build version/Git SHA. Keep field types consistent. Bind server-created request ID, authenticated opaque user ID where needed, and job/stage/attempt IDs as applicable. Include trace/span IDs when active; request IDs and trace IDs are distinct.
- Echo the request ID in responses and propagate correlation on internal calls. Treat incoming IDs/trace headers as untrusted: validate/bound them, apply a trust policy and never use them for identity or authorization. Preserve context across dispatch through explicit metadata; durable retries carry job/attempt IDs and trace links rather than an indefinitely open HTTP span.
- Use one HTTP boundary for completion logging and RED metrics: method, route template, status/outcome and duration. Unexpected failures attach a sanitized error/cause/stack to that event; services enrich and propagate errors without logging the same failure again. Expected 4xx outcomes are INFO/DEBUG without stacks; unexpected failures are ERROR; DEBUG is opt-in. Application events use DEBUG/INFO/ERROR; retain third-party native levels without adding duplicate records.
- Avoid request/response bodies, raw query strings, SQL parameters and arbitrary error serialization. Allowlist diagnostic fields and apply logger-level redaction as a safety net. [Diagnostic privacy and retention](security-and-cost.md#diagnostics) apply to every sink, including framework logs and traces.

### Metrics, traces and local inspection

- Record request rate, errors and duration with counters/histograms; add process memory, event-loop health and dependency/worker measurements as those components arrive. Labels use bounded method/route/status/outcome values, never user/request/job IDs or raw URLs. Correlation IDs belong in logs/traces.
- Use OpenTelemetry through Next's instrumentation entry point and a separate worker bootstrap. Initialize once per process, reuse framework HTTP/database/client instrumentation where supported and add spans for meaningful application operations. Verify version compatibility and avoid duplicate SDK registrations/spans. Instrument dependencies as they are introduced; do not record private payloads or SQL values.
- Supply a provider-free diagnostic request with a controllable fake dependency. An optional localhost-only Compose observability profile supplies a local receiver and inspection tools: Prometheus/Grafana for operational metrics and an OpenTelemetry-compatible trace viewer. Choose compatible packages/images during implementation. Hosted telemetry, log aggregation, paging and continuous profiling are deferred; profiling is driven by an observed performance question.
- Keep console logs available when exporters fail. Bound queues, record sizes, sampling and local disk retention; telemetry failure must not fail the business request. Flush on graceful shutdown with a deadline. Optional observability services must not be required to run prepared mode. Local dashboards need reproducible queries for rate, 5xx and latency plus trace/log correlation; deployment alerts come with deployment work.

Acceptance is in [M00a](../implementation-plan.md#m00a-observability-foundation). Use controlled secrets, concurrent requests and expected/unexpected errors to test context isolation, redaction, severity, metrics labels, trace continuity, exporter failure and shutdown. Initial diagnostics need no model calls, external credentials or application database.

## Planned backend environment

PostgreSQL/pgvector and Mailpit run in isolated Compose development/test profiles, with pinned images and localhost-only ports. Mailpit captures account mail without external forwarding. Host processes supervise Next, the generation worker and local Inngest, forward signals and preserve local data on shutdown. Configure actual addresses centrally when these services are implemented; documented targets are not runnable scripts.

Keep safe placeholders in an environment example and credentials in ignored local configuration. Generate a missing local auth secret once without overwriting user settings. Validate configuration with Zod. Separate app/auth migrations from Mastra-owned storage initialization.

Prepared workflow mode is provider-free: saved stages traverse real persistence, validation and recovery with keys absent. Live mode requires accessible models and finite operation/job/day/month spend limits; it never silently substitutes fixture output. These modes are future service requirements, separate from today's bundled frontend.

[Implementation plan](../implementation-plan.md#service-integration) owns order and acceptance; [architecture](architecture.md) and [generation](generation.md) own contracts. Add these services after the observability foundation and instrument them as they arrive. Local work is independent of cloud provisioning.

## Primary references

[pnpm](https://pnpm.io/package_json), [Mailpit](https://mailpit.axllent.org/docs/configuration/runtime-options/), [Oxlint](https://oxc.rs/docs/guide/usage/linter/plugins), [Hooks rule](https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks.html), [Oxfmt](https://oxc.rs/docs/guide/usage/formatter), [Next.js testing](https://nextjs.org/docs/app/guides/testing/vitest), [Playwright](https://playwright.dev/docs/emulation).

Observability: [Pino](https://getpino.io/), [Next.js OpenTelemetry](https://nextjs.org/docs/app/guides/open-telemetry), [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/). Adapted from the local Obsidian guide `30 Learning/Courses/Boot.dev/Logging and Telemetry/Logging Best Practices.md`; the requirements above are self-contained and do not require vault access.
