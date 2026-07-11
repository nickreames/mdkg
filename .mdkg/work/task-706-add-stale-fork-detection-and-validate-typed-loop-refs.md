---
id: task-706
type: task
title: Add stale fork detection and validate typed loop refs
status: done
priority: 1
epic: epic-227
prev: task-705
next: task-707
tags: [loop, provenance, validation, stale]
owners: []
links: []
artifacts: []
relates: [goal-61, test-379]
blocked_by: []
blocks: [task-707]
refs: [test-379]
context_refs: [goal-61, epic-227, edd-70, dec-67, edd-66]
evidence_refs: [chk-412]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Record sufficient template provenance on forks to detect source drift and
validate all typed readiness/lineage refs without silently changing the fork.

# Acceptance Criteria

- New forks retain template identity and deterministic source hash.
- List/show/plan expose current, stale, missing-template, and unknown states.
- Stale warnings are additive and do not block or rewrite existing forks.
- Typed refs resolve to allowed node kinds and applicable requirement identities.

# Files Affected

List files/directories expected to change.

- Loop fork/provenance and validation logic
- Seed/template metadata and command-output tests

# Implementation Notes

- Template path movement alone must not create avoidable false positives.
- Re-fork or promotion remains an explicit operator action.

# Test Plan

Run `test-379` across unchanged, modified, missing, and moved template scenarios,
plus wrong-kind and missing typed refs.

# Links / Artifacts

- `edd-70`
- `dec-67`
