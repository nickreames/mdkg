---
id: epic-194
type: epic
title: audit SPEC surfaces and lock MANIFEST compatibility policy
status: todo
priority: 1
tags: [manifest, spec, audit, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-37, edd-54, dec-50]
blocked_by: []
blocks: [task-573, task-574]
refs: [edd-54, edd-14, dec-26, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-rename-audit, spec-surface-audit, manifest-compatibility-policy]
skills: []
created: 2026-06-25
updated: 2026-06-25
---
# Goal

Establish the exact implementation surface and compatibility policy before any
source rename work begins.

# Scope

- Inventory source, tests, templates, fixtures, docs, generated references,
  skills, examples, and command help that currently mention `SPEC.md` or
  `spec`.
- Compare current behavior to `edd-54` and `dec-50`.
- Decide the compatibility warning text, command-family policy, and release
  window.

# Milestones

- `task-573`: current surface audit.
- `task-574`: compatibility bridge and release policy.

# Out of Scope

- No source implementation.
- No docs/template rename before parser and validation behavior is planned.

# Risks

- Under-auditing generated assets would leave stale SPEC-first public text.
- Deciding command names too late could force rework in docs and tests.

# Links / Artifacts

- `goal-37`
- `edd-54`
- `dec-50`
- external links
