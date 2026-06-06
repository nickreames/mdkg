---
id: epic-51
type: epic
title: SPEC implementation sequencing and compatibility plan
status: done
priority: 1
tags: [spec, implementation-plan, compatibility, migration]
owners: []
links: []
artifacts: []
relates: [goal-8, task-276, task-277]
blocked_by: [epic-46, epic-48]
blocks: [task-276, task-277]
refs: [edd-14]
aliases: [spec-implementation-sequence, spec-backcompat-plan]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Plan source implementation ordering for SPEC parser, index, validation, and
template changes without changing source in this graph-only pass.

# Goal

Turn the SPEC design into an ordered future implementation plan.

# Scope

- Parser/index/validation sequencing.
- Compatibility rules.
- Template migration policy.

# Milestones

- Complete `task-276` and `task-277`.

# Acceptance Criteria

- Implementation phases are ordered.
- Existing templates and repositories have a compatibility path.
- Breaking changes require explicit migration tasks.

# Out of Scope

- Source implementation in this goal.

# Risks

- Implementation begins before diagnostics and compatibility are clear.

# Closeout Evidence

- `task-276` and `task-277` are done.
- `chk-54` and `chk-55` record implementation sequencing and backcompat
  closeout summaries.
- `node dist/cli.js capability search "spec implementation sequence" --json`
  and `node dist/cli.js capability search "spec backcompat plan" --json`
  resolve `edd-14`.
- Source implementation, package publish, and downstream upgrade work remain
  deferred.

# Links / Artifacts

- `goal-8`
- `task-276`
- `task-277`
