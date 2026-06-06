---
id: chk-55
type: checkpoint
title: SPEC template backcompat plan
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-277-define-spec-template-migration-and-backcompat-plan.md]
relates: [task-277]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-277]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-277` defined the SPEC template migration and backcompat plan for goal-8.
The plan keeps existing consumers valid, uses compatibility warnings before
strict errors, preserves downstream-local extensions, and requires upgrade
dry-run evidence before applying richer template behavior.

# Scope Covered

- Current upgrade/template source anchors.
- Current, compat, strict, and downstream-local compatibility modes.
- Migration rules for existing `spec` nodes, default scaffolds, rich templates,
  new frontmatter keys, removed/renamed keys, and product-specific extensions.
- Upgrade dry-run receipt expectations.
- Template promotion order.
- Downstream extension preservation policy.
- Future validation/test expectations.
- Release note boundary for SPEC template behavior changes.

# Decisions Captured

- `mdkg upgrade` remains preview-first; `--apply` is the only mutating path.
- Existing minimal SPEC consumers remain valid or receive clear compatibility
  diagnostics before strict enforcement.
- Rich `.SPEC.md` templates and default scaffolds must not diverge silently.
- Customized local templates and downstream extension schemas are preserved.
- Product-specific extension keys do not enter canonical mdkg templates,
  examples, or seeded assets.

# Implementation Summary

Only mdkg graph/design state changed. `task-277` now carries the migration and
backcompat contract, and `edd-14` gained `spec-backcompat-plan` as a
design-level discovery alias.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "spec backcompat plan" --json`
- `node dist/cli.js help upgrade`
- Product-name grep over `task-277`
- `git diff --check`

# Known Issues / Follow-ups

- `task-278` must define root and downstream SPEC adoption after mdkg
  acceptance/publication.
- `test-105` must validate release and adoption readiness.
- Source migration implementation remains deferred.

# Links / Artifacts

- `goal-8`
- `task-277`
- `epic-51`
- `edd-14`
