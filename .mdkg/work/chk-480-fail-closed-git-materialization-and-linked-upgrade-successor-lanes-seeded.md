---
id: chk-480
type: checkpoint
title: fail-closed Git materialization and linked upgrade successor lanes seeded
checkpoint_kind: goal-closeout
status: done
priority: 1
tags: [checkpoint, goal-65, git, materialization, upgrade, planning]
owners: []
links: []
artifacts: []
relates: [goal-65, goal-66, goal-67, goal-68]
blocked_by: []
blocks: []
refs: [goal-65, goal-66, goal-67, goal-68, edd-73, dec-75, dec-76, dec-77, dec-78, dec-79, task-743, task-744, task-745, test-408, test-409, test-410, task-752]
context_refs: [goal-52, goal-60, goal-62, goal-63, goal-64, dec-61, dec-63, dec-64]
evidence_refs: [task-743, task-744, task-745, test-408, test-409, test-410]
aliases: [git-materialization-linked-upgrade-planning-closeout]
skills: [verify-close-and-checkpoint]
scope: [goal-65, task-743, task-744, task-745, test-408, test-409, test-410]
created: 2026-07-11
updated: 2026-07-11
---

# Summary

Closed `goal-65` after grounding the existing 0.4.2 Git lifecycle and
single-repository upgrade implementation, accepting a generic fail-closed JSON
materialization contract, and seeding three separate paused successor lanes.
No functional implementation or release mutation belongs to this checkpoint.

# Scope Covered

- `edd-73` defines transactional materialization and optional linked upgrades.
- `dec-75` through `dec-79` lock command, identity, atomicity, auth,
  discovery, submodule, deferral, and multi-repo safety decisions.
- `goal-66` owns generic materialization implementation after `goal-64`.
- `goal-67` owns version selection and approval-gated publication.
- `goal-68` owns optional linked-repository scaffold upgrade orchestration and
  does not block downstream materialization consumers.
- `task-752` defers YAML request input without blocking JSON v1.

## Boundaries

- This pass adds `.mdkg/design` and `.mdkg/work` semantic files only.
- Existing `goal-60` and `goal-62` through `goal-64` remain owned by the
  concurrent release writer and are excluded from this pass staging.
- No TypeScript, tests, public docs, generated command contract, templates,
  skills, package metadata, website, release, downstream repo, push, publish,
  tag, deploy, or global install mutation is included.

# Decisions Captured

- Add JSON-only `mdkg git materialize --request <file|->`; preserve clone.
- Require target ref and expected commit; verify optional expected tree.
- Publish only by verified sibling-temp rename and clean failures.
- Keep auth external and receipts refs-only.
- Default project-memory discovery to optional with required/forbidden modes.
- Support deny/ignore submodules; defer recursion and YAML.
- Make linked upgrades explicit, strict-preflight, root-first, include/exclude
  capable, and free of install/stage/commit/push/subgraph/gitlink side effects.

# Implementation Summary

This was an mdkg-only planning implementation. It added accepted design records,
one achieved planning goal, three paused successor goals, implementation-ready
tasks/tests, one YAML follow-up, and this checkpoint. No CLI or package behavior
was implemented.

# Source Evidence

- `src/commands/git.ts`: observed inspect/clone descriptors and accepted
  revision receipts without caller-enforced transaction identity.
- `src/commands/upgrade.ts`: observed one-root managed scaffold planning/apply.
- `src/commands/subgraph.ts`: observed read-only upgrade-plan and root-owned
  projection sync boundary.
- Root handoff:
  `/Users/nick/omni-chat-rooms/.mdkg/work/task-458-harden-generic-git-source-materialization-and-accepted-revision-enforcement.md`.

# Protected Concurrent State

Pre-pass hashes captured before semantic additions:

- `goal-60`: `499fe92e6321a6609db771f843dae19fbb84aec2`
- `goal-62`: `ef5461842a7252be2b16b93a4467376a5d931f45`
- `goal-63`: `3217ebc90ee4bb8d55f167cc2ab9cadfe37cb1df`
- `goal-64`: `ac8ca90187f9e33be99ec67fe765e8e5a0fee493`

The release writer continued changing existing goal-63 implementation files
during this pass. Final staging must therefore prove these paths and every
other pre-existing path are excluded rather than claiming the shared worktree
was globally static.

Final protected hashes equal the pre-pass values above. Concurrent functional
and release-planning paths remain dirty but are not part of this pass staging.

# Verification / Testing

Command evidence:

- `node dist/cli.js index`: passed and discovered all new nodes. The shared
  generated index remains excluded from this pass staging because it is also
  owned by the concurrent release lane.
- `node dist/cli.js validate --changed-only --json`: passed with 0 warnings and
  0 errors.
- `node dist/cli.js validate --summary --limit 20 --json`: passed with 0
  warnings and 0 errors.
- `node dist/cli.js goal show goal-65 --json`: reported done/achieved.
- `node dist/cli.js goal next goal-65 --json`: returned `node: null`.
- `node dist/cli.js goal evaluate goal-65 --json`: reported completion evidence
  present.
- `node dist/cli.js goal next goal-66 --json`: routed to `task-746`.
- `node dist/cli.js goal next goal-67 --json`: routed to `task-753`.
- `node dist/cli.js goal next goal-68 --json`: routed to `task-758`.
- Capability searches for Git source materialization/accepted revision and
  linked repository upgrade both resolved `edd-73`.
- `git diff --check`: passed.
- Protected goal hash check: all four hashes match the pre-pass values.

Paused-goal routing reports non-actionable design/dependency context as warnings
while selecting the intended concrete first task. There is no actionable-node
ambiguity.

# Goal Closeout

- Goal condition: achieved after final validation receipts are attached.
- Planning nodes: `task-743` through `task-745` and `test-408` through
  `test-410` are done.
- Successor goals remain paused and unselected.
- Recommended execution order: finish `goal-64`, run `goal-66`, run `goal-67`,
  upgrade consumers, then pursue downstream runtime/sandbox/root goals.

# Known Issues / Follow-ups

- `goal-66` remains paused until `goal-64` is achieved.
- `goal-67` remains paused until `goal-66` is achieved.
- `goal-68` and `task-752` are intentionally non-blocking follow-ups.
- Concurrent release-writer dirtiness remains outside this pass and must not be
  staged or attributed to this checkpoint.

# Git / Publication State

- Local planning commit: created after this checkpoint and reported in final
  chat/commit output.
- Push: not performed.
- Publish/tag/deploy/global install: not performed.
- Dirty concurrent release work: preserved and excluded from staging.

# Raw Content Safety

Evidence contains source paths, node refs, command names, bounded statuses, and
hashes only. No credentials, auth values, prompts, repository bodies, provider
payloads, or runtime state contents are retained.

# Links / Artifacts

- `edd-73`
- `dec-75` through `dec-79`
- `goal-66`, `goal-67`, and `goal-68`
- root handoff path recorded under Source Evidence
