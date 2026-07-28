---
id: test-15
type: test
title: Verify Demo 3 source binding seal routing and concise pack
status: done
priority: 1
epic: epic-6
parent: goal-6
prev: task-33
next: test-16
tags: [ai-native-sdlc, presentation-demo, phase-6, step-11]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/readiness-routing-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-33]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-33]
evidence_refs: []
aliases: [phase-6-step-11]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [source_release, immutable_binding, authored_equality, child_contract_seal, child_chain, public_safe_pack, external_event_authority, no_execution]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Validate Demo 3 source-to-run lineage, zero-edit authored identity, external
event authority, routing, and concise pack as step 11 of Goal 6.

# Target / Scope

- goal-6
- epic-6
- task-33

# Preconditions / Environment

- Goal 6 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Demo 3 source release, run binding, bootstrap/materializer, immutable child
  seal, graph validation, routing, and concise pack pass.
- Demo 3 authored goal/design/work/operator content equals the accepted source
  release; only binding, interface, empty runtime state, and receipts differ.
- The human-accepted event authority resolves the same source release,
  run binding, immutable child seal, preflight, allowlist, sendoff,
  prospective range policy,
  preparation-baseline handoff, and lease.
- The authority inventories later Goal 6/7 local-evidence-only graph/status/
  event/test/checkpoint/index/bundle/projection and umbrella receipt paths,
  including task-58 publication/activation outputs; excludes them from every
  publication; separately freezes child-run/canonical staged paths; and
  invalidates on any bound functional hash change.
- No child implementation node has executed.
- The child contains only a read-only authority reference. The authoritative
  human approval, lease, allowlist, baseline, provider state, and validity
  window remain external and hash-bound.
- Git, dependencies, provider read access, and both project identities are visible without storing credentials.
- Sendoff text, allowlist, attempt/time bound, hard blockers, quiet window, and fallback are sealed.
- One designated harness, warm dependencies, portable output/thin wrapper,
  build-once validation, fast verifier, exact first node, required skills, and
  timing telemetry resolve without truncation.
- Dry rehearsal creates no implementation, commit, push, deployment, or provider change.
- This test specifically proves: Verify Demo 3 readiness routing and concise pack.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Write `artifacts/demo-003/readiness-routing-receipt.json` with pass/fail
per case, commands, hashes, exact pack inventory, timing/authority identities,
warnings, and follow-up refs.

# Notes / Follow-ups

- `readiness-routing-receipt.json` records all eight cases as passing;
  SHA-256
  `6bc386c600dd3edad68ab381113a94b152bcb7128b651a3a6a3b7c83dcd53d56`.
- Its filename was reconciled to the exact local-evidence-only receipt
  inventory before Goal 6 closeout; the receipt content and kind record this
  naming correction without changing any accepted functional or authority
  hash.
- Hashes that identify the dry receipt are explicitly labeled as Test 15
  observations; Test 17 later appends its independent verification to the
  already inventoried dry receipt without creating a circular hash dependency.
- Verify-only initially classified the two ignored Task 29 pack caches as
  whole-target `inventory_drift`. Those generated caches are explicitly
  mutable and excluded from authored identity. Their accepted hashes remain in
  `readiness-pack-receipt.json`; removing only those two caches restored the
  canonical verify-only result without changing source, materializer,
  authority, or any authored child file.
- Both concise and standard child packs resolve 19 required nodes, the complete
  seven-node work chain, and all four full required skills without truncation
  or persistent pack output.
- All 103 authored child entries match the accepted bootstrap receipt. The
  binding, interface, seal, authority, lease, allowlist, fallback, timing
  contract, and dry-rehearsal hashes are consistent.
- Demo 3 remains unexecuted: `todo/active`, `spike-1` next, zero site or
  artifact files, zero claims, zero runtime checkpoints, and zero tracked or
  nonignored child changes.
- A post-event materializer improvement should exclude runtime-mutable pack
  caches from whole-target verify-only comparison. That requires a new
  semantic source release and fresh authority; it was not changed here.
- Test 16 may begin.
