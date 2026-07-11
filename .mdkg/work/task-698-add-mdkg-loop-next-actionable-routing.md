---
id: task-698
type: task
title: Add mdkg loop next actionable routing
status: done
priority: 1
epic: epic-222
parent: goal-59
tags: [loop, next, routing, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-694, task-697]
context_refs: []
evidence_refs: [chk-401]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Add `mdkg loop next <loop>` as the minimal goal-like read-only routing command
for loop execution.

# Acceptance Criteria

- `mdkg loop next <loop>` returns the next actionable child, lane, or recovery
  node based on readiness projection state.
- Command is read-only and does not claim or mutate work.
- `--json` output explains why the node/lane was selected.
- Done loops return no actionable node and explain that closeout is complete.
- Routing respects blockers, waivers, approvals, and completed lanes.

# Files Affected

- `src/commands/loop.ts`
- `src/cli.ts`
- `tests/commands/loop.test.ts`
- `CLI_COMMAND_MATRIX.md`
- `docs/_generated/cli-reference.md`

# Implementation Notes

- Model after `goal next` ergonomics but keep loop-specific lane semantics.
- Do not make `loop next` a generic `next` command yet.
- Do not add claim semantics.

# Test Plan

- focused `loop next` CLI tests
- `test-371`
- `npm run cli:check`

# Links / Artifacts

- `goal-59`
- `dec-66`
