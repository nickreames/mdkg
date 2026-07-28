---
id: task-35
type: task
title: Consolidate and verify Demo 3 reveal-critical evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-34
next: test-18
tags: [ai-native-sdlc, presentation-demo, phase-7, step-2]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/reveal-gate-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-34]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-34]
evidence_refs: []
aliases: [phase-7-step-2]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Run one prepared read-only verifier over the final child receipts and timing
ledger, without repeating builds or source/provider mutation. This is step 2
of 11 in Goal 7.

# Acceptance Criteria

- Read the final child/timing state first. On the Demo 3 success branch,
  consume the child checkpoint, local/canonical, commit/push, deployment,
  route, source/specialized goal, timing, authority, sendoff, allowlist,
  policy, and lease receipts. On the fallback branch, consume the blocker,
  last completed child node, partial-side-effect inventory, timing, authority,
  fallback, and every success receipt that actually exists; absent
  success-only receipts are explicitly `not_applicable`, not fabricated.
- Write `reveal-gate-receipt.json` binding source/specialized hashes, child
  checkpoint, actual base/range/final SHA, normal push, both exact-SHA
  deployment states, both route statuses, required content, noindex, zero
  client JavaScript, essential public-safety/transfer assertions, milestone
  timing, retries, waits, interventions, and Demo 3/Demo 2 selection.
- Include Plan, Work, Evidence, what completed, why, and what comes next.
- Do not rerun canonical builds, capture the four archival screenshots, perform
  exhaustive accessibility QA, or refresh bundles in this node.
- Finish by T+29:15, reserving fifteen seconds for test-18 to validate and
  record the audience-facing selection by T+29:30. Incomplete or inconsistent
  success evidence selects Demo 2 and records the exact blocker.
- The successor test-18 does not begin until this receipt is verified.

# Files Affected

- Program evidence under this nested graph only.
- No run graph, adapter, canonical source, Git, or provider mutation.

# Implementation Notes

- Re-read the child receipt and writer lease before recording the mirror.
- Prefer deterministic mdkg and build receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- The consolidated receipt resolves every named child identity and performs no
  heavy or mutating command.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
