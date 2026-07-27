---
id: chk-3
type: checkpoint
title: Demo 2 exact-SHA production proof accepted
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [demo-002-agent]
links: []
artifacts: [artifacts/publication-receipt.json, artifacts/live-verification-receipt.json, ../../artifacts/demo-002/deployment-receipt.json, ../../artifacts/demo-002/live-route-receipt.json]
relates: [test-3]
blocked_by: []
blocks: []
refs: [goal-1, task-3, test-3]
context_refs: [goal-1, task-3]
evidence_refs: [task-3, test-3]
aliases: []
skills: []
scope: [test-3]
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Both existing production deployments are READY for exact SHA f6af6410; detail and output routes pass desktop/mobile, noindex, zero-JS, accessibility, content, privacy, and budget gates.

# Scope Covered

- Completed node: test-3 (Verify Demo 2 exact SHA deployments and live routes)
- Node type: test
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: test-3
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of test-3 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- No child-goal work remains. The parent presentation program owns timed
  rehearsal, golden-fallback sealing, and any future publication authority.

## Follow-up Refs

- `ai-native-sdlc-demo:goal-5`

# What Completed

- The accepted Demo 2 candidate was published by one approved normal non-force
  push at exact SHA `f6af6410cf03ae222c4ee102844a678373b35d93`.
- Both existing production projects reported `READY` for that exact SHA.
- `https://mdkg.dev/demo/2/` and
  `https://mdkg.dev/demo/2/output/` passed desktop and mobile verification.

# Why

The rehearsal now has inspectable production evidence tied to Git and provider
identity. The result is a deterministic public fallback rather than a
local-only success claim.

# What Comes Next

The presentation program consumes this proof for its timed rehearsal and
immutable fallback seal. Any later source or public update requires a fresh
authority gate.

# Links / Artifacts

- artifacts/live-verification-receipt.json
- ../../artifacts/demo-002/deployment-receipt.json
- ../../artifacts/demo-002/live-route-receipt.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
