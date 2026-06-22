---
id: epic-115
type: epic
title: strict doctor subgraph and handoff remediation UX
status: todo
priority: 1
tags: [doctor, subgraph, handoff, remediation, ux]
owners: []
links: []
artifacts: []
relates: [goal-23]
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
# Goal

Make warning and remediation output actionable for orchestrator agents running safe multi-repo mdkg workflows.

# Scope

- Explicit selected-achieved goal remediation.
- Clear DB runtime and archive storage warning guidance.
- Subgraph audit/sync wording that prefers child commit before root bundle refresh and discourages unsafe dirty sync.
- Handoff JSON receipts that expose pack/scope warnings without leaking raw content.

# Milestones

- Doctor remediation tests updated.
- Subgraph dirty/stale fixture wording updated.
- Handoff warnings become actionable receipt fields.

# Out of Scope

- No mutation of child repos.
- No promise of perfect secret scanning.

# Risks

- Overly terse remediation could cause agents to mutate the wrong repo.
- Handoff warnings must remain refs-only and sanitized.

# Links / Artifacts

- task-432
- test-194
