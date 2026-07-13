---
id: task-769
type: task
title: Enforce typed loop approvals evidence child lanes and normalized actions
status: done
priority: 1
epic: epic-243
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
# Overview

Repair loop readiness and routing so only exact, completed, typed graph authority
can satisfy an action, evidence lane, approval, or child completion requirement.

# Acceptance Criteria

- Close exactly `cand-review-009-002`, `cand-review-012-006`,
  `cand-review-012-007`, `cand-review-012-008`, and `cand-review-012-009`.
- Normalize action identifiers before matching approvals and prohibitions.
- Require the exact child ref and acceptable completion state for each lane.
- Require evidence refs of the configured kind/status and approvals backed by the
  required typed decision/approval state; URI existence alone is insufficient.
- `loop plan` and `loop next` agree and never authorize gated work while required
  approval remains pending.

# Files Affected

List files/directories expected to change.

- Loop metadata parsing, readiness projection, plan, next, and fork command logic
- Descriptor/help contracts where authority is surfaced
- Loop fixtures and focused regression tests

# Implementation Notes

- Preserve one `loop` node type and current status vocabulary.
- Keep read-only/planning loop defaults; runtime execution remains outside mdkg.
- Error output should identify the exact unsatisfied lane/ref.

# Test Plan

Test case variants, conflicting prohibitions, unrelated completed nodes, wrong-kind
evidence, incomplete evidence, unverified URIs, pending approvals, and mixed
authorized/blocked lanes. Run loop unit/smoke/CLI contract tests and `test-429`.

# Links / Artifacts

- `epic-243`, `edd-75`, `dec-80`, `test-429`
