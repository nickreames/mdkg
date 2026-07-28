---
id: task-52
type: task
title: Materialize zero-edit Demo 4 from the accepted source
status: backlog
priority: 1
epic: epic-9
parent: goal-9
prev: test-26
next: task-53
tags: [ai-native-sdlc, presentation-demo, phase-9, step-4]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-004/run-binding.json, artifacts/demo-004/fork-receipt.json, artifacts/demo-004/source-goal-1.md, artifacts/demo-004/bound-goal-1.md, artifacts/demo-004/materialization-receipt.json, artifacts/demo-004/child-interface-manifest.json, artifacts/demo-004/immutable-child-contract-seal.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-9, epic-9, prd-1, edd-1, dec-3, dec-5, test-26]
context_refs: [goal-9, epic-9, prd-1, edd-1, dec-3, dec-5, test-26]
evidence_refs: [test-26]
aliases: [phase-9-step-4]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Freeze a new Demo 4 binding, create `runs/demo-004/` from the accepted semantic
source release without authored child edits, seal the child contract, and stop
before its first positioning node executes.

# Acceptance Criteria

- Use the deterministic bootstrap and exact semantic
  source/operator/binding-schema/sendoff hashes from test-26; preserve child
  local ID `goal-1`.
- Author a fresh immutable Demo 4 binding with new run ID, target, routes,
  component key, bounded positioning brief, designated harness, timing
  profile, and receipt destinations. Do not copy Demo 3's binding or authority.
- Require the complete positioning-to-production chain to come from the
  source. Materialize only deterministic operator files, run binding,
  child-interface manifest, materialization receipt, and immutable seal.
- Require authored goal/design/work/test/skill/operator equality with the
  accepted source; never patch the child.
- Leave the first child node `todo`, all successors `backlog`, no checkpoint,
  and all implementation/publication evidence empty.
- Validate the child root, routing, public-safe pack,
  source-binding-unexecuted snapshots, and interface manifest.
- Bind a wholly new external authority reference; no Demo 3 approval, lease,
  allowlist, baseline, provider observation, or validity window carries
  forward.

# Files Affected

- `presentations/ai-native-sdlc-demo/runs/demo-004/**`
- `presentations/ai-native-sdlc-demo/artifacts/demo-004/**`

# Implementation Notes

- Existing-target, source, binding, materializer, authored-content, or seal
  drift is a hard blocker.
- Do not run the child goal.

# Test Plan

Require zero-warning child validation, exact authored-content equality, fresh
binding and seal, exact first-node routing, complete pack, external-authority
boundary, and empty implementation evidence.

# Links / Artifacts

- test-26
- goal-9
