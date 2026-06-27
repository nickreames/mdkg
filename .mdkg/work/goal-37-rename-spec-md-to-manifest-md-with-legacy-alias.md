---
id: goal-37
type: goal
title: Rename SPEC.md to MANIFEST.md with legacy alias
status: progress
priority: 1
goal_state: active
goal_condition: mdkg treats MANIFEST.md as the canonical Omni semantic file for reusable capability, agent, runtime, and project manifests while preserving SPEC.md as an explicit legacy alias for one compatibility release, with validation, indexing, search, pack, CLI scaffold, docs, skills, fixtures, and release gates proving both canonical and legacy behavior.
scope_refs: [epic-194, epic-195, epic-196, epic-197, epic-198, task-573, task-574, task-575, task-576, task-577, task-578, task-579, task-580, task-581, task-582, task-583, task-584, test-289, test-290, test-291, test-292, test-293, test-294, test-295, test-296]
active_node: task-575
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, rg -n "SPEC\\.md|MANIFEST\\.md|type: spec|type: manifest|OmniFileKind|WORK_ORDER\\.md|WORK\\.md|manifest" src tests docs .mdkg README.md CLI_COMMAND_MATRIX.md, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run smoke:capabilities, npm run smoke:archive-work, npm run smoke:bundle, npm run smoke:subgraph, npm run docs:check, node dist/cli.js validate --json, node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json, node dist/cli.js pack task-573 --profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [manifest, spec, compatibility, omni, semantic-files, implementation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, dec-50, edd-14, dec-26, task-276]
context_refs: [goal-8, goal-9, edd-14, edd-15, dec-21, dec-22, dec-26, task-276, task-277]
evidence_refs: []
aliases: [manifest-md-rename, spec-md-legacy-alias, manifest-md-legacy-spec-md, manifest.md, manifest.md-legacy-spec.md, spec.md-compatibility-alias]
skills: [pursue-mdkg-goal, select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-25
updated: 2026-06-25
---
# Objective

Rename mdkg's Omni semantic file type from `SPEC.md` to `MANIFEST.md` without
breaking existing repositories during the first compatibility release.

This goal is source implementation work for a later coding pass. The current
graph-only pass records the plan, boundaries, tasks, tests, and policy. The
goal remains paused so it does not replace the active `goal-23` release lane.

# End Condition

The goal is achieved only when all of the following are true:

- `MANIFEST.md` is the canonical file basename and user-facing term.
- Canonical manifests use `type: manifest` and preserve the reusable capability
  semantics previously associated with `SPEC.md`.
- `SPEC.md` with `type: spec` remains valid as an explicit legacy alias for one
  compatibility release.
- `MANIFEST.md` with transitional `type: spec` is accepted for one
  compatibility release, emits a deprecation warning, and normalizes internally
  to manifest semantics.
- `MANIFEST.md` and `SPEC.md` in the same logical Omni unit fail validation as
  an ambiguity error.
- Indexing, search, capability discovery, pack traversal, graph refs,
  dependency validation, work trigger behavior, bundles, subgraphs, and
  visibility checks handle both names during the one-compatibility-release
  window.
- New scaffolds, templates, docs, help, generated references, and skills prefer
  `MANIFEST.md`.
- Focused and full release gates pass, evidence is checkpointed, and a local
  commit exists. No push, publish, tag, or downstream repo mutation occurs.

# Non-Goals

- Do not remove `SPEC.md` support in this goal.
- Do not rename `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`,
  `DISPUTE.md`, or `PROPOSAL.md`.
- Do not add shell execution semantics to manifests.
- Do not make `MANIFEST.md` arbitrary config; it remains a declarative Omni
  semantic file for runtime/capability identity and contracts.
- Do not mutate downstream runtime repos; produce a handoff only.
- Do not publish npm, tag, push, deploy, or change public hosting.

# Recursive Algorithm

1. Activate `goal-37` only after the current active release lane is complete or
   deliberately paused.
2. Start with `task-573` and inventory all `SPEC.md`, `spec`, `Spec`,
   `OmniFileKind`, `WORK.md`, and `WORK_ORDER.md` surfaces before source edits.
3. Work the scoped tasks in phase order: audit/policy, parser/validation,
   index/pack/ref compatibility, scaffolds/docs/skills, fixtures/gates/handoff.
4. For each implementation task, add or update focused tests before broad
   generated docs/index changes.
5. Preserve legacy `SPEC.md` behavior unless an explicit task records an
   approved compatibility exception.
6. Run focused tests after each phase, then run the full required checks before
   checkpoint and local commit.
7. Evaluate the goal and close only after the downstream handoff and
   compatibility evidence are durable.

# Required Skills

- pursue-mdkg-goal
- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- `git status --short --branch`
- `rg -n "SPEC\\.md|MANIFEST\\.md|type: spec|type: manifest|OmniFileKind|WORK_ORDER\\.md|WORK\\.md|manifest" src tests docs .mdkg README.md CLI_COMMAND_MATRIX.md`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:subgraph`
- `npm run docs:check`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json`
- `node dist/cli.js pack task-573 --profile concise --dry-run --stats`
- `git diff --check`

# Acceptance Criteria

- `mdkg new manifest` or equivalent canonical scaffold path creates
  `MANIFEST.md`.
- `mdkg manifest ...` is the canonical future command family.
- Any retained `mdkg spec ...` command is explicitly deprecated or legacy-labeled
  and preserves one-compatibility-release behavior.
- Capability/search output remains useful for both `MANIFEST.md` and `SPEC.md`
  queries during the bridge.
- Warning text identifies `SPEC.md` as legacy and recommends `MANIFEST.md`.
- Duplicate canonical and legacy files in one logical unit fail validation.
- Existing `SPEC.md` fixtures and downstream-like temp repos continue passing
  under compatibility rules.
- Generated command docs, command matrix, docs site content, README, skills, and
  example graph indexes are refreshed only after source behavior is proven.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Focused test nodes `test-289` through `test-296` are done or explicitly
  superseded with equivalent coverage.
- Completion evidence is recorded in this goal and in a checkpoint.
- A local commit captures the implementation. No push has occurred.

# Stop Conditions

- A proposed change would break existing `SPEC.md` repos in the
  one-compatibility-release window.
- Two different logical meanings for `MANIFEST.md` emerge and require a new
  decision before implementation.
- CLI JSON compatibility would break without an explicit compatibility decision.
- Full release gates require npm publish, tag, push, or downstream mutation.

# Current State

Graph-only planning nodes were created on 2026-06-25. Current source still uses
`SPEC.md` as the public term across parser, validation, capability discovery,
docs, skills, templates, and fixtures. Live selected goal remains `goal-23`;
`goal-37` is paused until explicitly activated.

# Compatibility Policy

- `mdkg manifest ...` is the canonical future command family.
- `mdkg spec ...` remains as a legacy alias for one compatibility release with
  manifest-first output and deprecation labeling.
- `MANIFEST.md` with transitional `type: spec` warns and normalizes to manifest
  semantics for one compatibility release.
- `SPEC.md` with `type: spec` warns and normalizes to manifest semantics for one
  compatibility release.
- `MANIFEST.md` and sibling `SPEC.md` in the same logical unit fail validation
  as an ambiguity error.

# Iteration Log

- 2026-06-25: Created paused graph-only implementation plan with `edd-54`,
  `dec-50`, epics `epic-194` through `epic-198`, tasks `task-573` through
  `task-584`, and tests `test-289` through `test-296`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
