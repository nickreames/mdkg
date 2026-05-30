---
id: task-201
type: task
title: epic 21 implementation readiness audit
status: done
priority: 1
epic: epic-35
tags: [subgraph, epic-21, implementation-readiness, audit]
owners: []
links: []
artifacts: [epic-21, task-172, task-173, task-174, task-175, task-176, task-177, task-178, task-179, task-180]
relates: [epic-35, epic-21, task-172, task-173, task-174, task-175, task-176, task-177, task-178, task-179, task-180]
blocked_by: [task-195, task-200]
blocks: [task-202]
refs: []
aliases: [epic-21-readiness]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Confirm `epic-21` is ready to become the next implementation pass after release
state cleanup.

# Acceptance Criteria

- Inspect tasks `172` through `180` for decision completeness.
- Confirm command direction: `mdkg subgraph ...` replaces public
  `mdkg bundle import ...` docs/surface.
- Confirm `mdkg capability resolve` requirements are deterministic and scoped.
- Confirm freshness, permission, visibility, SQLite hydration, and temp
  root/child/grandchild smoke requirements are explicit.
- Add or link any missing requirements before coding starts.

# Files Affected

- `.mdkg/work/task-201-epic-21-implementation-readiness-audit.md`
- `epic-21`
- `task-172` through `task-180` if readiness gaps are found.

# Implementation Notes

This task should produce the handoff point for the next coding agent. Do not
start implementation until the release-state audit is closed or explicitly
waived.

# Test Plan

- `node dist/cli.js show epic-21 --json`
- `node dist/cli.js list --type task --epic epic-21 --json`
- `node dist/cli.js pack task-176 --profile concise --dry-run --stats`
- `node dist/cli.js pack task-201 --profile concise --dry-run --stats`

# Audit Evidence

- `epic-21` is active and unblocked.
- Tasks `172` through `180` exist and cover config, public command migration,
  CLI registry, projection/SQLite hydration, deterministic capability resolve,
  freshness/permission/visibility diagnostics, docs/skills guidance, temp
  root-child-grandchild smoke, and closeout.
- The implementation handoff should start at `task-172`.

# Decision

`epic-21` is implementation-ready after the current dirty tree is committed.
No additional planning nodes are needed before coding begins.

# Links / Artifacts

- `epic-21`
- `task-172`
- `task-173`
- `task-174`
- `task-175`
- `task-176`
- `task-177`
- `task-178`
- `task-179`
- `task-180`
