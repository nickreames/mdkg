---
id: chk-652
type: checkpoint
title: Defer unresolved filesystem hardening and ground Node-only portability continuation
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/receipt.json]
relates: [goal-86, goal-87, dec-98]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-46, bug-47, bug-60, task-841, task-842, test-489]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Bugs46/47 are explicitly DEFERRED / UNRESOLVED, not accepted or fixed. Paused
Goal87 owns their follow-up; Dec98 records the approved Node-only 0.6.0 scope.
Goal86 now owns portable recovery Task841, runtime parity Task842 and installed
Test489 in addition to continuing Bug60. Dependency and coverage records no
longer accidentally require the deferred fixes for this release.

A synthetic Node-only in-memory SQLite prototype passed19/19 focused checks
on local Node24.18.0/macOS arm64. Local Node26.0.0 lacks deserialize and was
refused before fixture creation. Production source was not changed. Goal86
remains active and NOT_READY; Goal85 and new Goal87 remain paused.

# Scope Covered

Explicit Goal86 continuation, owner mdkg-project-agent, main at
6d23981e70bc68798def73c81b9cd5fa7bc9f3df. Initial custody was65 dirty
paths, nothing staged, no active DB lease and empty runtime queues. The active
work item remains Bug60; selected achieved Goal73 is preserved.

## Changed Surfaces

- New Dec98, Goal87, Tasks841/842, Test489 and this checkpoint.
- Updated Goals84/85/86, Bugs46/47/60, Dec97, Tasks826/828/839, Tests479/480/487/488 and
  the requirement-coverage amendment; required index/event projections.
- Self-contained prototype and compact receipt under
  .mdkg/artifacts/goal-86/node-portability/. No production source, package
  metadata, public guidance, skills, CI source or protected bundle changed here.
- Existing65-path source/evidence/skill/CI baseline remains preserved; no
  unknown or unrelated work was absorbed, staged, committed or discarded.

## Boundaries

- In scope: mdkg scope/dependency records and bounded synthetic local proof.
- Out of scope: native helper, provider, deployment, remote Git, publication,
  root/sibling changes, blocked-context recovery, canonical migration,
  bundle/subgraph refresh and hosted execution.
- No raw secrets, prompts, operational payloads, databases or scan reports.

# Decisions Captured

- Dec98 supersedes incompatible current-scope language, preserving history.
- Lifecycle backlog plus deferred tags represents deferral because the schema
  has no deferred status. Goal87 is paused and requires a separate Run.
- A truthful Node capability/range revision and explicitly approved recovery
  after operator-confirmed quiescence are approved; neither is implemented yet.
- Preserve the original14 findings:5 medium,9 low. Two deferrals are not fixes.

# Implementation Summary

Only planning/evidence implementation occurred. In-memory SQLite removes the
need for a native file pathname in the prototype. It checks source identity,
journal state and changes, restricts SQL writes/ATTACH, and retains intentional
writer behavior. Data-image memory grows with database size;32MiB samples are
not a production size policy, peak-memory bound or low-memory guarantee.
All affected production callers, resource handling and installed gates remain.

# Test Proof

- Target: the bounded portable SQLite hypothesis, not complete Bug60 closure.
- Owned synthetic fixtures under /private/tmp were removed by the probe after
  identity-checked cleanup. No canonical DB was used as the fixture.
- Gaps: production callers, low-memory handling, capability metadata, recovery,
  installed artifact, Linux/Windows, independent review, full ladder and seal.

# Verification / Testing

## Command Evidence

- /opt/homebrew/opt/node@24/bin/node --expose-gc
  .mdkg/artifacts/goal-86/node-portability/sqlite-memory-probe.cjs:
 19/19 pass;4/16/32MiB query/hash samples pass; owned fixture removed.
- /opt/homebrew/bin/node --expose-gc followed by the same probe:
  Node26.0.0 missing deserialize, no fixture created, no cases falsely passed.
- Skill list/search/show and bounded Bug60 pack used current local CLI.
- Final graph/index/diff checks are recorded in the linked receipt after this
  checkpoint exists. No full source suite or release gate was rerun for this
  planning-only package; selective-testing policy preserves those later gates.

## Pass / Fail Status

- Bounded feasibility PASS. Production/final artifact UNVERIFIED. NOT_READY.

## Known Warnings

- Existing imported subgraphs are stale and intentionally not refreshed.
- Selected Goal73 is achieved; it is not the active Goal86 authorization.
- Node26.0 is not proof of the required SQLite capability despite its version.

# Known Issues / Follow-ups

- Integrate the portable observer only with an explicit resource contract and
  affected-caller tests; never restore known side-effecting readOnly-only opens.
- Implement Task841 and synchronize Task842 before installed Test489.
- Complete existing local qualification; real platform, current-source review,
  full ladder and exact seal still gate any future publication approval.

## Follow-up Refs

- root:bug-60, root:task-841, root:task-842, root:test-489, root:test-487,
  root:task-828, root:task-829, root:task-830; deferred root:goal-87.

# Links / Artifacts

- .mdkg/artifacts/goal-86/node-portability/receipt.json
- .mdkg/artifacts/goal-86/node-portability/sqlite-memory-probe.cjs
- No new commit or PR. All current-turn work remains unstaged.

# Raw Content Safety

- Retained source and results are synthetic, sanitized and hash-bound. The
  unchanged protected selection/runtime/Demo3 hashes are in the receipt.
- Reused skills: pursue-mdkg-goal, build-pack-and-execute-task and
  verify-close-and-checkpoint. New skill candidates: none.
