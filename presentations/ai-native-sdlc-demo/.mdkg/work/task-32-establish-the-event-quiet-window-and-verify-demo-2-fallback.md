---
id: task-32
type: task
title: Establish the event quiet window and verify Demo 2 fallback
status: done
priority: 1
epic: epic-6
parent: goal-6
prev: task-31
next: task-33
tags: [ai-native-sdlc, presentation-demo, phase-6, step-9]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/event-writer-lease.json, artifacts/demo-003/fallback-readiness.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-31]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-31]
evidence_refs: []
aliases: [phase-6-step-9]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-28
---

# Overview

Establish the event quiet window and verify Demo 2 fallback. This is step 9 of
13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Establish `artifacts/demo-003/event-writer-lease.json` with the child
  implementation writer and root integration owner identities, checkout,
  start/expiry, renewal and invalidation rules, base and origin SHA,
  source-release/run-binding/child-seal/sendoff/allowlist/authority-policy
  hashes,
  exact non-overlapping phases and allowed paths, excluded parallel writers,
  conflict check, heartbeat/renewal rule, canonical-test handoff, publication
  handoff, and release condition.
- Model serialized physical-writer phases: root integration owner publishes
  the preparation baseline in task-58 and releases; one designated timed
  writer performs the logical orchestrator plus child-implementation roles
  through canonical validation and releases; the root integration owner
  reacquires only for the child publish node and releases; the designated
  writer resumes read-only verification/receipt consolidation; the root
  integration owner later owns bundle/root closeout.
- Reverify Demo 2's golden-fallback manifest, candidate/deployment/route/deck hashes, public URLs, offline files, and recovery instructions without changing it.
- Write `artifacts/demo-003/fallback-readiness.json` with Demo 2 manifest hash, exact immutable artifact inventory, live route observations, offline verification, reveal switch procedure, speaker wording, and pass/blocker status.
- Require the live/offline fallback switch to be executable within 30 seconds.
- Bind one implementation writer and one root integration owner to those
  non-overlapping phases. Do not require the final authority hash yet.
- State explicitly that the child writer may execute a later activated
  authority but may not edit the run binding, immutable seal, authority
  reference, allowlist, lease, approval, or validity window.
- Do not activate Goal 7 until every parallel root writer acknowledges the
  quiet window and the authority policy, lease, and fallback receipts pass at
  the current base SHA.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-33 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-6 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- The task-58 baseline lease, child implementation lease, child publication
  lease, and root bundle closeout lease are serialized; no source/Git writers
  overlap.
- Demo 2 live and offline fallback hashes match the sealed Goal 5 receipt and the recovery procedure is executable.
- Authority policy, lease, allowlist, sendoff, source release, run binding,
  immutable child seal, preflight, and fallback receipts all bind the same
  preparation identity and base SHA.

# Links / Artifacts

- goal-6
- epic-6

# Results

- Reserved a serialized event writer lease without activating it. The five
  non-overlapping phases bind the preparation publisher, single Codex timed
  writer, child publisher, read-only verifier, and bundle closeout owner with
  explicit claims, releases, renewal checks, and fail-closed invalidation.
- `event-writer-lease.json` binds the current Task 31 policy chain and reviewed
  Git candidate at `e5d3d23ea811c791870944e195ef7e09f57a1e9e`; SHA-256
  `8a1c96d8f03103f15930422937a29210217b34138a621ebc9dc3262bf70847f7`.
  It grants no authority until the human receipt and post-publication
  activation receipt both verify.
- Confirmed there are no running parallel subagents or alternate source/Git
  writers in this checkout. Any later writer appearance, ownership overlap, or
  unallowed dirty/staged path invalidates the reservation.
- Reverified all 30 entries in the immutable Demo 2 golden-fallback inventory
  and all 17 files in its offline manifest. No fallback file changed.
- Read-only GET verification returned HTTP 200 for both
  `https://mdkg.dev/demo/2/` and `https://mdkg.dev/demo/2/output/`; both retain
  `noindex,nofollow` and the expected Demo 2 story.
- `fallback-readiness.json` (SHA-256
  `8758c521fc17a868bce09852f50afbd2b30d74c30db4ca19cdb4dc3a1a79c9dc`)
  records the exact manifest identities, live observations, offline recovery,
  honest speaker wording, and a mutation-free sub-30-second reveal switch.
- The pre-existing untracked Demo 2 pack remained untouched. No child work,
  source implementation, staging, commit beyond the separately authorized
  local planning commit, push, deployment, or provider mutation occurred.
