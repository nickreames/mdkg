---
id: task-58
type: task
title: Publish the Demo 3 preparation baseline and activate timed authority
status: todo
priority: 1
epic: epic-7
parent: goal-7
next: task-34
tags: [ai-native-sdlc, presentation-demo, phase-7, pre-event]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-003/preparation-baseline-publication.json, artifacts/demo-003/event-authority-activation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-4, dec-5, goal-6, task-31, task-32, task-33, test-17]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-4, dec-5, goal-6, task-31, task-32, task-33, test-17]
evidence_refs: [test-17]
aliases: [phase-7-pre-event-baseline]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Publish the separately approved Demo 3 preparation baseline and activate the
already accepted prospective authority before the audience-visible clock
starts. This node is exclusively owned by the root integration owner and
releases its writer lease before task-34 dispatches the child.

# Acceptance Criteria

- Re-read the separate baseline-publication approval, exact preparation
  manifest/tree hash, clean pre-publication `origin/main`, allowed paths,
  deterministic commit rule, quiet window, and invalidation conditions.
- Refuse publication if HEAD/origin, the preparation manifest, dirty/staged
  inventory, authority-policy hash, writer lease, or allowed paths drift.
- Stage and commit only the approved preparation manifest, fetch, prove the
  commit is the expected linear descendant, and normal non-force push it to
  `origin/main`. Do not include unrelated history or local-evidence-only
  graph, checkpoint, index, bundle, or receipt files.
- Re-fetch and require `HEAD == origin/main`, zero-ahead, zero-behind, an empty
  index, and no unallowed dirty paths.
- Write `preparation-baseline-publication.json` with old/new origin and HEAD
  SHAs, exact manifest/tree hash, staged inventory, commit/parent, push result,
  fetch/divergence proof, owner/lease, and forbidden-surface checks.
- Derive the actual published baseline SHA rather than guessing it in Goal 6.
  Write `event-authority-activation.json` binding that SHA and the publication
  receipt to the human-accepted policy, sendoff, allowlist, child, designated
  harness, expected tree, quiet window, and activation rule.
- Release the root integration writer lease explicitly. The program
  orchestrator may not start task-34 until the release and activation receipt
  both verify.
- Require both receipts plus this task's program status/event/index changes to
  match the preaccepted local-evidence-only inventory. They remain untracked or
  unstaged local evidence and may not enter the preparation or timed
  publication range.
- This work is pre-event preparation and occurs before both `P0` and `T0`; it
  consumes none of the 30-minute timed child budget.

# Files Affected

- Only the exact preparation manifest authorized by the separate publication
  approval, Git index/history/`origin/main`, and the two named program-local
  evidence receipts.
- No implementation path, Demo 3 child work node, provider mutation, DNS,
  project configuration, analytics, tag, or package publication.

# Implementation Notes

- Only `root-integration-owner` may stage, commit, or push in this node.
- Preserve credentials, tokens, private provider data, and unrelated dirty
  work outside receipts and commits.
- Any drift is a hard blocker; do not seek an ad hoc expansion during the
  presentation.

# Test Plan

- Verify the accepted preparation manifest equals the published tree.
- Verify the actual baseline is a linear descendant of the accepted old
  origin and equals fetched `origin/main`.
- Verify activation-receipt hashes and the explicit writer-lease release.
- Verify no timed ledger or child node has started.

# Links / Artifacts

- goal-7
- goal-6
- test-17
- dec-5
