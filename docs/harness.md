# Maintaining the agent workspace

Use when changing instructions, documentation structure, or session state. Start from [AGENTS.md](../AGENTS.md); [status](status.md) is the current-state snapshot.

## Where information belongs

- Product behavior: the relevant `docs/product/` reference. Accepted technology: the relevant `docs/technical/` reference. Maps link to these sources rather than restating the full specification.
- Unsettled choices: the relevant open-questions file; remove resolved items when their decision is recorded. Replace superseded guidance instead of appending contradictory versions.
- Current phase/available checks/active plan location: `docs/status.md`. Implementation tasks and handoff evidence live in the [implementation plan](implementation-plan.md); do not maintain parallel backlogs.
- Actual scripts, versions, types, and file layout: code/config once created. Retire planned-command placeholders when working configuration becomes authoritative.
- Deployment: `docs/deployment/`, consulted only when resumed. Personal vault/course material is background research, not a runtime dependency.

## Maintenance routine

1. Read only the task-relevant references and current state; inspect existing code/config before adding instructions.
2. Update the canonical topic and its pointers if necessary. Preserve accepted constraints; remove stale questions, rejected options, and repeated workshop narration.
3. Run `node scripts/check-docs.mjs` after documentation changes. New documents need a purposeful inbound link; fragments/paths must resolve.
4. For code, also use the relevant checks in [development](technical/development.md#verification). A written command or generated scaffold is not verification evidence.
5. Leave unfinished work, checks run, blockers, and next action in the active task/plan when work spans sessions. Update status only for material state changes.

Add bootstrap automation, nested instructions, custom lint gates, agent roles, or separate state files when working code or observed failures justify them. The implementation plan is the single execution tracker; avoid placeholder trackers, fake bootstrap commands, and duplicated agent instructions.

## Guides used

- [Learn Harness Engineering, repository as system of record](https://github.com/walkinglabs/learn-harness-engineering/tree/main/docs/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record), and [split instructions](https://github.com/walkinglabs/learn-harness-engineering/tree/main/docs/en/lectures/lecture-04-why-one-giant-instruction-file-fails), read from the local `Projects/learn-harness-engineering` checkout.
- The Obsidian `Coding Agent Harness — Project Setup & Field Guide`, read from the user's vault. Applied its minimal setup, canonical state, scoped verification, and session-handoff guidance.
