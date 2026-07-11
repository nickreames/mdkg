---
id: task-749
type: task
title: implement project memory discovery and bounded materialization receipts
status: todo
priority: 1
parent: goal-66
prev: task-748
next: task-750
tags: [goal-66, project-memory, receipt, redaction]
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
updated: 2026-07-11
---

# Overview

Implement required/optional/forbidden `.mdkg` discovery and deterministic
success/failure receipts without indexing or executing cloned content.

# Acceptance Criteria

- Required demands config plus passing non-mutating validation.
- Optional accepts absence but rejects malformed discovered project memory.
- Forbidden rejects `.mdkg` presence.
- JSON failures emit schema, correlation, bounded reason code, hashes, policy
  outcomes, cleanup state, and nonzero exit without raw Git/repo/auth output.
- Local absolute repository refs are redacted to bounded labels plus hashes;
  destination evidence is root-relative.

# Files Affected

- Discovery, receipt, validation, and negative fixture surfaces.

# Implementation Notes

Discovery must call internal non-mutating validation behavior and must not run
`index`, scripts, hooks, skills, or repository commands.

# Test Plan

- `test-414`

# Links / Artifacts

- `dec-77`
