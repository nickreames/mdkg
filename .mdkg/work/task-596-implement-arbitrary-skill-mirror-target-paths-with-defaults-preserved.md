---
id: task-596
type: task
title: implement arbitrary skill mirror target paths with defaults preserved
status: todo
priority: 1
epic: epic-199
parent: goal-41
tags: [0.3.9, skill-mirrors, config, agents, claude]
owners: []
links: []
artifacts: [src/commands/skill_mirror.ts, src/commands/init.ts, CLI_COMMAND_MATRIX.md]
relates: []
blocked_by: [task-594]
blocks: [test-303, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Make skill mirrors configurable as arbitrary repo-local paths while preserving
the existing `.agents/skills` and `.claude/skills` defaults.

# Acceptance Criteria

- Config can declare additional mirror target paths.
- `mdkg skill sync`, audit, and prune behavior respects configured targets.
- Unsafe or outside-repo paths fail closed.
- Existing default mirrors remain unchanged for `init --agent`.

# Files Affected

- `src/commands/skill_mirror.ts`
- `src/commands/init.ts`
- config schema and focused tests
- CLI docs/help snapshots as required

# Implementation Notes

- Do not require custom targets to be named agent surfaces.
- Mirror outputs remain generated projections; `.mdkg/skills/` stays canonical.
- Keep default product wrappers as compatibility behavior.

# Test Plan

- Temp-repo smoke with a custom mirror path.
- Regression smoke for `.agents/skills` and `.claude/skills`.
- `test-303`

# Links / Artifacts

- `dec-52`
- `edd-56`
