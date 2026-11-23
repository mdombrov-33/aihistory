# Technical direction

Accepted application choices, organized by task. This is the target stack map; installation/service status is explicit in [status](../status.md). These references replace the chronological workshop log; they preserve the agreed direction without requiring every task to load every decision.

| Area | Selected direction | Details |
| --- | --- | --- |
| Application | TypeScript, Next.js/React; one project, separate web/worker entry points | [Architecture](architecture.md) |
| Prepared content | Working v2 bundles, scene/model schemas and registered local media; persistent records/readiness planned | [Scenes](scenes.md), [authoring](lesson-authoring.md) |
| Data | Selected PostgreSQL/pgvector, Drizzle/Drizzle Kit and chapter JSONB; Zod already validates prepared content | [Architecture](architecture.md#persistence-and-content) |
| Frontend | Working Next.js/React, Tailwind, shadcn/ui, Lucide, Motion, custom player, image inspection and native 3D; TanStack Query planned for service integration | [Frontend](frontend.md) |
| Maps and text | Working React SVG + d3-geo, Natural Earth and local schematics; plain-text reading now, restricted Markdown planned | [Frontend](frontend.md#geography-and-precise-visuals) |
| Interactive learning | Three.js/R3F/Drei assemblies, Rapier pendulum, Tone sound and React Flow Boolean networks; more models remain exploratory | [Learning engine](learning-engine.md) |
| Generation | Mastra + local Inngest; saved stages, detailed prompts, evidence checks | [Generation](generation.md) |
| Models | Task-specific defaults and configurable supported providers | [Provider defaults](generation.md#provider-defaults) |
| Access and cost | Better Auth, scoped authorization, automatic moderation, PostgreSQL limits/ledger | [Security and cost](security-and-cost.md) |
| Development | pnpm, pinned Node LTS, Docker dependencies, Mailpit, prepared/live modes | [Development](development.md) |
| Verification | Working Oxc/strict TypeScript and browser-independent Playwright contracts; browser execution pending; Vitest/RTL and PostgreSQL integration tests planned | [Development](development.md#verification) |

[Current state](../status.md) distinguishes planned tooling from verified commands. [Open technical questions](open-questions.md) records what is still unspecified. Product behavior lives in the [product map](../design.md).

[Deployment choices and research](../deployment/decisions.md) are parked until the user explicitly resumes deployment. They do not block local implementation.
