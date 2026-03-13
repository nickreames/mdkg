---
id: chk-5
type: checkpoint
title: release cut and readiness audit
status: done
priority: 9
tags: [0_0_6, release, audit]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, AGENT_START.md, src/commands/init.ts, src/commands/event.ts, src/commands/event_support.ts, src/commands/task.ts, src/commands/skill_mirror.ts, tests/commands/init.test.ts, tests/commands/skill_mirrors.test.ts, tests/commands/task_event.test.ts, tests/commands/validate_events.test.ts]
relates: [epic-16, dec-19, task-109]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [epic-16]
created: 2026-03-11
updated: 2026-03-11
---
# Summary

`0.0.6` release-cut prep is complete.

This phase closes the main bootstrap and memory-default gaps found from real `init --agent` usage:
- `init --agent` now seeds three canonical mdkg usage skills by default
- `.agents/skills/` and `.claude/skills/` are non-empty immediately after agent bootstrap
- event logs are created and committed by default instead of being gitignored by mdkg
- task commands are framed as structured helpers while manual markdown edits remain valid for narrative and parent-body work
- release gates pass on the current tree

# Scope Covered

- `epic-16`: agent bootstrap default skills, event defaults, hybrid task/manual-edit framing, and release prep

# Decisions Captured

- `dec-19`: agent bootstrap default skills, event defaults, and task framing

# Implementation Summary

- Added seeded init assets for:
  - `select-work-and-ground-context`
  - `build-pack-and-execute-task`
  - `verify-close-and-checkpoint`
- Updated `init --agent` to copy those skills into `.mdkg/skills/`, refresh the registry, and mirror them into `.agents/skills/` and `.claude/skills/`.
- Changed event behavior so `events.jsonl` is durable by default and `mdkg event enable` is now a create/ensure command instead of an ignore-management command.
- Kept `mdkg task start|update|done` unchanged as the structured mutation surface, while clarifying that markdown remains the right tool for narrative body content and parent summaries.
- Tightened startup and skill guidance so agents are pointed first to SOUL/HUMAN, the mdkg readme, the command matrix, and the seeded planning skill.
- Made skill mirroring idempotent at the file-content level so managed mirrors can be refreshed safely in place.

# Verification / Testing

Release gates completed on 2026-03-11:
- `npm run build`
- `npm run test`
- `node dist/cli.js skill sync`
- `node dist/cli.js validate`
- `npm run cli:check`
- `npm_config_cache=/tmp/mdkg-npm-cache npm run smoke:consumer`

Verification focus:
- seeded `init --agent` bootstrap
- non-empty canonical and mirrored skills after bootstrap
- committed-by-default event behavior
- validation tolerance when `events.jsonl` is manually deleted
- docs/help/skill-registry parity for the hybrid command/manual-edit model

# Known Issues / Follow-ups

- structured output expansion remains deferred under `epic-11`
- residual coverage hardening remains deferred under `epic-13`
- task command ergonomics redesign remains intentionally deferred; current `start|update|done` surface is kept

# Links / Artifacts

- `epic-16`
- `task-104`
- `task-105`
- `task-106`
- `task-107`
- `task-108`
- `task-109`
- `test-58`
- `test-59`
- `test-60`
- `test-61`
- `test-62`
