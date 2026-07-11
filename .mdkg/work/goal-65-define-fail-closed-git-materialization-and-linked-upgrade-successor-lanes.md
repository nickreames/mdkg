---
id: goal-65
type: goal
title: define fail-closed Git materialization and linked upgrade successor lanes
status: done
priority: 1
goal_state: achieved
goal_condition: Planning is complete when current Git and upgrade source behavior is reconciled with the external handoff, generic materialization and linked-upgrade decisions are accepted, implementation publication and optional linked-upgrade goals are routable, YAML remains a non-blocking follow-up, protected release nodes are unchanged, and one checkpoint records validation and local-only closeout evidence.
scope_refs: [task-743, task-744, task-745, test-408, test-409, test-410]
last_active_node: task-745
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js status --json, node dist/cli.js index, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --limit 20 --json, node dist/cli.js goal show goal-65 --json, node dist/cli.js goal next goal-65 --json, node dist/cli.js goal evaluate goal-65 --json, git diff --check]
max_iterations: 15
blocked_after_attempts: 3
tags: [git, materialization, upgrade, planning, successor]
owners: []
links: []
artifacts: [chk-480]
relates: [goal-52, goal-60]
blocked_by: []
blocks: []
refs: [edd-73, dec-75, dec-76, dec-77, dec-78, dec-79, goal-66, goal-67, goal-68]
context_refs: [goal-52, goal-60, goal-64, edd-73, dec-61, dec-63, dec-64, dec-75, dec-76, dec-77, dec-78, dec-79]
evidence_refs: [chk-480]
aliases: [git-materialization-linked-upgrade-planning]
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Objective

Turn the root-owned generic Git materialization handoff into a source-grounded,
product-neutral mdkg execution program without altering the active release
program or implementing functional behavior.

# End Condition

The design spine and three paused successor goals are decision-complete, route
to concrete first tasks, preserve current public command compatibility, and
separate implementation, publication, and optional linked-upgrade ownership.

# Non-Goals

- No TypeScript, tests, docs, package, generated contract, init asset, skill,
  website, or release implementation.
- No edits to `goal-60` or `goal-62` through `goal-64`.
- No push, publish, tag, deployment, global install, or downstream mutation.

# Recursive Algorithm

1. Re-audit current `mdkg git`, `upgrade`, and subgraph source behavior.
2. Lock generic request, identity, auth, discovery, submodule, atomicity, and
   linked-upgrade decisions.
3. Seed separate implementation, publication, and optional upgrade goals.
4. Validate graph routing and protected-node boundaries.
5. Record the closeout checkpoint and local-only commit.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

Use the frontmatter checks with the source checkout CLI so first-class loop
nodes in the concurrent release lane remain parseable.

# Acceptance Criteria

- Public capability names are generic and contain no downstream product names.
- `goal-66`, `goal-67`, and `goal-68` are paused and implementation-ready.
- `task-752` records YAML as a non-blocking follow-up.
- Existing release goals retain their pre-pass content hashes.
- Only new `.mdkg/design` and `.mdkg/work` semantic files are committed.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence in `chk-480`.
- Completion evidence is committed locally and not pushed.

# Stop Conditions

- A new node collides with concurrent semantic IDs.
- Work expands into functional or release-program surfaces.
- Validation identifies a contract ambiguity requiring operator input.

# Current State

Achieved by the additive planning pass. The current release writer remained
authoritative for existing goal and implementation files.

# Iteration Log

- 2026-07-11: Grounded current 0.4.2 Git/upgrade behavior, accepted the v1
  decisions, and seeded successor lanes.

# Skill Improvement Candidates

- None. Existing boundary and closeout skills cover this planning lane.

# Completion Evidence

- `chk-480`
