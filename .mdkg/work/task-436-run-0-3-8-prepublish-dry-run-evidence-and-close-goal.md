---
id: task-436
type: task
title: run 0.3.8 prepublish dry-run evidence and close goal
status: done
priority: 1
epic: epic-116
parent: goal-23
tags: [prepublish, closeout, 0.3.8]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-25
---
# Overview

Run the full 0.3.8 warning-scale hardening gate through dry-run release proof and record closeout evidence without publishing.

# Acceptance Criteria

- All required checks on `goal-23` pass or exact failures are recorded.
- `npm pack --dry-run --json` and `npm publish --dry-run` run with the clean npm cache.
- `task-436` records command evidence and any remaining known gaps.
- `goal-23` is evaluated and closed only if all scoped work is complete.
- No real npm publish, tag, push, global install, or child-repo mutation happens.

# Files Affected

- .mdkg/work
- .mdkg/index

# Implementation Notes

- If new requirements are added before closeout, keep the goal open and route to the new scoped node.

# Test Plan

- Run every command listed in `goal-23.required_checks`.
- `node dist/cli.js goal evaluate goal-23 --json`
- `git diff --check`

# Links / Artifacts

- goal-23
