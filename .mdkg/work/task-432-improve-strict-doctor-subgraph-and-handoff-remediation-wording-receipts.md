---
id: task-432
type: task
title: improve strict doctor subgraph and handoff remediation wording receipts
status: done
priority: 1
epic: epic-115
parent: goal-23
tags: [doctor, subgraph, handoff, remediation]
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
updated: 2026-06-21
---
# Overview

Improve the commands that guide agents during multi-repo cleanup so warnings are actionable and do not nudge unsafe mutation.

# Acceptance Criteria

- `goal.selected_achieved` explains when to use `mdkg goal clear --json` versus selecting/creating a repo-local goal.
- DB runtime warnings identify expected local-only state when DB verification passes.
- Archive storage warnings give exact cleanup choices.
- Subgraph dirty/stale receipts recommend child commit before root sync and avoid unsafe `--allow-dirty` guidance.
- `handoff create --json` includes pack/scope warnings as receipt fields while keeping generated content sanitized.

# Files Affected

- src/commands/doctor.ts
- src/commands/subgraph.ts
- src/commands/handoff.ts

# Implementation Notes

- Keep root-qualified qids in subgraph contexts.
- Do not turn warning remediation into automatic repair.

# Test Plan

- Focused doctor, subgraph, and handoff unit tests.
- `npm run smoke:subgraph`
- `npm run smoke:handoff`

# Links / Artifacts

- test-194
