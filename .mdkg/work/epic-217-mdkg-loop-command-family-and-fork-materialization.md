---
id: epic-217
type: epic
title: mdkg loop command family and fork materialization
status: todo
priority: 1
tags: [loop, cli, fork, materialization]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Expose semantic `mdkg loop` commands so users and agents can work with loop
state without creating raw graph nodes and edges by hand.

# Scope

- `mdkg loop list`, `show`, `fork`, `plan`, and `runs` or equivalent evidence
  inspection.
- Default child-node materialization on fork.
- Planning-only/no-child fork option.
- JSON output receipts suitable for agents.

# Milestones

- `task-678` implements provenance/materialization semantics.
- `task-682` implements the command surface.
- `test-353`, `test-354`, and `test-355` prove command and fork behavior.

# Out of Scope

- No runtime execution command.
- No model/tool/sandbox orchestration.

# Risks

- CLI could expose too much graph mechanics instead of semantic loop actions.
- Forking without dry-run/preview could create hard-to-review graph churn.

# Links / Artifacts

- `goal-58`
- `task-669`
- `task-672`
