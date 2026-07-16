---
id: task-749
type: task
title: implement project memory discovery and bounded materialization receipts
status: todo
priority: 1
parent: goal-66
prev: task-748
next: task-750
tags: [goal-66, project-memory, receipt, redaction, validation]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-748]
blocks: [task-750]
refs: [goal-66, dec-77]
context_refs: [edd-73]
evidence_refs: []
aliases: [materialize-discovery-receipts]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Implement `required|optional|forbidden` `.mdkg` discovery and deterministic
success/failure receipts without indexing, executing, or retaining cloned
content.

# Acceptance Criteria

- `required` demands `.mdkg/config.json` and passing non-mutating validation;
  `optional` accepts absence but rejects malformed discovered memory; and
  `forbidden` rejects any `.mdkg` directory.
- Discovery uses current mdkg validation internals in a no-persist mode and does
  not write indexes, events, project DB state, packs, bundles, or skill mirrors.
- Discovery never executes repository scripts, hooks, skills, package managers,
  provider commands, or cloned binaries.
- Success and JSON failure receipts follow the frozen schema and include only
  bounded refs, hashes, identity/policy outcomes, cleanup state, and reason
  codes with deterministic ordering.
- Local absolute repository refs become bounded labels plus hashes;
  destinations remain root-relative; raw Git/repo/auth output is excluded.

# Test Plan

- `test-414`
- installed-package cases in `test-415`

# Completion Evidence

- Attach discovery-mode, mutation-absence, receipt-bound, and redaction proof.

# Files Affected

- Materialization discovery, validation projection, receipt serialization, and
  negative fixtures.

# Implementation Notes

- Reuse non-persisting graph validation APIs; do not invoke the cloned CLI or
  hydrate its generated indexes.

# Links / Artifacts

- `dec-77`, `test-414`, and `test-415`.
