# Product design map

**Working name:** Interactive History (provisional; expected to change).  
**Status:** Product direction established; the frontend Next.js app is a prepared-content frontend under active iteration. [Current state](status.md) distinguishes working preview capabilities from planned live services. Deployment is on hold.

## Product promise

Explore history through beautiful, interactive stories built around your questions. A learner can enter through a question or browse a public library, then follow a guided, visual explanation with optional exploration and inspectable sources.

This is a piece of a larger website: generated stories use supported scene and interaction forms inside the product. They are not standalone websites or generic chat answers.

## Read by task

- **Story flow, scenes, narration, art direction, accessibility:** [`product/experience.md`](product/experience.md)
- **Library, detail pages, sharing, community, bookmarks, and reporting:** [`product/library.md`](product/library.md)
- **Accounts, personal history guide, creation allowance, and monetization direction:** [`product/account-and-offer.md`](product/account-and-offer.md)
- **Unresolved product decisions:** [`product/open-questions.md`](product/open-questions.md)
- **Active application stack and task-specific technical references:** [`technical/decisions.md`](technical/decisions.md)
- **Deferred deployment choices and research, only when resumed:** [`deployment/decisions.md`](deployment/decisions.md)
- **Terms:** [`../GLOSSARY.md`](../GLOSSARY.md)
- **Current full-app visual exploration and screen flow:** [`visuals/full-app-flow.md`](visuals/full-app-flow.md)
- **Compact context for design tooling:** [`../PRODUCT.md`](../PRODUCT.md)
- **Visual references and earlier concepts:** [`visuals/`](visuals/)

## Current boundaries

- History is the initial subject area, across periods and places. Cold War is only an example.
- The intended learner is a curious adult who may know little about the requested subject. English is the initial language.
- Public library browsing and playback should work without an account. Accounts add personal and community benefits.
- Application architecture and provider choices live in the technical guide. Hosting, staging, and cloud operations are deferred and do not block local implementation.

## Source-of-truth rule

The topical documents contain current product direction. Open proposals stay in `product/open-questions.md`; accepted answers are folded into the relevant topical document and removed from the open list. This file remains a short map, not a second specification.
