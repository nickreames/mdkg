---
id: chk-3
type: checkpoint
title: 0.0.4 release cut prep and readiness audit
status: done
priority: 9
tags: [checkpoint, release, 0_0_4]
owners: []
links: [cmd:build, cmd:test, cmd:validate, cmd:task, cmd:event, cmd:skill, cmd:pack]
artifacts: [package.json, package-lock.json, README.md, CLI_COMMAND_MATRIX.md, scripts/cli_help_snapshot.js, src/commands/task.ts, src/commands/event.ts, src/commands/event_support.ts]
relates: [epic-4, epic-5, epic-9, epic-10, epic-12, epic-13]
blocked_by: []
blocks: []
refs: [dec-8, dec-9, dec-10, dec-12, dec-13, dec-14, dec-15, edd-2, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8, rule-3, rule-4, rule-5]
aliases: []
skills: []
scope: [task-73, task-74, task-75, task-76, task-77, task-78, task-79, task-85, task-86, task-87, task-88, task-89, task-90, task-91]
created: 2026-03-05
updated: 2026-03-09
---
# Summary

This checkpoint captures the final `0.0.4` cut-prep state for the mdkg CLI repo.

What is now true:
- the package metadata is bumped to `0.0.4`
- runtime, root docs, and the mdkg graph tell one consistent `0.0.4` story
- skills are first-class via `mdkg skill ...`
- task mutation is first-class via `mdkg task ...`
- opt-in event logging is implemented and automatic for supported mutation commands once enabled
- the command matrix and live help have a repeatable audit path
- publish has not been run from this turn

# Scope Covered

Work captured in this checkpoint spans:
- first-class skills authoring and skill-only command surface
- JSON discovery and command-surface consolidation
- release-line normalization and mdkg.dev backlog externalization
- focused task lifecycle mutation
- baseline episodic logging with explicit `event` commands and automatic appends
- command/help audit tooling and root-doc parity

# Decisions Captured

- `dec-8`: source-truth and gap policy
- `dec-9`: design philosophy and key decisions
- `dec-10`: command freeze, stage gating, and checkpoint selection
- `dec-12`: first-class skill authoring contract
- `dec-13`: skill namespace only, JSON discovery, and canonical command matrix
- `dec-14`: `0.0.4` release-line and repo-boundary normalization
- `dec-15`: event-aware task workflow and baseline episodic logging

# Implementation Summary

- Added first-class task mutation commands: `mdkg task start|update|done`
- Added explicit event controls: `mdkg event enable|append`
- Added automatic event append for supported mutation commands when events are enabled
- Removed generic skill discovery access; `mdkg skill ...` is now the only skill namespace
- Added JSON discovery/show output for nodes and skills
- Added canonical root command reference in `CLI_COMMAND_MATRIX.md`
- Added `npm run cli:snapshot` and `npm run cli:check` for repeatable command/help auditing
- Normalized release-facing docs and active mdkg nodes to `0.0.4` / `0.0.4x`
- Moved mdkg.dev planning out of active CLI scope and retained it only as external handoff context

# Verification / Testing

Release-readiness audit completed on 2026-03-09:
- `npm run build`
- `npm run test`
- `node dist/cli.js validate`
- `npm run cli:check`
- `npm_config_cache=/tmp/mdkg-npm-cache npm run smoke:consumer`

Manual workflow checks also passed:
- `mdkg event enable`
- `mdkg task start`
- `mdkg task update`
- `mdkg task done --checkpoint`
- JSONL event records validate successfully
- skill namespace and JSON discovery flows remain consistent with live help and root docs

# Known Issues / Follow-ups

- `epic-11`: structured output expansion (`xml`, `toon`, `markdown`) remains deferred follow-up work
- `epic-13`: residual coverage hardening remains deferred and non-blocking for `0.0.4`
- publish/tagging are intentionally not performed in this turn

# Links / Artifacts

- See `artifacts` for the release-facing files and command/help audit script
- See `scope` for the completed tasks included in this release-cut prep checkpoint
- See `refs` for the governing decisions, designs, and rules
