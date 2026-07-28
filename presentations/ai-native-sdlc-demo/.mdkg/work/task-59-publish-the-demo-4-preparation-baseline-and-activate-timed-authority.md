---
id: task-59
type: task
title: Publish the Demo 4 preparation baseline and activate timed authority
status: todo
priority: 1
epic: epic-10
parent: goal-10
next: task-55
tags: [ai-native-sdlc, presentation-demo, phase-10, pre-event]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-004/preparation-baseline-publication.json, artifacts/demo-004/event-authority-activation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-10, epic-10, prd-1, edd-1, dec-4, dec-5, goal-9, task-53, task-54, test-27]
context_refs: [goal-10, epic-10, prd-1, edd-1, dec-4, dec-5, goal-9, task-53, task-54, test-27]
evidence_refs: [test-27]
aliases: [phase-10-pre-event-baseline]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Publish the separately approved Demo 4 preparation baseline and activate the
already accepted prospective authority before the live presentation clock
starts. This node is exclusively owned by the root integration owner and
releases its writer lease before task-55 dispatches the child.

# Acceptance Criteria

- Re-read the separate baseline-publication approval, exact preparation
  manifest/tree hash, clean pre-publication `origin/main`, allowed paths,
  deterministic commit rule, quiet window, and invalidation conditions.
- Refuse publication if HEAD/origin, manifest, dirty/staged inventory,
  authority-policy hash, writer lease, or allowed paths drift.
- Stage and commit only the approved preparation manifest, fetch, prove the
  commit is the expected linear descendant, and normal non-force push it to
  `origin/main`. Exclude unrelated history and local-evidence-only graph,
  checkpoint, index, bundle, and receipt files.
- Re-fetch and require `HEAD == origin/main`, zero-ahead, zero-behind, an empty
  index, and no unallowed dirty paths.
- Write `preparation-baseline-publication.json` with old/new origin and HEAD
  SHAs, exact manifest/tree hash, staged inventory, commit/parent, push result,
  fetch/divergence proof, owner/lease, and forbidden-surface checks.
- Derive the actual published baseline SHA and write
  `event-authority-activation.json` binding it and the publication receipt to
  the human-accepted policy, sendoff, allowlist, child, designated harness,
  expected tree, quiet window, and activation rule.
- Release the root integration writer lease explicitly. The program
  orchestrator may not start task-55 until the release and activation receipt
  verify.
- Require both receipts plus this task's program status/event/index changes to
  match the preaccepted Goal 9/10 local-evidence-only inventory. They remain
  untracked or unstaged local evidence and may not enter the preparation or
  timed publication range.
- This node completes before `P0` and `T0`; it consumes none of the 30-minute
  live-child budget.

# Files Affected

- Only the exact preparation manifest authorized by the separate publication
  approval, Git index/history/`origin/main`, and the two named program-local
  evidence receipts.
- No Demo 4 child implementation, provider mutation, DNS, project
  configuration, analytics, tag, or package publication.

# Implementation Notes

- Only `root-integration-owner` may stage, commit, or push in this node.
- Any drift is a hard blocker; do not seek an ad hoc live expansion.

# Test Plan

- Verify the accepted manifest equals the published tree, the actual baseline
  is the expected linear descendant, fetched `origin/main` equals HEAD, the
  activation hashes pass, the writer lease is released, and no timed ledger or
  child node has started.

# Links / Artifacts

- goal-10
- goal-9
- test-27
- dec-5
