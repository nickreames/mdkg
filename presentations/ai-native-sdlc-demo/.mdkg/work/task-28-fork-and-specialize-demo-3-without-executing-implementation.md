---
id: task-28
type: task
title: Materialize zero-edit Demo 3 from source and run binding
status: done
priority: 1
epic: epic-6
parent: goal-6
prev: task-27
next: task-29
tags: [ai-native-sdlc, presentation-demo, phase-6, step-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/run-binding.json, artifacts/demo-003/fork-receipt.json, artifacts/demo-003/source-goal-1.md, artifacts/demo-003/bound-goal-1.md, artifacts/demo-003/materialization-receipt.json, artifacts/demo-003/child-interface-manifest.json, artifacts/demo-003/immutable-child-contract-seal.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-27, spike-6, task-47, test-25]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-27, spike-6, task-47, test-25, chk-17]
evidence_refs: [test-25]
aliases: [phase-6-step-5]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Freeze Demo 3's run binding, materialize one exact authored-content source
fork, seal its immutable contract, and stop before execution. This is step 5
of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Freeze the exact Demo 3 run binding with ID, target root, routes, component
  key, bounded positioning brief, designated harness, timing profile, and
  receipt destinations. It contains no approval, lease, credentials, provider
  payload, origin state, or writable authority.
- Consume test-25's exact verified source, manifest, wrapper, and sendoff hashes.
  From the repository root run the accepted bootstrap transaction for
  `presentations/ai-native-sdlc-demo/runs/demo-003`, require its embedded
  canonical command to remain
  `mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-003 --start-goal goal-1 --json`,
  preserve local ID `goal-1`, and attach the immutable binding without
  rewriting the authored graph or executing implementation.
- Bind semantic source release, run-binding hash, bootstrap/materializer
  identity, fork receipt, source goal snapshot, bound unexecuted goal snapshot,
  target root, child-interface manifest, and immutable contract seal in
  public-safe evidence.
- Materialize operator files from the manifest verified by test-25, record
  source/target SHA-256 values, and fail closed on existing-target,
  source-drift, ID-drift, projection-parity, or validation errors.
- Require the source-authored chain without adding or rewriting nodes:
  positioning spike -> implementation task -> local test -> integration task
  -> canonical-site test -> publish task -> exact-SHA/live-URL test ->
  accepted checkpoint.
- Preserve the source-authored readiness states exactly: positioning,
  portable implementation, and local validation are `todo`; caller-authorized
  integration, canonical validation, publication, and live verification are
  `backlog`. Keep `spike-1` as the only first actionable node, the runtime
  checkpoint absent/pending, and all implementation/publication evidence
  empty; record these invariants in the materialization receipt.
- Write `artifacts/demo-003/child-interface-manifest.json` mapping each
  source-authored chain role to its preserved child node ID/QID, owner role,
  predecessor/successor, expected status, authoritative receipt path, and
  completion evidence; tasks 34–39 may consume only this manifest's paths.
- Write `immutable-child-contract-seal.json` over the semantic source release,
  run binding, goal condition, topology, role mapping, requirements, required
  skills, sendoff/authority references, allowed receipt paths, and forbidden
  surfaces. Explicitly exclude normal statuses, events, evidence, checkpoints,
  indexes, packs, and outputs from immutable identity.
- Materialize the exact run-local sendoff and hash, designated single harness,
  warm-dependency identity, timing contract, stage owners, handoff boundaries,
  portable-output role, deterministic receipt paths, and required telemetry in
  the child interface manifest.
- Prove the complete child chain and public-safe concise pack.
- Compare every authored graph/operator file with the accepted source and
  require equality. Any difference is a hard blocker: fix the source or
  binding, remove the target, and recreate it. Do not patch the child.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-29 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-6 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.
- Do not directly edit Demo 3 authored goal, design, work, test, skill, or
  operator content after the exact fork.

# Test Plan

- Demo 3 source-release, run-binding, bootstrap, authored-content equality,
  immutable-seal, graph validation, routing, and concise pack pass.
- No child implementation node has executed.
- The child interface encodes one designated harness, warm dependencies, the
  global deadline, required telemetry, and no implementation evidence.
- The positioning spike later creates the run-specific creative decision
  artifact without rewriting the immutable child contract.

# Results / Evidence

- Created `runs/demo-003/` exactly once from semantic release
  `49855648…5edf` and binding `95e1f33e…03e1`.
- Preserved all 103 authored entries, `goal-1`, the complete seven-node chain,
  first actionable `spike-1`, and zero-warning validation without child graph
  edits.
- Sealed child interface `a2942f6b…5e5a` and immutable contract
  `f3d1cf59…5946`; the raw bootstrap receipt is retained inside the child.
- Wrote public-safe fork, materialization, source/bound-goal, interface, and
  seal receipts under `artifacts/demo-003/`.
- No child node was claimed or started, no implementation or publication
  evidence exists, and no external authority was granted.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
