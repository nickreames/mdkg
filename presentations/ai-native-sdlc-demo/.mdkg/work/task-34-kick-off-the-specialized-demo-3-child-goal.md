---
id: task-34
type: task
title: Start the clock and dispatch the timed Demo 3 child
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-58
next: task-35
tags: [ai-native-sdlc, presentation-demo, phase-7, step-1]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/dispatch-receipt.json, artifacts/demo-003/timing-ledger.json, artifacts/demo-003/blocker-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-6, task-31, task-32, task-33, test-17, task-58]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-6, task-31, task-32, task-33, test-17, task-58]
evidence_refs: [test-17, task-58]
aliases: [phase-7-step-1]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Start the immutable timed window, dispatch the bound exact-source Demo 3
child, and
monitor it through success or a terminal timed blocker. The root integration
owner has already published and released the preparation baseline in task-58;
this node performs no baseline commit or push.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-7.
- Verify task-58's publication and activation receipts, explicit
  root-integration lease release, `HEAD == origin/main`, empty index,
  zero-ahead/zero-behind state, and unchanged allowed local-evidence
  exceptions. Do not stage, commit, or push a preparation baseline here.
- Prove every dirty path at dispatch belongs to the exact preaccepted
  Goal 6/7 local-evidence-only inventory. Any child-run/canonical path dirty
  before its authorized child node is authority drift.
- Dispatch the exact `artifacts/demo-003/sendoff.md` and
  `event-allowlist.json` hashes against the Demo 3 `goal-1`; no paraphrased
  prompt, alternate goal, or alternate harness may be used.
- Reverify the semantic source-release hash, immutable run-binding hash,
  bootstrap/materializer version, authored-content equality, child-interface
  manifest, and immutable child-contract seal before dispatch. Any mismatch is
  a hard blocker; do not patch the child during the timed window.
- Treat `program-orchestrator` and `child-implementation-writer` as sequential
  logical roles of this same designated physical harness/lease. After writing
  the dispatch receipt, continue under the child role; do not leave a second
  umbrella writer mutating timing or receipt files concurrently.
- Reverify `event-authority.json` and require it to bind the same sendoff,
  allowlist, source release, run binding, child seal, lease, preflight,
  prospective range policy,
  pre-publication origin, expected preparation tree, and activation rule.
  Require the activation receipt to bind the clean actual published baseline
  SHA, current origin, and owner handoff. Record its hash in the dispatch
  receipt.
- Dispatch against `runs/demo-003/.mdkg/:goal-1`; retain `examples/website-demo-template/.mdkg/:goal-1` as immutable contrast evidence.
- Permit the positioning node to create its bounded creative decision artifact
  and normal runtime evidence only. It may not rewrite the source-authored
  goal, design, work/test chain, binding, seal, or authority reference.
- Keep all edits inside the frozen allowlist and event writer lease.
- Record presentation/rehearsal kickoff as `P0`. Immediately before invoking
  the exact child dispatch, record immutable `T0`; require `T0 <= P0+00:45`
  and child acknowledgement by `T0+00:45`. Record every later milestone
  relative to `T0`, plus actuals, attempts, retry class, external wait,
  intervention, blocker, and fallback in `timing-ledger.json`.
- Allow at most two pre-publication repair cycles and one production
  fix-forward. Do not start a production repair after T+24. T+29:30 and T+30
  are absolute reveal/fallback cutoffs.
- Treat origin drift, force/unrelated integration, missing access, provider mutation, out-of-scope work, and unrepaired safety failures as hard blockers.
- Reveal Demo 3 only after independent proof; otherwise show Demo 2 transparently without marking Demo 3 achieved.
- Do not request another approval for an exact in-scope action already covered
  by the still-valid event authority. Any drift or new action is a hard
  blocker, not an invitation to seek ad hoc live permission.
- Write `artifacts/demo-003/dispatch-receipt.json` with child root/QID, source
  release, run-binding, child-seal and bound-goal hashes, concise-pack hash,
  sendoff/allowlist/authority/lease/policy hashes, published baseline,
  child-writer and root-integration-owner identities, start time, attempt
  counter initialized to zero, all timed deadlines,
  handoff channel, exact `P0`/`T0`, dispatch invocation, and child
  acknowledgement.
- If the child stops on an enumerated hard blocker, write `artifacts/demo-003/blocker-receipt.json` with interface-manifest hash, last completed child node/checkpoint, exact blocker, attempts, first/final failure times, commands/observations, unchanged or partial side effects, fallback selection, and unresolved authority needed.
- A hard blocker routes directly to sealed Demo 2. The child remains
  unachieved; Goal 7 later records a truthful rehearsal outcome without
  manufacturing happy-path evidence.
- Only the child goal may authorize implementation/publication surfaces. The
  designated timed writer yields after canonical validation; the root
  integration owner alone executes the child publish node and releases; then
  the same designated harness resumes read-only verification and umbrella
  receipts.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-35 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-7 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Build the bound `goal-1` pack from `runs/demo-003/` and dispatch its
  child implementation writer; after accepted canonical validation, that
  writer yields to the root integration owner for the child publish node.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Dispatch receipt resolves the child-interface manifest, frozen artifacts,
  activation receipt, released preparation lease, current event lease, actor
  handoffs, and the same base SHA and exact allowlist.
- Child `goal show/next` identifies the positioning spike, the concise-pack hash matches the dispatch receipt, and the child writer acknowledges the sendoff.
- Keep this node in progress through child completion or a terminal timing
  blocker; task-35 consumes the final child/timing state.
- If dispatch itself hits a hard blocker, the blocker receipt and Demo 2 reveal path are complete and truthful without claiming Demo 3 progress.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
