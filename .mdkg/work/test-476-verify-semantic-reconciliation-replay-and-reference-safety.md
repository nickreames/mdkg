---
id: test-476
type: test
title: Verify semantic reconciliation replay and reference safety
status: todo
priority: 1
parent: goal-82
tags: [alignment-002, planning-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-822]
blocks: []
refs: [edd-81, goal-82, goal-17, test-151]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Prove safe semantic integration, stable alias mappings and replay behavior.
Future verification only; all fixture mutations require implementation approval.

# Target / Scope

task-819 and task-822, using Goal 17 add/add tests as historical foundations.

# Preconditions / Environment

Three-way disposable fixtures with explicit ancestor, target and incoming
revisions. Track authored paths, generated paths, immutable receipts, ignored
execution state and unrelated sentinel paths separately.

# Test Cases

| Case | Required result |
| --- | --- |
| Independent add/add same alias | Two identities survive; accepted target alias retained |
| Same-node modify/modify | One identity, ancestor-aware comparison, never artificial split |
| Conflicting lifecycle/evidence | Explicit decision; no timestamp or done-wins policy |
| Delete/modify and rename | Clear conflict/origin handling rather than duplicate fabrication |
| Cross-linked incoming nodes | Complete mapping before writes, every edge reaches intended node |
| Substring and ambiguous references | task-1 does not alter task-10; unknown provenance blocks |
| External historical receipts | Original bodies/hashes unchanged; revision-qualified maps provide interpretation |
| Repeated integration | Stable mapping and no new aliases for the same identities |
| Cherry-pick | Identical identity/content deduplicates; divergence is reported |
| Revert/reintroduction | Historical identity preserved without silent resurrection |
| Stale reviewed plan | Input/hash mismatch fails before writes |
| Partial failure | Receipt names completed writes; bounded recovery preserves unrelated edits |
| Generated state | Rebuilt only from valid authored result; bundles/execution state excluded |
| Git side effects | Staging/index bytes unchanged by default; no Git history operation |
| Strict validation | Apply receipt cannot claim success from tolerant parsing alone |

# Results / Evidence

Pending. Capture plan/receipt hash, maps, before/after authored manifests, unchanged
external receipts, Git index state and strict validation outcomes for every case.

# Notes / Follow-ups

A passing initial conflict-classifier test does not complete goal-82. test-151
independently owns observational preview and authority-boundary assertions.
