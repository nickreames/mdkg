---
id: task-774
type: task
title: Build exact 51-finding remediation matrix and targeted regression suite
status: done
priority: 0
epic: epic-245
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: [security/v0.5.0-remediation-matrix.json, scripts/verify-security-remediation.js, tests/security-remediation.test.mjs]
relates: [goal-69]
blocked_by: [task-764, task-765, task-767, task-768, task-769, task-770, task-771, task-772, task-773]
blocks: []
refs: [edd-75, dec-80, test-433]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Create the release-blocking closure ledger that proves all 51 findings are owned,
implemented, and directly tested. This is the authoritative completeness check,
not a summary of representative root causes.

# Acceptance Criteria

- Record exactly 51 unique candidate IDs: 5 high, 28 medium, 18 low.
- Map each ID to one owning task (`task-764` through `task-773`), affected sink,
  fix/rejection evidence, one or more direct regression refs, and closure status.
- Fail verification on missing IDs, duplicates, unresolved rows, absent tests, or
  severity/count drift without accepted evidence.
- Preserve source scan target/revision and classifier-reporting limitation as
  provenance; do not depend on temporary paths for durable truth.
- `test-425` through `test-433` pass before this task closes.

# Files Affected

List files/directories expected to change.

- Source-controlled security remediation matrix/fixture under an appropriate
  docs or test-owned location selected during implementation
- Focused unit/integration/smoke tests owned by prior tasks
- A deterministic matrix verifier wired into prepublish checks

# Implementation Notes

- Candidate IDs are evidence identities, not public API.
- A shared patch can appear on multiple rows; each row still needs direct proof.
- Reclassification requires exact counterevidence and must not silently reduce the
  original count.

# Test Plan

Run the matrix verifier against missing, duplicate, unresolved, and complete
fixtures; then run all targeted tests and compare the resulting unique ID and
severity counts to 51/5/28/18. Record a test-proof checkpoint.

# Links / Artifacts

- `goal-69`, `epic-245`, `test-425` through `test-433`
- Owning tasks `task-764` through `task-773`
