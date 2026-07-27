---
id: chk-14
type: checkpoint
title: Demo 2 rehearsal candidate accepted locally
checkpoint_kind: goal-closeout
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, demo-002, local-only, goal-closeout]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/candidate-receipt.json, artifacts/demo-002/fallback/manifest.sha256, artifacts/demo-002/reveal/source-vs-specialized-16x9.png]
relates: [goal-4, test-10, test-11]
blocked_by: []
blocks: []
refs: [goal-4, test-10, test-11, task-20]
context_refs: [goal-4, task-20]
evidence_refs: [test-10, test-11]
aliases: []
skills: []
scope: []
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Demo 2 is an accepted local rehearsal candidate. Its canonical source graph
was forked deterministically into `runs/demo-002`, specialized around “Keep the
plan when the agent changes,” executed through local implementation and
canonical static Astro integration, validated, and sealed with an offline
fallback. The child remains paused and unachieved with publication `task-3`
next.

# Scope Covered

- `spike-4`
- `task-15` through `task-20`
- `test-10` and `test-11`
- child `spike-1`, `task-1`, `test-1`, `task-2`, and `test-2`

## Changed Surfaces

- Program graph state and evidence under
  `presentations/ai-native-sdlc-demo/`.
- New owned run graph and local site under `runs/demo-002/`.
- Generic Demo 2 record and static Astro output component registration in the
  four canonical `mdkg-dev` allowlist paths.
- Sealed fallback and five reveal images under `artifacts/demo-002/`.

## Boundaries

- In scope: deterministic fork, specialization, local site, canonical adapter,
  local verification, captures, and offline fallback.
- Out of scope: staging, commit, push, provider inspection, deployment, live
  URLs, tags, package publication, analytics, DNS, and root bundle refresh.
- Raw secrets, raw prompts, credentials, provider payloads, and bulky traces
  are excluded.

# Decisions Captured

- Demo 2 targets AI-native builders with durable source-to-execution
  continuity, expressed as an Ocean Flow navigation chart.
- Local success stops at a separate publication gate.
- Demo 2 remains `listed: false`, `noindex: true`, static Astro, and zero client
  JavaScript.

# Implementation Summary

The reusable `goal-1` was preserved at fork time and then specialized with an
explicit audience, promise, authority allowlist, expanded work chain, and
publication boundary. The local output is registered through Goal 2's generic
per-demo record and static output-component registry; no Demo 2-only route or
runtime dependency was introduced.

# Goal Closeout

- Goal condition result: achieved locally without publication.
- Scoped nodes closed: all eight Goal 4 actionable nodes.
- Remaining deferred work: Goal 5 must obtain separate human publication
  approval before it may claim child `task-3`.

# Verification / Testing

## Command Evidence

- `mdkg --root presentations/ai-native-sdlc-demo validate --json`: pass, zero
  warnings/errors.
- `mdkg --root presentations/ai-native-sdlc-demo/runs/demo-002 validate --json`:
  pass, zero warnings/errors.
- Run-local and canonical Astro builds: pass.
- SEO, accessibility, and performance regressions: pass.
- Browser detail/output desktop/mobile checks: pass.
- `shasum -a 256 -c manifest.sha256`: all 17 files pass.
- `git diff --check`: pass.
- `git diff --cached --stat`: empty.

## Pass / Fail Status

- Status: accepted local-only candidate.
- Candidate receipt:
  `sha256:0a4f6f09d1a5d9221c90fb0f278ee40f55b7b4f2b6681586b086ec839e465e82`.
- Fallback manifest:
  `sha256:79d969e3c4bf1d1949ade31adb4e6d04b3a486e09ad99a99becc827619952186`.

## Known Warnings

- `scripts/smoke-mdkg-dev.js` retains a pre-Demo-2 fixture sentinel that
  intentionally fails now that Goal 4 creates Demo 2. Scripts and fixtures were
  outside Goal 4's frozen source allowlist. Direct Demo 2 route, visibility,
  static-output, browser, accessibility, budget, and fallback checks pass.
- The child goal preserves a stale completed `active_node`, so `goal next`
  emits that warning while still deterministically selecting untouched
  publication `task-3`.

# Known Issues / Follow-ups

- Goal 5 requires a separate explicit human publication approval.
- A later authorized test-maintenance change should replace the stale
  pre-Demo-2 sentinel with assertions for the real unlisted/noindexed Demo 2
  route contract.

## Follow-up Refs

- `goal-5`
- child `task-3`
- child `test-3`

# Links / Artifacts

- `artifacts/demo-002/candidate-receipt.json`
- `artifacts/demo-002/fallback/README.md`
- `artifacts/demo-002/fallback/manifest.sha256`
- `artifacts/demo-002/reveal/source-vs-specialized-16x9.png`
- `runs/demo-002/artifacts/local-validation.json`
- `runs/demo-002/artifacts/canonical-route-validation.json`
- No PR, commit, push, deployment, or public URL belongs to Goal 4.

# Raw Content Safety

- Evidence uses refs, hashes, and public-safe summaries instead of raw secrets,
  raw prompts, provider payloads, or bulky execution traces.
