---
id: dec-15
type: dec
title: 0.0.4 event aware task workflow and baseline episodic logging
status: accepted
tags: [0_0_4, events, tasks, ux, memory]
owners: []
links: []
artifacts: [src/commands/task.ts, src/commands/event.ts, src/commands/event_support.ts, .mdkg/core/rule-3-cli-contract.md]
relates: [edd-3, edd-6, epic-12, dec-10, dec-13]
refs: []
aliases: [event-aware-task-flow, baseline-events]
created: 2026-03-08
updated: 2026-03-08
---

# Context

mdkg already had semantic memory and checkpoint guidance, but routine lifecycle mutation still depended on hand-editing markdown. That made durable episodic memory optional in practice, even when the repo encouraged agents and builders to rely on mdkg commands.

# Decision

- Add focused `mdkg task start`, `mdkg task update`, and `mdkg task done` commands for `task`, `bug`, and `test` nodes only.
- Add explicit `mdkg event enable` and `mdkg event append` commands.
- Keep event logging opt-in by workspace; mutation commands auto-append only when event logging is enabled.
- Use automatic baseline event kinds for `NODE_CREATED`, `SKILL_CREATED`, `CHECKPOINT_CREATED`, `TASK_STARTED`, `TASK_UPDATED`, and `TASK_DONE`.
- Keep checkpoint creation explicit through `mdkg task done --checkpoint "..."`; no implicit checkpoint spam.

# Alternatives considered

- Keep manual markdown editing as the primary lifecycle path: rejected because it weakens guided flows and provenance.
- Enable event logging automatically on first mutation: rejected because event logging is intentionally opt-in.

# Consequences

- Builders and agents now have an enticing command path that also yields baseline episodic memory when enabled.
- mdkg remains local-first and deterministic without forcing event logging on every repo.
- The next obvious UX gap shifts from task mutation to richer lifecycle ergonomics and optional structured output expansion.

# Links / references

- `edd-3`
- `edd-6`
- `epic-12`
