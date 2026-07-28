---
id: task-29
type: task
title: Verify Demo 3 zero-edit lineage and public-safe pack
status: done
priority: 1
epic: epic-6
parent: goal-6
prev: task-28
next: task-30
tags: [ai-native-sdlc, presentation-demo, phase-6, step-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/readiness-pack-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-28]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-28]
evidence_refs: [task-28, chk-23]
aliases: [phase-6-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Verify the Demo 3 child chain and public-safe context pack. This is step 6 of
13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Verify task-28's already-forked Demo 3 identity without changing it.
- Verify the source-release hash, run-binding hash, bootstrap/materializer
  version, authored-content equality, interface manifest, and immutable
  child-contract seal as one lineage chain.
- Prove the complete child chain and public-safe concise pack.
- Verify that the pack contains the downstream Git/dependency/provider
  preflight, allowlist, hard-blocker, quiet-window, and dry-rehearsal contracts
  without executing any of them in this node.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-30 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-6 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Demo 3 source-release, binding, seal, executed-state contrast, graph
  validation, routing, and concise pack pass.
- The pack identifies `examples/website-demo-template/.mdkg/:goal-1` as the
  reusable source and `runs/demo-003/.mdkg/:goal-1` as its bound writable
  execution instance.
- The source, manifest, and sendoff hashes equal test-25's verified identities;
  no pre-refinement Goal 2 hash is silently substituted.
- The only execution chain is positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint.
- The first actionable child node, every source-authored role/QID,
  deterministic receipt path,
  timing budget, designated harness, warm dependency, portable component,
  stage owner, handoff boundary, and required skill resolve from the child
  interface manifest.
- Write `readiness-pack-receipt.json` with exact node inventory, skills,
  token/truncation result, public-safety scan, source/binding/seal hashes,
  authored-content equality, and proof that implementation evidence is empty.
- Verify the run binding is immutable, the positioning node records a decision
  artifact rather than editing the graph contract, and authority remains an
  external hash-bound reference.
- No child implementation node has executed.
- No downstream preflight, provider, or rehearsal side effect belongs to this
  pack-only verification node.

# Results / Evidence

- Verified the exact semantic release, binding, bootstrap receipt, child
  interface, immutable seal, and byte-identical authored goal as one lineage.
- Built a 19-node concise pack rooted at `spike-1` with the full chain,
  designs, source checkpoint, and four required skills; estimated size is
  3,116 tokens with no truncation.
- Scanned the pack for credential/secret markers and confirmed it contains no
  approval, writable authority, or raw provider payload.
- Confirmed `spike-1` remains the first actionable node, all child artifacts
  and execution evidence remain empty, and no downstream preflight or
  provider action occurred.
- Exact evidence is in
  `artifacts/demo-003/readiness-pack-receipt.json`.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
