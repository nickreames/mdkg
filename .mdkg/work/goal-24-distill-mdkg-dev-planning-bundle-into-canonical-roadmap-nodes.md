---
id: goal-24
type: goal
title: Distill mdkg.dev planning bundle into canonical roadmap nodes
status: done
priority: 1
goal_state: achieved
goal_condition: Planning bundle is archived, distilled into canonical PRD EDD DEC nodes, historical external-docs context is superseded, paused implementation goal-25 is fully scoped, graph-only validation passes, and no functional files are changed.
scope_refs: [epic-118, epic-119, epic-120, epic-121, spike-13, task-437, task-438, task-439, task-440, task-441, task-442, task-443, task-444, test-196, test-197, test-198, test-199]
last_active_node: task-444
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js archive verify archive://archive.mdkg-dev-planning-docs-2026-06-22 --json, node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js goal current --json, node dist/cli.js goal next goal-24 --json, node dist/cli.js goal show goal-25 --json, node dist/cli.js pack goal-25 --pack-profile concise, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, planning-ingestion, graph-only, roadmap]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [mdkg-dev-planning-ingestion]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-21
---
# Objective

Ingest the committed mdkg_planning_docs planning bundle into canonical mdkg graph and design records so future mdkg.dev work starts from durable, queryable nodes instead of loose external notes.

# End Condition

This goal is achieved when the source bundle is archived, the planning content is distilled into canonical PRD, EDD, and DEC records, older external-docs-only nodes contain supersession notes, and the future implementation goal exists but remains paused. The final state must validate and must not touch implementation source, package metadata, generated command docs, website files, /docs, /mdkg-dev, or /examples.

# Non-Goals

- Do not scaffold the Astro site, GitBook docs source, examples, demo graphs, or subgraphs.
- Do not change package version, source code, scripts, generated command docs, release metadata, or publish readiness gates.
- Do not publish, deploy, push, tag, globally install, or execute goal-25.
- Do not hardcode a future npm version in the new goal titles.

# Recursive Algorithm

1. Confirm the selected goal is clear or intentionally set to goal-24.
2. Archive the planning bundle and verify the archive sidecar.
3. Distill the planning documents into canonical product, architecture, IA, demo, and source-ownership records.
4. Supersede older external-docs-only context without deleting historical records.
5. Seed a paused implementation roadmap goal with executable epics, tasks, tests, and research.
6. Run the graph-only validation gates, record evidence, then close the goal.

# Required Skills

- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- git status --short --branch
- node dist/cli.js validate --summary --json --limit 20
- node dist/cli.js archive verify archive://archive.mdkg-dev-planning-docs-2026-06-22 --json
- node dist/cli.js index
- node dist/cli.js validate --json
- node dist/cli.js goal current --json
- node dist/cli.js goal next goal-24 --json
- node dist/cli.js goal show goal-25 --json
- node dist/cli.js pack goal-25 --pack-profile concise
- git diff --check

# Acceptance Criteria

- archive://archive.mdkg-dev-planning-docs-2026-06-22 verifies and points to the committed source bundle.
- prd-4, prd-5, edd-24, edd-25, edd-26, edd-27, and dec-30 capture the canonical distilled planning state.
- prd-2, dec-14, and old external-docs tasks retain history but explicitly defer to the new canonical records.
- goal-25 is paused, blocked by goal-24, and has complete implementation epics, tasks, tests, required checks, context refs, and stop conditions.
- Graph validation and git diff --check pass.
- The diff is mdkg-only and graph/design/archive-only.

# Definition Of Done

- Goal condition is achieved.
- Required checks have current evidence in task/checkpoint closeout.
- goal-25 can be packed and inspected without starting implementation work.
- Functional implementation remains untouched.

# Stop Conditions

- Expected IDs are consumed before this pass finishes.
- Archive verification fails.
- Validation reports errors after index refresh.
- The required work would touch forbidden source, package, generated docs, website, /docs, /mdkg-dev, or /examples paths.

# Current State

mdkg_planning_docs and mdkg_planning_docs.zip are committed source evidence. goal-23 is paused and left unchanged. goal-24 owns only ingestion and roadmap seeding; goal-25 owns future implementation.

# Iteration Log

- 2026-06-22: Created the active ingestion goal and scoped graph-only work.

# Skill Improvement Candidates

- Consider a future mdkg import planning-bundle workflow that creates archive, PRD/EDD/DEC, and implementation-goal scaffolds from a curated planning folder.

# Completion Evidence

Pending final validation and checkpoint closeout.
