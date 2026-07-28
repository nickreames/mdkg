---
id: task-34
type: task
title: Kick off the specialized Demo 3 child goal
status: todo
priority: 1
epic: epic-7
parent: goal-7
next: task-35
tags: [ai-native-sdlc, presentation-demo, phase-7, step-1]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/dispatch-receipt.json, artifacts/demo-003/blocker-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-6, task-31, task-32, task-33, test-17]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-6, task-31, task-32, task-33, test-17]
evidence_refs: [test-17]
aliases: [phase-7-step-1]
skills: [select-work-and-ground-context, build-pack-and-execute-task, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Kick off the specialized Demo 3 child goal. This is step 1 of 11 in Goal 7; it owns only the outcome named here and the authority granted by goal-7.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-7.
- Dispatch the exact `artifacts/demo-003/sendoff.md` and `event-allowlist.json` hashes against `presentations/ai-native-sdlc-demo/runs/demo-003/.mdkg/:goal-1`; no paraphrased prompt or alternate goal may be used.
- Reverify `event-authority.json` and require it to bind the same sendoff,
  allowlist, child, lease, preflight, complete push range, base/origin SHAs,
  and owner handoffs. Record its hash in the dispatch receipt.
- Dispatch against `runs/demo-003/.mdkg/:goal-1`; retain `examples/website-demo-template/.mdkg/:goal-1` as immutable contrast evidence.
- Keep all edits inside the frozen allowlist and event writer lease.
- Allow at most three complete fix-forward attempts and twenty minutes from the first production failure.
- Treat origin drift, force/unrelated integration, missing access, provider mutation, out-of-scope work, and unrepaired safety failures as hard blockers.
- Reveal Demo 3 only after independent proof; otherwise show Demo 2 transparently without marking Demo 3 achieved.
- Do not request another approval for an exact in-scope action already covered
  by the still-valid event authority. Any drift or new action is a hard
  blocker, not an invitation to seek ad hoc live permission.
- Write `artifacts/demo-003/dispatch-receipt.json` with child root/QID, source
  and specialized goal hashes, concise-pack hash,
  sendoff/allowlist/authority/lease hashes, approved push-range hash,
  child-writer and root-integration-owner identities, start time, attempt
  counter initialized to zero, twenty-minute production-failure deadline rule,
  handoff channel, and dispatch acknowledgement.
- If the child stops on an enumerated hard blocker, write `artifacts/demo-003/blocker-receipt.json` with interface-manifest hash, last completed child node/checkpoint, exact blocker, attempts, first/final failure times, commands/observations, unchanged or partial side effects, fallback selection, and unresolved authority needed.
- A hard blocker routes directly to the sealed Demo 2 reveal and Goal 7 remains unachieved; tasks 35–40 are not falsely completed merely to preserve the happy-path chain.
- Only the child goal may authorize implementation/publication surfaces. Its child writer yields after canonical validation, and the root integration owner alone executes the child publish node; the program umbrella remains a read-only evidence consumer except for its own receipts.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-35 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-7 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Build the specialized `goal-1` pack from `runs/demo-003/` and dispatch its child implementation writer; after accepted canonical validation, that writer yields to the root integration owner for the child publish node.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Dispatch receipt resolves the child-interface manifest, frozen artifacts, current lease, actor handoffs, and the same base SHA and exact allowlist.
- Child `goal show/next` identifies the positioning spike, the concise-pack hash matches the dispatch receipt, and the child writer acknowledges the sendoff.
- No later child result is required to finish this kickoff node; tasks 35–40 and tests 18–21 consume subsequent receipts.
- If dispatch itself hits a hard blocker, the blocker receipt and Demo 2 reveal path are complete and truthful without claiming Demo 3 progress.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
