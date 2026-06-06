---
id: chk-45
type: checkpoint
title: SPEC section contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-267-define-required-and-optional-spec-sections.md]
relates: [task-267]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-267]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-267` defined the canonical SPEC body-section contract for goal-8. The
contract now separates always-required sections, conditional sections, optional
sections, and future validation diagnostics without changing source,
templates, or validator behavior.

# Scope Covered

- Required canonical full-SPEC sections.
- Conditional sections for queues/events, single-writer behavior, agents, APIs,
  runtime images, models, tools, integrations, and project/graph contracts.
- Optional sections that may clarify examples, fixtures, resource URI hints,
  migrations, and adoption notes.
- Future diagnostic severity policy for missing, blank, conditional, legacy,
  extra, or unsafe sections.

# Decisions Captured

- Canonical full SPECs should include required sections even when a section is
  intentionally `None`, `Read-only`, or `Deferred`.
- Conditional sections become required when SPEC kind, frontmatter, or body
  scope implies the behavior.
- Legacy minimal `SPEC.md` scaffolds should receive compatibility warnings
  until a later migration task changes the scaffold contract.
- Validator command surface, parser details, and template/frontmatter migration
  remain deferred to later goal-8 nodes.

# Implementation Summary

Only mdkg graph state changed. `task-267` now carries the section contract and
diagnostic policy as durable design evidence.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js capability search "SPEC section contract" --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-268` must define canonical SPEC frontmatter and compatibility rules.
- `task-269` must reconcile template layout, naming, and fixture coverage.
- `task-271` must define the future validation command surface and diagnostics.

# Links / Artifacts

- `goal-8`
- `task-267`
- `epic-46`
- `.mdkg/templates/specs/base.SPEC.md`
