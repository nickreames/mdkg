---
id: epic-243
type: epic
title: Repair loop authorization observational purity and workflow state
status: todo
priority: 1
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Goal

Restore exact workflow authority: loop decisions require typed completed evidence,
read-only routes remain observational, and imported/event/validation state keeps
complete identities and warning coverage.

# Scope

- Case-normalized loop actions and exact approval/prohibition conflict checks.
- Exact child-lane, evidence-kind/status, decision, and approval requirements.
- Non-persisting index projections for observational commands.
- Event/import identity and changed-only validation completeness.

# Milestones

- `task-769`: loop authority and routing.
- `task-770`: observational command purity.
- `task-771`: workflow/event/validation state.
- `test-429` through `test-431`: exact state-transition proof.

# Out of Scope

- New runtime execution authority in mdkg.
- New loop node kinds or broad generic CLI redesign.

# Risks

- Treating URI syntax or node existence as approval can preserve the bypass.
- In-memory rebuilds must remain deterministic and compatible with JSON/SQLite.
- Fixing warning scope must not produce unrelated changed-only noise.

# Links / Artifacts

- `goal-69`, `edd-75`, `dec-80`
- `task-769` through `task-771`
- `test-429` through `test-431`
