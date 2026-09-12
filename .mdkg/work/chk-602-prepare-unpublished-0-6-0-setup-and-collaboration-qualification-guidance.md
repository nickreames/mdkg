---
id: chk-602
type: checkpoint
title: Prepare unpublished 0.6.0 setup and collaboration qualification guidance
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [release/0.6.0-qualification-draft.md]
relates: [root:task-827]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, goal-85, task-827, task-828, task-829, task-830]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-827]
created: 2026-09-11
updated: 2026-09-11
---
# Summary

A maintainer draft now explains candidate setup, scaffold upgrade, identity
adoption, branch reconciliation, recovery limits and final release qualification.
It is explicitly unpublished/not qualified; no unresolved policy is accepted.
Task827 remains in progress. Version metadata waits for bounded fixes as required.

# Scope Covered

Task827 under explicit Goal83 authority, owned by mdkg-project-agent.
The supported goal claim moved Goal83 active_node from completed task824 to
task827 without changing selected Goal73. Existing paused/blocked goal fields
were not interpreted as a withdrawal of Nick's approved run authority.

## Changed Surfaces

- release/0.6.0-qualification-draft.md; task827, Goal83 claim, this checkpoint
  and required mdkg projections. No package inputs or product source changed.

## Boundaries

- Local draft and validation only. Package/lock0.5.2 and public-release0.5.2
  metadata remain unchanged. No canonical migration, bundle/subgraph refresh,
  source fix, remote action, tag, publish, deployment, provider or sibling work.
- All preserved partial Bug17 paths, selection, runtime DB and Demo3 bundle
  retain their prior hashes. Generated SQLite remains uncommitted.
- No secrets, customer content or raw security scan output in the draft.

# Decisions Captured

None newly accepted. The draft labels old-client v2 adoption, killed-writer
recovery and config-less public bundle policy as proposals, not compatibility
promises. Bug35 source-custody permission remains unanswered.

# Implementation Summary

Separate scaffold upgrade, graph-format adoption, semantic reconciliation and
Git integration; keep numeric aliases readable without treating them as immutable
identity. Preserve user instructions and focused skill discovery. Explain the
limits of partial security fixes and the remaining exact-artifact release gates.

# Implementation Details

- No new CLI behavior or data shape. Draft change inventory is incomplete until
  all final package deltas are reconciled; it does not replace CHANGELOG.md yet.
- Public release metadata still describes the already-published0.5.2. The future
  target manifest must become0.6.0/draft together with final metadata preparation.

# Verification / Testing

## Command Evidence

- npm run docs:check:built: generated references/release notes match;
  494 command examples pass. Log SHA256:
  936b5b26b1da5262d280f116f1e36af8f0ff1edf43fb1bf055780f7b1ddca5ba.
- npm run cli:check:built: passes. Log SHA256:
  16b49918680c43f4e1fc7882d48c2b48f90210bf7197972286bd2700fe0f9aaf.
- node --test tests/public-release.test.mjs
  tests/publish-readiness-goal-contract.test.mjs:22pass, zero failures/skips.
  Log SHA256:e4daa877b457891740e09df80e80ab4cba309c9c26da29908b43dc81afa5549b.
- Direct draft checks verify its relative link, qualification/proposal labels
  and unchanged public/package metadata. Manual command guidance was compared
  to CLI_COMMAND_MATRIX.md and identity reconciliation source.
- Closing index/full graph/changed graph/SQLite checks pass:zero graph errors,
  three inherited full-graph warnings, no changed-graph warnings and no SQLite
  failures. git diff --check passes. Protected source/state hashes match and
  no mutation lock remains. Draft SHA256:
  7bc1cdff931bbcfd086cc6f47018c5cb9e446c6bd00038863ac780a368e9768c.
- No fresh full source suite, installed workflow or security scan claimed.
  Existing docs checker does not scan this new maintainer draft; its checks are
  compatibility controls, not proof of every new prose claim.

## Pass / Fail Status

- Draft preparation passes its bounded checks; aggregate qualification NOT_READY.

## Known Warnings

- Three existing stale subgraph warnings remain; no bundle refresh authorized.

# Known Issues / Follow-ups

- Finish blocker fixes, accepted policies, complete change inventory, final
  package/lock metadata, public draft manifest and generated documentation.
- Final independent security review, full release ladder and artifact seal
  remain mandatory. Do not close task827 from this partial milestone.

## Follow-up Refs

- task827,task828,task829,task830,goals83/84/85.

# Links / Artifacts

- release/0.6.0-qualification-draft.md
- Local validation logs:/private/tmp/mdkg-release-draft.jBhkOx.
- Source baseline:303710aa27faaf6121cb7b3eb86ef83b8221c7ef.

# Raw Content Safety

Only portable guidance, summaries and hashes are committed. Skills used:
pursue-mdkg-goal, build-pack-and-execute-task, verify-close-and-checkpoint and
safe-git-publication-preflight. New skill candidates:none.
