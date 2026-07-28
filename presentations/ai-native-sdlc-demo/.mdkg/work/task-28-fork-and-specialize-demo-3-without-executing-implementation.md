---
id: task-28
type: task
title: Fork and specialize Demo 3 without executing implementation
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-27
next: task-29
tags: [ai-native-sdlc, presentation-demo, phase-6, step-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/fork-receipt.json, artifacts/demo-003/source-goal-1.md, artifacts/demo-003/specialized-goal-1.md, artifacts/demo-003/specialization-receipt.json, artifacts/demo-003/child-interface-manifest.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-27, spike-6, task-47, test-25]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-27, spike-6, task-47, test-25, chk-17]
evidence_refs: [test-25]
aliases: [phase-6-step-5]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Fork and specialize Demo 3 without executing implementation. This is step 5
of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Apply only evidence-backed rehearsal findings and freeze deck and interface hashes.
- Consume test-25's exact verified source, manifest, wrapper, and sendoff hashes.
  From the repository root run the accepted bootstrap transaction for
  `presentations/ai-native-sdlc-demo/runs/demo-003`, require its embedded
  canonical command to remain
  `mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-003 --start-goal goal-1 --json`,
  preserve local ID `goal-1`, and specialize that writable copy without
  executing implementation.
- Bind source hash, fork receipt, source goal snapshot, specialized goal snapshot, and target root in public-safe evidence.
- Materialize operator files from the manifest verified by test-25, record
  source/target SHA-256 values, and fail closed on existing-target,
  source-drift, ID-drift, projection-parity, or validation errors.
- Materialize exactly this child chain without completing any node: positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint.
- Leave the positioning spike `todo`, every successor `backlog`, the accepted checkpoint absent/pending, and all implementation/publication evidence empty; record these invariants in the specialization receipt.
- Write `artifacts/demo-003/child-interface-manifest.json` mapping each chain role to its allocated child node ID/QID, owner role, predecessor/successor, expected status, authoritative receipt path, and completion evidence; tasks 34–39 may consume only this manifest's paths.
- Materialize the exact run-local sendoff and hash, designated single harness,
  warm-dependency identity, timing contract, stage owners, handoff boundaries,
  portable-output role, deterministic receipt paths, and required telemetry in
  the child interface manifest.
- Prove the complete child chain and public-safe concise pack.
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

# Test Plan

- Demo 3 source identity, specialized contrast, graph validation, routing, and concise pack pass.
- No child implementation node has executed.
- The child interface encodes one designated harness, warm dependencies, the
  global deadline, required telemetry, and no implementation evidence.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
