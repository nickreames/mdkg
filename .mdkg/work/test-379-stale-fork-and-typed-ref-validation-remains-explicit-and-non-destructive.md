---
id: test-379
type: test
title: Stale fork and typed ref validation remains explicit and non destructive
status: done
priority: 1
epic: epic-227
tags: [loop, provenance, validation, stale]
owners: []
links: []
artifacts: [node --test dist/tests/commands/loop.test.js dist/tests/graph/node.test.js dist/tests/graph/validate_graph.test.js (47/47 pass)]
relates: [goal-61, task-706]
blocked_by: []
blocks: []
refs: [task-706]
context_refs: [goal-61, epic-227, edd-70, dec-67]
evidence_refs: [chk-412]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Verify provenance drift is visible and typed refs are valid without automatic
fork rewriting.

# Target / Scope

`task-706`; template identity/hash, list/show/plan warnings, and ref validation.

# Preconditions / Environment

Template/fork fixtures for unchanged, changed, missing, and relocated sources.

# Test Cases

- Confirm current versus stale projection after content changes.
- Confirm missing source and unknown legacy provenance diagnostics.
- Prove inspection does not modify fork content.
- Reject missing/wrong-kind/inapplicable typed refs clearly.

# Results / Evidence

PASS on 2026-07-10. Current, stale, missing-template, and unknown provenance
states are explicit; stale forks warn without rewriting content. Wrong-kind,
missing, malformed, duplicate, and incomplete typed bindings fail validation.
Evidence: `chk-412`.

# Notes / Follow-ups

- Automatic reconciliation is out of scope.
