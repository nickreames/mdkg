---
id: chk-341
type: checkpoint
title: accepted short path demo gates advanced viewer
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-325]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-325]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

The accepted short-path Demo 1 checkpoint now gates the advanced viewer follow-up
correctly. `goal-47` may start from accepted local proof, while external hosting
and DNS remain archived/approval-gated.

# Scope Covered

- `test-325`
- `goal-44`
- `goal-47`
- `chk-338`
- `chk-339`
- `chk-340`

## Changed Surfaces

- mdkg test/checkpoint evidence only
- no source, provider, DNS, deployment, npm, or git remote mutation in this
  checkpoint phase

## Boundaries

- in scope: proof gate between accepted Demo 1 local route evidence and the
  advanced viewer follow-up
- out of scope: live production, Vercel, DNS, push, tag, npm publish, analytics
  activation, provider mutation
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `goal-47` is the correct next lane for embedded workspace/viewer research.
- DNS/non-preview hosting remains optional historical/future context, not a
  blocker for `goal-44`.

# Implementation Summary

`test-325` confirms that `chk-340` accepted the Demo 1 local proof, backed by
`chk-339` Browser/Chrome route evidence and `chk-338` lazy-load isolation proof.

# Test Proof

- Test target: accepted checkpoint gating for advanced viewer work.
- Fixtures or temp repos: local `mdkg-dev` preview and local screenshot folder
  `/private/tmp/mdkg-goal44-demo-routes`.
- Coverage gaps: live production validation is intentionally deferred until a
  separate push/deploy approval.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js task done test-325 --checkpoint ... --json`
- result: `test-325` marked done and checkpoint `chk-341` created.
- command: `node dist/cli.js goal next goal-44 --json`
- result: no remaining actionable node selected; only stale active-node warning
  remained before goal closeout.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: active-node warning is expected until `goal-44` is marked achieved.

# Known Issues / Follow-ups

- `goal-47` should research/build the advanced lazy workspace viewer later.
- Production deployment/live validation requires separate explicit approval.

## Follow-up Refs

- `goal-47`
- `epic-207`
- `spike-24`

# Links / Artifacts

- `.mdkg/work/chk-338-demo-viewer-lazy-load-isolation-passed.md`
- `.mdkg/work/chk-339-short-path-demo-route-evidence-passed.md`
- `.mdkg/work/chk-340-short-path-demo-proof-accepted.md`
- `/private/tmp/mdkg-goal44-demo-routes`

# Raw Content Safety

- Evidence is summarized through local artifact paths and mdkg node refs only.
