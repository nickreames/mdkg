---
id: chk-15
type: checkpoint
title: Goal 5 exact-SHA publication contract ready
checkpoint_kind: handoff
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-5, pre-activation, authority]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, task-48, task-21, task-22, task-49, task-50, task-23, task-24, task-25, task-26, test-12, test-13, test-14, goal-4, chk-14, prd-1, edd-1, dec-4, dec-5, dec-6]
context_refs: [goal-5, epic-5, goal-4, chk-14, prd-1, edd-1, dec-4, dec-5, dec-6]
evidence_refs: [chk-14]
aliases: [goal-5-pre-activation-ready]
skills: []
scope: []
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Goal 5 is hardened as a deterministic two-authority publication workflow while
remaining paused. The accepted local candidate is anchored at `chk-14`; stale
canonical smoke expectations are explicit first work; local commits occur
before the actual push range is frozen; and a separate human approval is
required before any normal push or provider inspection.

# Scope Covered

- Goal 5, epic, and 12-node deterministic chain
- New task-48, task-49, and task-50 boundaries
- Refined task-21 through task-26 and test-12 through test-14 contracts
- PRD, EDD, exact-SHA decision, and Goal 6 predecessor semantics
- Canonical `publish-static-demo-with-exact-sha` skill and both mirrors

# Decisions Captured

- `dec-4`: one root integration owner holds Git mutation authority.
- `dec-5`: local preparation/commit, push approval, push, and provider reads
  are separate authority levels.
- Approval binds the actual post-commit fetched range, not planned work or a
  feature label.
- Approval evidence remains a declared local-only dirty exception and is not
  silently added to the range it approves.

# Implementation Summary

The chain is now:

`smoke repair -> local allowlist -> local commits -> exact-range approval ->
normal push -> exact-SHA deployments -> live routes -> rehearsal -> fallback ->
three independent tests`

The first-node pack uses direct explicit refs and depth 1. A concise dry-run
proves selection and size; a standard dry-run proves full bodies. Both include
the selected node, Goal 5, epic, PRD, EDD, all six decisions, Goal 4, chk-13,
accepted chk-14, this checkpoint, Goal 4 tests, and required skills without
pulling future phase goals or truncating required context.

# Verification / Testing

- New publication skill validates with zero warnings/errors.
- Skill mirrors sync through the nested mdkg configuration.
- Nested full validation and doctor are required to pass with zero unresolved
  warnings.
- `goal next goal-5` deterministically selects `task-48`.
- The depth-1 concise coverage preview and standard full-body execution pack
  contain every required node without truncation; the standard pack contains
  the complete publication skill body.
- Goal 5 remains paused and no program goal is selected.

# Known Issues / Follow-ups

- `npm run smoke:mdkg-dev` currently fails on the obsolete fixture-only Demo 2
  absence assertion. Task-48 owns the bounded later source repair; this
  mdkg-only pass does not change the smoke runner.
- The accepted Demo 2 candidate is still uncommitted and the local branch has a
  substantial pre-existing ahead range. Task-21/22 prepare exact local commits;
  task-49 requires human review of the complete actual range.
- No publication approval exists. Goal 5 activation authorizes only local
  preparation; task-50 remains forbidden until task-49 records explicit
  human approval.

# Links / Artifacts

- `goal-5`
- `chk-14`
- `task-48`
- `task-49`
- `task-50`
- `skill:publish-static-demo-with-exact-sha`
