# Frontend development

This folder contains the Next.js app, its dependencies, public media, tests and app-specific configuration. Shared documentation stays at the repository root:

- [Local setup, commands and verification](../docs/technical/development.md)
- [Current capabilities and limitations](../docs/status.md)
- [Scene contracts and presets](../docs/technical/scenes.md)
- [Authoring a lesson](../docs/technical/lesson-authoring.md)
- [Implementation plan](../docs/implementation-plan.md)

From this folder, run `pnpm install --frozen-lockfile`, then `pnpm dev`. From the repo root, use `pnpm --dir frontend dev`. The repo `.node-version` pins Node; this package's manifest and lockfile pin its tools/dependencies.

Run the shared documentation check from the repo root: `node scripts/check-docs.mjs`.
