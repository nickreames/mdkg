---
id: chk-4
type: checkpoint
title: 0.0.5 release cut prep and readiness audit
status: done
priority: 9
tags: [0_0_5, release, audit]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, AGENT_START.md, src/cli.ts, src/commands/init.ts, src/commands/skill.ts, src/commands/skill_mirror.ts, src/commands/task.ts, src/commands/event.ts, tests/commands/init.test.ts, tests/commands/skill_mirrors.test.ts, tests/commands/task_event.test.ts]
relates: [epic-14, epic-15, dec-16, dec-17, dec-18]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [epic-14, epic-15]
created: 2026-03-11
updated: 2026-03-11
---
# Summary

`0.0.5` release cut prep is complete.

The repo now has:
- generic AI-agent bootstrap via `mdkg init --agent`
- shared `AGENT_START.md` startup guidance with explicit SOUL/HUMAN read order
- canonical `.mdkg/skills/` plus safe `.agents/skills/` and `.claude/skills/` mirrors
- first-class `mdkg skill sync`
- guided task/event/checkpoint lifecycle with checkpoint-first closeout policy
- task start/done reminders when event logging is disabled
- updated internal skills and mdkg design docs aligned to the current runtime

# Scope Covered

- `epic-14`: generic agent bootstrap and product-specific skill onboarding
- `epic-15`: guided work-memory lifecycle

# Decisions Captured

- `dec-15`: event-aware task workflow and baseline episodic logging
- `dec-16`: init agent rename and generic agent language
- `dec-17`: shared agent start artifact and first-step guidance
- `dec-18`: canonical mdkg skills with agents and claude mirrors

# Implementation Summary

- Replaced `--omni` with `--agent` and updated runtime help, tests, startup docs, and design docs.
- Added safe mirrored skill materialization under `.agents/skills/` and `.claude/skills/`, with `mdkg skill sync` as the explicit repair path.
- Kept `.mdkg/skills/` canonical and non-destructive toward unknown files in mirrored trees.
- Tightened startup guidance around trust order, first-step planning, and product-specific wrappers.
- Kept parent closeout as checkpoint-first guidance rather than adding a new parent mutation command.
- Strengthened task/event UX so provenance enablement is discoverable without auto-enabling JSONL logs.

# Verification / Testing

Release gates completed on 2026-03-11:
- `npm run build`
- `npm run test`
- `node dist/cli.js skill sync`
- `node dist/cli.js validate`
- `npm run cli:check`

Verification focus:
- init/agent bootstrap path
- mirrored skill sync and drift warnings
- task/event/checkpoint lifecycle
- startup-doc and help parity

# Known Issues / Follow-ups

- structured discovery output expansion remains deferred under `epic-11`
- residual coverage hardening remains deferred under `epic-13`
- parent status mutation for feats/epics is still manual in `0.0.5`

# Links / Artifacts

- `epic-14`
- `epic-15`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `src/cli.ts`
- `src/commands/init.ts`
- `src/commands/skill.ts`
- `src/commands/skill_mirror.ts`
- `src/commands/task.ts`
- `src/commands/event.ts`
