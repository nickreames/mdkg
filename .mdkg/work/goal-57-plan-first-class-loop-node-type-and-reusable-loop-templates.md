---
id: goal-57
type: goal
title: Plan first-class loop node type and reusable loop templates
status: done
priority: 1
goal_state: achieved
goal_condition: First-class loop planning is complete only after mdkg has an accepted loop operating-model EDD, an accepted decision that MVP loop is one node type, scoped epics/tasks/tests for reusable read-only and planning loop templates, explicit validation/index/pack/CLI contracts, and a populated or deliberately deferred implementation goal.
scope_refs: [task-667, task-668, task-669, task-670, task-671, task-672, task-673, task-674, test-344, test-345, test-346, test-347, test-348, test-349, test-350]
last_active_node: task-674
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, mdkg search loop --json, mdkg search CocoIndex --json, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, mdkg goal show goal-57 --json, mdkg goal show goal-58 --json, mdkg goal next goal-57 --json, mdkg pack task-667 --pack-profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [loop, planning, node-type, agent-harness, templates]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [goal-58]
refs: [edd-66, dec-65, edd-10, edd-63, goal-53]
context_refs: [edd-10, edd-63, goal-53, edd-66, dec-65]
evidence_refs: []
aliases: [first-class-loop-planning, loop-node-planning, reusable-loop-templates]
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Objective

Plan a first-class mdkg `loop` node type and reusable loop-template operating
model before any source implementation starts. The design should make loops
durable graph objects for reusable agentic processes, not transient runtime jobs
or prose-only recipes.

# End Condition

This goal is achieved when:

- `edd-66` defines the loop operating model, lifecycle, ownership boundaries,
  validation/index/pack implications, and rollout plan.
- `dec-65` is accepted or superseded with an explicit decision about MVP node
  shape.
- Planning epics, tasks, and tests describe the implementation-ready work.
- `goal-58` is either populated with executable implementation scope or remains
  explicitly deferred with a documented reason.
- CocoIndex/project-memory indexing remains separated into `goal-53` or a later
  superseding planning lane.

# Non-Goals

- Do not implement a `loop` node type in source code during this planning goal.
- Do not change CLI behavior, templates, generated docs, seed folders, or tests.
- Do not add CocoIndex, semantic search, embedding, remote-reference, JSON, or
  SQLite provider work to the loop-node implementation goal.
- Do not replace `goal`; goals remain outcome-oriented while loops become
  process-oriented.
- Do not make mdkg responsible for executing agents, tools, sandboxes, traces,
  or model routing; that remains runtime-owned.

# Recursive Algorithm

1. Ground the current goal architecture, node-type parsing, templates,
   validation, index, search, show, pack, and command-reference surfaces.
2. Define loop boundaries against goals, skills, runtime execution, work nodes,
   receipts, checkpoints, proposals, and events.
3. Specify the single-node MVP model: one `loop` node type may be a template,
   forked/scoped loop, or run-bearing loop through metadata and links.
4. Specify template, fork, run, provenance, stale-fork, and promotion behavior.
5. Specify non-blocking blocker behavior: create or request a spike, proposal
   with at least three viable paths, recommended path, blocker evidence on
   affected goals, and then continue toward other useful scoped work where
   possible.
6. Specify seeded read-only and planning loop templates.
7. Specify high-level `mdkg loop` command and structured-output expectations
   without exposing low-level graph mechanics.
8. Specify implementation acceptance tests and then populate or defer `goal-58`.
9. Run the required mdkg-only validation checks and record evidence.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `mdkg search "loop" --json`
- `mdkg search "CocoIndex" --json`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --json --limit 20`
- `mdkg goal show goal-57 --json`
- `mdkg goal show goal-58 --json`
- `mdkg goal next goal-57 --json`
- `mdkg pack task-667 --pack-profile concise --dry-run --stats`
- `git diff --check`

# Acceptance Criteria

- Loop is planned as one first-class mdkg node type for MVP.
- Loop semantics describe purpose, scope, lineage, lifecycle, linked subnodes,
  evidence, decisions, outputs, gates, and validation.
- The default fork behavior creates linked child nodes immediately, with a
  planning-only or no-child materialization option.
- Initial seed catalog covers security audit, design/frontend UX audit,
  backend/API/CLI design-bloat audit, tech-stack best-practices audit,
  duplicate-code/linting audit, test/CI/SKILL.md infrastructure audit, and
  user-story audit and recommendations.
- Blocker handling routes to spike/proposal/recommendation work instead of
  treating early blockers as a loop-ending condition.
- Implementation scope preserves existing goal behavior and keeps
  omni-room-runtime responsible for execution.
- CocoIndex remains outside the loop-node pass.

# Definition Of Done

- Goal condition is achieved.
- `edd-66` and `dec-65` contain design-complete planning text.
- `goal-58` is still paused/blocked or has explicit executable scope populated
  only after design acceptance.
- Required checks have evidence.
- Completion evidence is recorded in this goal.

# Stop Conditions

- Current source behavior contradicts the proposed node model and no acceptable
  alternative is selected.
- Service-boundary ownership between mdkg core and runtime execution remains
  unresolved.
- The design starts depending on CocoIndex or semantic search despite this
  goal's explicit scope boundary.
- Required context or operator intent is missing.

# Current State

Active planning lane. All scoped planning tasks and test-contract authoring
nodes are done. `goal-58` remains the intentionally paused/blocked
implementation placeholder with empty executable scope.

# Iteration Log

- 2026-07-05: Created planning lane, implementation placeholder, design
  anchors, epics, tasks, and test contracts.
- 2026-07-05: Activated `goal-57`, completed `task-667` through `task-674`,
  accepted `dec-65`, recorded acceptance state in `edd-66`, enriched `goal-58`
  with planning context while keeping `scope_refs` empty, and closed
  `test-344` through `test-350` as planning-pass evidence/contracts.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

Planning completed locally on 2026-07-05.

- `edd-66` now defines the operating model, ownership split,
  source-grounded implementation surfaces, single-node MVP lifecycle,
  template/fork/run provenance, seed catalog, CLI/API expectations,
  blocker-continuation policy, validation/index/pack/test requirements,
  security/privacy boundaries, and rollout.
- `dec-65` is accepted and records the decision that MVP loop is one first-class
  node type, not separate `loop_template` or `loop_run` types.
- Planning tasks `task-667` through `task-674` are done.
- Test/contract nodes `test-344` through `test-350` are done for this planning
  lane. Future implementation behavior remains to be executed under `goal-58`.
- `goal-58` remains `status: blocked`, `goal_state: paused`, and has empty
  `scope_refs`; it carries planning context refs only.
- CocoIndex remains separate in `goal-53` or a future superseding
  project-memory/index-provider planning lane.
- No source code, templates, CLI behavior, docs, seed files, or generated
  command surfaces were implemented in this planning goal.
