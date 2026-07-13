---
id: task-776
type: task
title: Manually requalify security remediation and Goal 64
status: done
priority: 0
epic: epic-245
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: [security/v0.5.0-remediation-matrix.json, scripts/verify-security-remediation.js, tests/security-remediation.test.mjs]
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80, dec-81, chk-509, chk-510]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Manually review the exact remediated candidate and its direct regressions,
confirm every original finding family is resolved, and hand Goal 64 back to its
first-push lane under the operator-approved `dec-81` verification method.

# Acceptance Criteria

- Record target commit, worktree digest/state, and reviewed finding families.
- Re-test every original candidate through the exact 51-row matrix.
- Review current source controls for containment, transported data, snapshots,
  loop authority, observational reads, resource bounds, and Git/parser safety.
- Zero original high, medium, or low finding remains unresolved; any failed row
  reopens its owning task and keeps Goal 64 paused.
- Record residual risk from replacing independent rediscovery with manual review.
- On success, close `test-434`, update `test-389`, clear `goal-69` from Goal 64 and
  `task-719`, reactivate Goal 64, and claim `task-719`.

# Files Affected

List files/directories expected to change.

- Manual review and test receipts
- `goal-69`, `goal-64`, `test-389`, `test-434`, and closeout checkpoint metadata

# Implementation Notes

- This task performs no external mutation beyond authorized read-only security
  access; push/publish remain in Goal 64.
- Use the prior candidate identities only as the completeness inventory; current
  source and passing direct tests are the proof.
- Record residual non-release-blocking hardening separately if any.

# Test Plan

Require exact closed coverage, zero unresolved original release blocker, the
full local prepublish receipt from `task-775`, the focused manual-review test
suite, valid graph state, and a goal-closeout checkpoint. Then run Goal 64
show/next and prove it routes to `task-719` only after all blockers are cleared.

# Links / Artifacts

- `goal-69`, `goal-64`, `task-718`, `task-719`
- `test-389`, `test-434`, `edd-75`, `dec-80`
