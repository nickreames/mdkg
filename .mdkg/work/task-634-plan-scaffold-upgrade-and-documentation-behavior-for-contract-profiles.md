---
id: task-634
type: task
title: plan scaffold upgrade and documentation behavior for contract profiles
status: todo
priority: 1
tags: [goal-48, upgrade, scaffold, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Plan how mdkg should expose any accepted contract-profile behavior through
scaffolds, upgrade receipts, docs, and generated references.

This task is explicitly about future behavior. The current seeded goal does not
edit templates, init assets, public docs, generated docs, skills, or package
metadata.

# Acceptance Criteria

- `mdkg new manifest|work|work_order|receipt` behavior is classified for any
  accepted profile fields or examples.
- `mdkg work contract/order/receipt` helper behavior is classified for field
  support, validation, and JSON receipts.
- `mdkg upgrade` dry-run/apply behavior is planned with customization
  preservation, safe-to-apply receipts, and explicit seed/default blast-radius
  gates.
- Docs, README, command matrix, generated CLI reference, release notes, and
  examples are listed as future update surfaces only after source behavior is
  proven.
- `assets/init/skills/default` and seed/default templates are not changed unless
  a later explicit mdkg-owned goal authorizes them.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future implementation candidates may include source/tests/docs/templates/init
  assets only after explicit authorization.

# Implementation Notes

- Preserve the current upgrade contract: preview first, apply only after
  reviewing `safe_to_apply`, `will_write_paths`, `preserved_customizations`,
  `blocking_conflicts`, and `apply_side_effects`.
- Plan generated reference refresh only after implementation tests pass.

# Test Plan

- `test-331`
- `mdkg upgrade --dry-run --json` in the later execution pass.
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `goal-48`
- `test-331`
