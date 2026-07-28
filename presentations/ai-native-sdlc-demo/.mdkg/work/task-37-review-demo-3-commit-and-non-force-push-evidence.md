---
id: task-37
type: task
title: Review Demo 3 commit and non-force push evidence
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-36
next: task-38
tags: [ai-native-sdlc, presentation-demo, phase-7, step-5, post-reveal]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/commit-push-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-36]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-36]
evidence_refs: []
aliases: [phase-7-step-5]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Review the commit and push receipt produced inside the authorized Demo 3 child
goal. This post-reveal umbrella node does not stage, commit, or push. This is
step 5 of 11 in Goal 7.

# Acceptance Criteria

- Read test-18's immutable selection first.
- On Demo 3 success, consume
  `runs/demo-003/artifacts/receipts/commit-push.json` and verify fetched origin
  state, zero-behind preflight, exact staged allowlist, logical commit SHA, and
  successful non-force `origin/main` push.
- On Demo 2 fallback, audit any commit/push receipt or partial Git side effect
  that exists. If the child never published, record the actual HEAD/origin/
  index state and mark success-only push/range fields `not_applicable`.
- Compare every published commit and path in the actual pre-push
  `origin/main..HEAD` range plus fix-forward commits against the prospective
  range policy accepted in `event-authority.json`. Require a clean published
  baseline, linear descendants, exact allowlisted paths, commit/repair limits,
  and the stable actual range hash calculated immediately before push.
- Confirm no force, history rewrite, unrelated integration, tag, package publication, or provider mutation occurred.
- Inspect Git state read-only; do not stage, commit, amend, or push from this node.
- Do not reopen the timed child. Record missing or contradictory evidence as a
  rehearsal blocker and Goal 9 follow-up.
- Write `artifacts/demo-003/umbrella/commit-push-receipt.json` with child
  path/hash, allowlist/authority/lease/policy hashes, actual complete range and
  stable range hash, pre/post origin SHA, staged inventory hash,
  commit/parent SHAs, push command/result, read-only remote comparison, review
  time, and pass/blocker state.
- The successor task-38 does not begin until this node is verified.

# Files Affected

- Program evidence under this nested graph and read-only Git inspection.
- No Git index, history, remote, source, or provider mutation.

# Implementation Notes

- Re-read the child publication receipt and current Git state before recording the review.
- Prefer exact SHAs, divergence, and path receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- On success, pushed SHA, commit SHA, allowlist receipt, and the child
  commit/push receipt agree, and read-only remote state shows the approved SHA
  on `origin/main` without force or unrelated integration.
- On fallback, the partial-side-effect inventory and current read-only Git
  state agree; absent success-only publication evidence is explicitly
  `not_applicable`.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
