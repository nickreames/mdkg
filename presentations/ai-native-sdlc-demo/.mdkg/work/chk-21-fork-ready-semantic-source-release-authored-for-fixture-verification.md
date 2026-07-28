---
id: chk-21
type: checkpoint
title: Fork-ready semantic source release authored for fixture verification
checkpoint_kind: implementation
status: done
priority: 9
tags: [ai-native-sdlc, presentation-demo, phase-6, source-release]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/source-prompt-enhancement-receipt.json, artifacts/demo-platform/source-release-manifest.json, artifacts/demo-platform/run-binding.schema.json, artifacts/demo-platform/timed-run-contract.json, artifacts/demo-003/live-sendoff-v2.md]
relates: [task-47]
blocked_by: []
blocks: []
refs: [goal-6, epic-6, spike-6, task-47, chk-20]
context_refs: [goal-6, epic-6, spike-6, task-47, chk-20]
evidence_refs: [task-47, chk-20]
aliases: [phase-6-source-release-authored]
skills: []
scope: [task-47]
created: 2026-07-28
updated: 2026-07-28
---
# Summary

Task 47 produced the accepted-for-fixture-verification semantic source release
`website-demo-source-v2`. The reusable graph now owns the complete generic
positioning-to-production topology while immutable run binding, child-local
evidence, and caller-owned external authority remain separate.

# Scope Covered

- Completed node: task-47 (Author the canonical fork-ready source and run-binding contract)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Reusable website-demo graph, prompt, README, and generated graph indexes.
- Program-local source release, binding schema, timed-run, operator, and
  sendoff contracts.
- Program-local bootstrap and two-fixture smoke driver.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- The user explicitly approved the exact Task 47 mutation allowlist recorded
  by `spike-6` and `chk-20`.
- The semantic release contains stable authored IDs and seven actionable
  nodes; it does not grant Git, provider, lease, or publication authority.
- No Demo 3 run exists at this checkpoint.

# Implementation Summary

- Source release manifest SHA-256:
  `49855648676ade2fdf2be0932906c4873be87118067aebce11fb0412f5bf5edf`.
- Authored inventory SHA-256:
  `dfa6461bf076cf003aa0afbcc06928e9214f7e3f8230cf95fafffb306b817fe8`.
- Bootstrap SHA-256:
  `de16a87408af3247885218b5ae4cb6827b371da84aaeb007273131f84c6d8a28`.
- Exact before/after file hashes and authority boundaries are recorded in the
  enhancement receipt.

# Verification / Testing

## Command Evidence

- `node --check scripts/bootstrap-website-demo-run.js`
- `node --check scripts/smoke-demo-graph.js`
- `mdkg --root examples/website-demo-template validate --json`
- `mdkg --root examples/website-demo-template goal next goal-1 --json`
- `npm run smoke:demo-graph`
- `mdkg --root presentations/ai-native-sdlc-demo validate --json`
- `git diff --check`

## Pass / Fail Status

- Source validation: pass, zero warnings and zero errors.
- Full-chain routing: pass; first actionable node is `spike-1`.
- Targeted two-fixture smoke: pass on the third bounded attempt.
- Fixture cleanup: pass; zero retained fixture directories.
- Task 47 status: done.

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Test 25 must independently seal the two distinct zero-edit fixture proof
  before Demo 3 may be created.
- The pre-existing untracked Demo 2 pack remains outside this checkpoint and
  outside all staging.

## Follow-up Refs

- test-25

# Links / Artifacts

- artifacts/demo-003/source-prompt-enhancement-receipt.json
- artifacts/demo-003/live-sendoff-v2.md
- artifacts/demo-platform/timed-run-contract.json
- artifacts/demo-platform/source-release-manifest.json
- artifacts/demo-platform/run-binding.schema.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
