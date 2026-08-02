---
id: task-58
type: task
title: Publish the Demo 3 preparation baseline and activate timed authority
status: done
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
refs: [goal-7, epic-7, prd-1, edd-1, dec-4, dec-5, goal-6, task-31, task-32, task-33, test-17, chk-24, chk-25]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-4, dec-5, goal-6, task-31, task-32, task-33, test-17, chk-24, chk-25]
evidence_refs: [test-17, chk-24, chk-25]
aliases: [phase-7-pre-event-baseline]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-28
---
# Overview

Verify or, only when still necessary, publish the separately approved Demo 3
preparation baseline from a dedicated clean publication worktree, then
activate the already accepted prospective authority before the
audience-visible clock starts. This node is exclusively owned by the root
integration owner and releases its writer lease before task-34 dispatches the
child.

The private control checkout and the publication worktree are different
authority surfaces. The control checkout owns Goal 6/7 orchestration,
checkpoints, generated indexes, receipts, and authority activation. It may
intentionally diverge from `origin/main` and must never stage, commit, or push
the preparation baseline. The publication worktree is created from fetched
`origin/main`, contains only the approved preparation range, and is the only
checkout permitted to stage, commit, or push.

# Acceptance Criteria

- Re-read the separate baseline-publication approval, exact preparation
  manifest/tree hash, clean pre-publication `origin/main`, allowed paths,
  deterministic commit rule, quiet window, and invalidation conditions.
- Resolve and record both runtime worktree roots, their branches, HEADs,
  cleanliness, Git common-directory identity, and role. Refuse to continue if
  the control checkout and publication worktree are the same path or if any
  preparation commit/push is attempted from the control checkout.
- Treat publication as idempotent. If fetched `origin/main` already equals the
  separately approved published baseline and the exact manifest, tree,
  commits, path inventory, and hashes verify, create no commit and perform no
  push. Record the existing baseline as verified and continue to authority
  activation.
- If the approved baseline is not yet published, create or reuse a dedicated
  clean publication worktree from freshly fetched `origin/main`. Materialize
  only the approved preparation manifest there; never merge, rebase,
  cherry-pick, or otherwise integrate the private control branch.
- Before any preparation commit or push, calculate the complete
  `fetched-origin...candidate` range rather than inspecting only the staged
  diff. Require exact equality between the actual range-path inventory and the
  approved manifest, and require an empty intersection with every exact and
  pattern-based local-evidence exclusion.
- The exclusion proof must cover the 32 exact conflicting paths observed in
  the reviewed control range plus all seven then-allocated Goal 6 checkpoint
  paths matched by the policy placeholder. Recalculate from policy and current
  Git state; the recorded counts are a regression expectation, not permission
  to ignore newly matching paths.
- Stage and commit only the approved preparation manifest in logical commits,
  fetch, prove the candidate is the expected linear descendant, and normal
  non-force push it to `origin/main`. Do not include unrelated history or
  local-evidence-only graph, checkpoint, index, bundle, pack, state, event, or
  receipt files.
- Re-fetch and require the publication worktree `HEAD == origin/main`,
  zero-ahead, zero-behind, an empty index, and no unallowed dirty paths. The
  private control checkout is not required to equal origin and its divergence
  is never repaired inside this task.
- Write `preparation-baseline-publication.json` with old/new origin and HEAD
  SHAs, both worktree descriptors, exact manifest/tree hash, staged and
  complete-range inventories, exclusion intersection, ordered commits, path
  manifest hash, patch hash, commit/parent, idempotent reuse or push result,
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
- Graph validation may temporarily regenerate excluded indexes and SQLite
  caches in either isolated graph. Record the zero-warning validation result,
  then restore or leave unstaged every excluded generated cache and rerun the
  final complete-range and exclusion checks before any push.
- If `origin/main` advances before the final publication preflight, do not
  merge or rebase the control checkout and do not broaden the range. Rebuild
  the candidate from the new fetched origin, recompute every manifest/hash, and
  require renewed approval if any approved candidate identity changes.
- This work is pre-event preparation and occurs before both `P0` and `T0`; it
  consumes none of the 30-minute timed child budget.

# Files Affected

- Only the exact preparation manifest authorized by the separate publication
  approval, the dedicated publication worktree, Git
  index/history/`origin/main`, this local-only task/goal state, and the two
  named program-local evidence receipts.
- No implementation path, Demo 3 child work node, provider mutation, DNS,
  project configuration, analytics, tag, or package publication.

# Implementation Notes

- Only `root-integration-owner` may stage, commit, or push in this node.
- The private control checkout is read-only with respect to Git publication.
  It may write only the preaccepted local mdkg state and receipt surfaces.
- The publication worktree is write-capable for the approved preparation
  manifest and Git transaction but may not write private Goal 6/7 evidence.
- Preserve credentials, tokens, private provider data, and unrelated dirty
  work outside receipts and commits.
- Any drift is a hard blocker; do not seek an ad hoc expansion during the
  presentation.

# Deterministic Worktree Algorithm

1. Read the human acceptance, preparation handoff, authority policy, allowlist,
   writer lease, and current live `origin/main`.
2. Record the control checkout descriptor and prohibit publication actions
   from it.
3. Resolve a distinct publication worktree whose Git common directory matches
   the repository and whose starting HEAD equals freshly fetched
   `origin/main`.
4. If live origin already equals the accepted published baseline, verify its
   manifest, tree, commits, complete range, and deployment identity; skip
   staging, commit, and push.
5. Otherwise materialize only the accepted preparation manifest into the clean
   publication worktree.
6. Calculate the complete candidate range and prove both
   `actual paths == approved paths` and
   `actual paths intersect excluded paths == empty`.
7. Run graph, source, diff, public-safety, deterministic-fork, and
   secret-pattern checks. Temporarily regenerate excluded caches only for
   validation, then remove them from the candidate and repeat the two path
   assertions.
8. Re-read live origin. On drift, invalidate or rebuild; never integrate the
   private control branch.
9. When publication is still required, create only the approved logical
   commits and perform one normal non-force `HEAD:main` push from the
   publication worktree.
10. Fetch and prove the publication worktree is clean and zero-ahead/
    zero-behind at the actual published SHA.
11. Return to the control checkout, write the two local-only receipts, verify
    their bindings, release the root integration writer lease, and only then
    allow task-34 to record `P0` or `T0`.

# Test Plan

- Verify the two worktree descriptors are distinct, share the expected Git
  common directory, and enforce their opposite publication/evidence roles.
- Verify the accepted preparation manifest equals the published tree and that
  an already-published matching baseline causes no commit or push.
- Verify the actual baseline is a linear descendant of the accepted old origin
  and equals fetched `origin/main` in the publication worktree.
- Verify the complete range equals the approved path manifest and intersects
  neither the 32 exact exclusions nor the seven allocated checkpoint
  exclusions.
- Verify temporarily generated cache files are absent from the final range.
- Verify activation-receipt hashes and the explicit writer-lease release.
- Verify no timed ledger or child node has started.

# Links / Artifacts

- goal-7
- goal-6
- test-17
- dec-5
