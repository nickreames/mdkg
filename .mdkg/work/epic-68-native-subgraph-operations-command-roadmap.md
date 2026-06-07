---
id: epic-68
type: epic
title: native subgraph operations command roadmap
status: todo
priority: 2
tags: [subgraph, audit, upgrade-plan, capability-sync, roadmap]
owners: []
links: []
artifacts: []
relates: [goal-12, edd-16, dec-29]
blocked_by: []
blocks: [task-316, task-317, task-318, task-319, task-320, task-321, test-125, test-126, test-127, test-128]
refs: [edd-16, dec-29]
aliases: [subgraph-operations-roadmap, subgraph-audit-upgrade-plan-roadmap]
skills: []
created: 2026-06-07
updated: 2026-06-07
---
# Goal

Plan native mdkg command support for subgraph audits, upgrade plans, capability
sync summaries, strict validation, and receipt-backed refresh workflows.

# Scope

- `mdkg subgraph audit --all --json`
- `mdkg subgraph upgrade-plan --all --json`
- Capability sync summaries across root and subgraphs.
- Strict subgraph validation modes.
- Refresh receipt helpers that preserve child repo ownership boundaries.

# Milestones

- `task-316`: current surface audit.
- `task-317`: subgraph audit command design.
- `task-318`: upgrade-plan command design.
- `task-319`: capability sync summary design.
- `task-320`: strict validation and refresh receipt design.
- `task-321`: close implementation handoff.

# Out of Scope

- No implementation in the 0.3.0 publish lane.
- No downstream project mutation.
- No child repository commits or pushes.

# Risks

- Commands could encourage root-owned child graph mutation.
- Refresh helpers could imply bundle refresh without accepted child evidence.
- Cross-subgraph capability summaries could leak private node text if visibility
  boundaries are not preserved.

# Links / Artifacts

- `goal-12`
- `edd-16`
- `dec-29`

# Completion Evidence

Pending.
