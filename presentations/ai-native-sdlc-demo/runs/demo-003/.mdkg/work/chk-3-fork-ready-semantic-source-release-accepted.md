---
id: chk-3
type: checkpoint
title: Fork-ready semantic source release accepted
checkpoint_kind: handoff
status: done
priority: 1
tags: [demo, source-release, semantic-identity, accepted]
owners: [source-template-owner]
links: []
artifacts: [README.md, DEMO_HANDOFF_PROMPT.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, epic-1, prd-2, edd-1, dec-1, dec-2, spike-1, task-1, test-1, task-2, test-2, task-3, test-3]
context_refs: [goal-1, epic-1, prd-2, edd-1, dec-1, dec-2]
evidence_refs: [chk-2]
aliases: [fork-ready-source-release-accepted]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
scope: []
created: 2026-07-28
updated: 2026-07-28
---
# Summary

The reusable website-demo source now contains the complete generic
positioning-to-production topology, semantic source/run-binding boundaries,
portable static output, serial build-once validation, fail-closed external
authority, and deterministic evidence contracts. This checkpoint accepts the
authored source contract; it does not execute or authorize any bound run.

# Scope Covered

- `goal-1`, `epic-1`, `prd-2`, `edd-1`, `dec-1`, and `dec-2`
- `spike-1 → task-1 → test-1 → task-2 → test-2 → task-3 → test-3`
- operator README and handoff prompt

# Decisions Captured

- Static Astro, portable output, and zero client JavaScript remain fixed.
- Run-specific identity comes from an immutable binding, not authored graph
  edits.
- Generated runtime state is excluded from semantic source identity.
- Shared-source and publication topology is inert until matching caller-owned
  lease/authority receipts exist.

# Implementation Summary

Future bootstraps consume the semantic source release plus an immutable binding
and emit an exact authored child, operator inventory, child interface, and
authored contract seal. The child later records mutable work and evidence
without invalidating that seal.

# Verification / Testing

The program-owned Task 47 and Test 25 must record the final release manifest,
binding schema, bootstrap hashes, two distinct absent-target fixtures,
verify-only repeats, tamper classifications, pack coverage, and cleanup. This
checkpoint is context for those tests, not a substitute for them.

# Known Issues / Follow-ups

- No bound run has executed.
- No shared-source, Git, publication, deployment, or provider authority is
  stored here.

# Links / Artifacts

- `goal-1`
- `prd-2`
- `edd-1`
- `dec-1`
- `dec-2`
- `README.md`
- `DEMO_HANDOFF_PROMPT.md`
