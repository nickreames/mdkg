---
id: task-773
type: task
title: Harden Git operands parser shapes and prototype-safe workspace aliases
status: done
priority: 1
epic: epic-244
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

Harden two remaining input-shape boundaries: Git operands must not be interpreted
as options while receipts call them remotes/branches, and workspace aliases must
not collide with JavaScript object prototypes.

# Acceptance Criteria

- Close exactly `cand-review-005-001` and `cand-review-009-006`.
- Reject option-like Git remote/ref/branch operands or place a proven `--` boundary
  where the Git subcommand supports it; receipt semantics match executed argv.
- Store and query workspace aliases in prototype-safe structures with exact type
  and portable alias validation.
- Invalid inputs fail with stable usage/validation errors rather than crashes or
  altered Git semantics.

# Files Affected

List files/directories expected to change.

- Git command argument builders and receipt sanitizers
- Config/frontmatter/index workspace alias parsing and validation
- Focused CLI/parser tests

# Implementation Notes

- Continue using argument-array subprocess execution; do not introduce a shell.
- Verify each relevant Git subcommand's end-of-options semantics rather than
  assuming one global placement.
- Use `Map` or null-prototype records consistently across readers and writers.

# Test Plan

Test option-like, empty, malformed, and valid Git operands with a fake Git harness;
test `__proto__`, `constructor`, `prototype`, and valid aliases across index and
validation routes. Run Git/config/graph tests and `test-432`.

# Links / Artifacts

- `epic-244`, `test-432`
