---
id: task-16
type: task
title: Materialize Demo 2 agent operator files and skills deterministically
status: backlog
priority: 1
epic: epic-4
parent: goal-4
prev: task-15
next: task-17
tags: [ai-native-sdlc, presentation-demo, phase-4, step-3]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/operator-materialization-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-15]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-15]
evidence_refs: []
aliases: [phase-4-step-3]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Materialize Demo 2 agent operator files and skills deterministically. This is step 3 of 9 in Goal 4; it owns only the outcome named here and the authority granted by goal-4.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-4.
- Consume the accepted `artifacts/demo-platform/operator-materialization-manifest.json` and task-15 fork receipt; do not infer operator files from the checkout.
- Consume task-15's `BOOTSTRAP_RECEIPT.json`, rerun the accepted wrapper in
  verify-only mode, and prove every required root-level operator file and both
  skill projection trees already exist at the manifest-relative target paths.
- Write `artifacts/demo-002/operator-materialization-receipt.json` with manifest hash, source/target paths, expected and actual SHA-256 values, file modes, projection parity, command, timestamp, and idempotent repeat result.
- Require verify-only inventory equality and zero overwritten files. Fail
  closed on a missing source, unexpected target, hash mismatch, partial skill
  projection, or any write outside the Demo 2 run root.
- Do not stage, commit, push, inspect deployments, or claim public availability.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-17 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-4 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Every required manifest entry exists at the target with the expected hash and mode.
- `.agents/skills` and `.claude/skills` contain the same accepted capability set and validate under the run's operator instructions.
- A second materialization pass is a no-op with identical inventory and hashes.
- No Git or provider side effect occurred.

# Links / Artifacts

- goal-4
- epic-4
- Evidence pending activation.
