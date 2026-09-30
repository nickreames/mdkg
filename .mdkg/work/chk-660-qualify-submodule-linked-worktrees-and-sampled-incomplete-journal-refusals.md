---
id: chk-660
type: checkpoint
title: Qualify submodule linked worktrees and sampled incomplete journal refusals
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-478-indirection-qualification.json, .mdkg/artifacts/goal-86/test-478-indirection-qualification.cjs, .mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.qualification-inputs-bug61.json]
relates: [bug-61, test-478, task-838, task-828, task-826, test-487, task-830, goal-86, dec-98]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-61, test-478]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Bug61 is locally fixed and verified. Three installed linked-worktree topologies
now pass sampled incomplete-journal, concurrency, recovery and native-integration
controls. Test478 remains progress; Goal86 is active and NOT_READY. Candidate
bytes are unchanged and the original input capture remains preserved.

# Scope Covered

Entry: main6d23981e70bc68798def73c81b9cd5fa7bc9f3df,69 ahead/0 behind
cached origin/main,167 inherited dirty paths and nothing staged. One repository
writer; protected selection/runtime/Demo3/release bytes matched. No remote
verification or canonical Git mutation occurred.

## Changed Surfaces

scripts/qualification-git.js, tests/qualification-git.test.mjs, one private
installed supplement and qualification-input amendment, Bug61/Test478/Goal86
and Goal84 ledger, Task828 verification dependency, this checkpoint, coverage
receipt and required projections. No shipped source/package payload changed.

## Boundaries

Native fixture commits/branches/worktrees/merges stayed inside owned synthetic
/private/tmp roots. No canonical branch/worktree, remote Git, provider,
publication, blocked scan context, graph migration or bundle/subgraph refresh.

# Decisions Captured

Dec98 remains authoritative. Bugs46/47 are DEFERRED / UNRESOLVED under paused
Goal87, not accepted or fixed. Goal85 remains paused. No native helper or
OS-specific product dependency is introduced by this qualification-only fix.

# Implementation Summary

The helper previously interpreted a submodule's common core.worktree relative
to a linked checkout's gitdir. It now validates the reciprocal original marker,
separate linked backpointer and checkout-local config without weakening owned
metadata containment. Redirected/backpointer/config negative controls remain.

The retained6154e4ea candidate and original114b25fc input capture are unchanged.
A separate29e0f1e2 qualification amendment records the single non-shipping
helper delta and regression/supplement identities; no repack or seal occurred.

# Verification / Testing

## Command Evidence

- Focused failing-before regression:0 pass/1 fail,540.559ms.
- Corrected Git-fixture suite:31/31 pass,7416.184ms.
- Shared helper/caller selection:124/124 pass,9004.486ms,including those31.
- Installed ordinary topology:pass,37289.059ms.
- Installed separate-gitdir topology:pass,36760.998ms.
- Installed submodule-backed topology:pass,37866.538ms; parent HEAD/index/
  gitlink/.gitmodules/marker bookends preserved.
- Each topology:60 explicit-root warm/cold JSON/SQLite reads, two actual
  SIGKILL journals, four sampled faults with inspection/resume/rollback
  refusal, peer-state isolation and an actual four-conflict native merge.
- Runtime:Node24.18.0/macOS arm64; exact retained candidate SHA256
  6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca.

## Pass / Fail Status

Bug61 local completion only. Independent bounded static review found a
mode-token reuse in the private negative control; corrected mode-specific
approvals were used for all final runs. Final readback found no remaining
concrete defect in this patch; it is not independent security clearance.
Two first-write fixture assumptions were corrected, with failed attempts kept
in the sanitized receipt rather than classified as product defects.

## Known Warnings

Pre-closeout graph validation:0 errors,3 existing stale-subgraph warnings.
Final graph/index/diff and protected bookends are recorded in the receipt.
No protected bundles were regenerated to clear warnings.

# Known Issues / Follow-ups

Four sampled journal faults do not prove every malformed shape or a dirty
worktree deletion/pruning gate. One-level submodule-backed linked worktrees
do not prove arbitrary recursive nesting. The newer sibling source-only
commit remains intentionally unmerged; reviewed incoming revisions were pinned.
Linux, final independent acceptance, full ladder and exact seal remain open.

## Follow-up Refs

Continue Test479 installed ownership/recovery/transport qualification while
retaining Test478 as current-intermediate, not final-artifact acceptance.

# Links / Artifacts

- .mdkg/artifacts/goal-86/test-478-indirection-qualification.json
- .mdkg/artifacts/goal-86/test-478-indirection-qualification.cjs
- .mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.qualification-inputs-bug61.json
- All six newly owned synthetic fixture roots were removed after terminal and
  process checks; compact diagnostics and runnable sources remain. Removal is
  reproducible but not trash-recoverable. No unknown paths were cleaned.
- No staging/commit/push. No persistent lease acquired; transient command
  locks released. An active-node pointer is not standing writer authority.
- Skills:pursue-mdkg-goal,verify-close-and-checkpoint,source-grounded-diagnose-and-fix.
  Candidates:none.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
