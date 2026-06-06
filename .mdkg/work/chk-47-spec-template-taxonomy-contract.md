---
id: chk-47
type: checkpoint
title: SPEC template taxonomy contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-269-define-spec-layout-naming-and-template-taxonomy.md, .mdkg/templates/specs]
relates: [task-269]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-269]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-269` defined the canonical SPEC layout, naming, and template taxonomy for
goal-8. It reconciles the active default scaffold with the richer
`.mdkg/templates/specs` family while deferring actual template/source changes.

# Scope Covered

- Canonical template location under `.mdkg/templates/specs`.
- First-family template list and kind names.
- Filename, `template_kind`, extension, and generic URI naming rules.
- Default scaffold reconciliation and future promotion path.
- Coverage policy that hands detailed fixture requirements to `task-270`.

# Decisions Captured

- `.mdkg/templates/default/spec.md` remains the active scaffold/schema source
  until a later implementation task changes it.
- `.mdkg/templates/specs/*.SPEC.md` remains the richer authoring/design family.
- Multi-word filenames use kebab case; metadata `template_kind` uses lower
  snake case.
- Product-specific names and URI schemes stay out of canonical mdkg templates.

# Implementation Summary

Only mdkg graph state changed. `task-269` now carries the template taxonomy and
promotion policy as durable design evidence.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js capability search "SPEC template taxonomy" --json`
- Product-name grep over `.mdkg/templates/specs` and the task node
- `git diff --check`

# Known Issues / Follow-ups

- `task-270` must define positive and negative example fixture coverage.
- Later implementation must reconcile `{{spec_id}}` with the active `{{id}}`
  scaffold placeholder before promotion.
- Seeded init assets should wait until template and diagnostics policy is
  complete.

# Links / Artifacts

- `goal-8`
- `task-269`
- `epic-47`
- `.mdkg/templates/specs`
