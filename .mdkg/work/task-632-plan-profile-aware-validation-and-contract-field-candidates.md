---
id: task-632
type: task
title: plan profile aware validation and contract field candidates
status: todo
priority: 1
tags: [goal-48, validation, profiles]
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

Plan profile-aware validation for generic mdkg agent workflow files before any
schema or validator implementation starts.

Candidate terms include `contract_profile`, `receipt_kind`, and
`redaction_class`. This task must decide whether they become generic fields,
profile-only conventions, aliases for current fields, warning-only metadata, or
rejected names.

# Acceptance Criteria

- Candidate field names are evaluated against existing generic fields:
  `resource_profile`, WORK `kind`, WORK_ORDER `artifact_policy`, RECEIPT
  `redaction_policy`, and current ref/hash lists.
- Profile-aware validation behavior is specified for at least MANIFEST, WORK,
  WORK_ORDER, and RECEIPT.
- Warning-vs-error behavior is defined for unknown profiles, unknown receipt
  kinds, invalid redaction classes, missing required refs, raw-content markers,
  and runtime-only fields.
- Compatibility posture is explicit: optional additive field, strict error,
  warning-only, deprecated alias, or docs-only convention.
- Runtime-specific Omni Room policy is not accepted as generic mdkg behavior
  without a recorded decision.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future implementation may require source/test/doc/template changes only after
  this plan is accepted in a later execution pass.

# Implementation Notes

- Start from the current validator enum sets and field descriptor rules in
  `src/graph/agent_file_types.ts`.
- Start from current raw-content warning behavior in `src/commands/validate.ts`
  and `mdkg work validate`.
- Avoid naming a future mdkg version; resolve the actual package version only
  during the later release execution pass.

# Test Plan

- `test-330`
- `mdkg validate --changed-only --json`

# Links / Artifacts

- `goal-48`
- `test-330`
