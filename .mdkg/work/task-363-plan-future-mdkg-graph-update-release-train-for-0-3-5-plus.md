---
id: task-363
type: task
title: plan future mdkg graph update release train for 0.3.5 plus
status: done
priority: 1
epic: epic-83
tags: [future, graph-upgrade, compatibility, alignment-002]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-81, goal-82, edd-80, edd-81, dec-93, chk-563]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-09-05
---

# Overview

Existing graph compatibility planning lane reused for
MDKG-INTERACTIVE-ALIGNMENT-002 Phase 2. Nick approved the mdkg-only planning
package for compact default bootstrap and complete branch-safe identity.
The historical 0.3.5-plus release title is retained for stable lookup; it is
not a current version commitment or release dependency.

# Acceptance Criteria

- Re-inventory clean baseline, selected goal, claims, local leases/queues and
  source evidence before planning writes.
- Record goals, architecture, task dependencies, test cases, migration gates and
  first implementation increments without executing those future tasks.
- Reuse epic-83/test-151 and retain achieved Goal 17 and prior decisions as history.
- Leave new goals paused/unselected, implementation/tests todo and unclaimed.
- Validate the complete planning graph and exact diff/path boundaries.

# Files Affected

Owned mdkg design/work nodes identified in chk-563 plus required event/index
projections. No source, docs/instruction/skill changes or bundles.

# Implementation Notes

Goal: durable executable plans for the two approved improvements.
Context: baseline main at 9652b8558942041cbebe8f444fbc79e16b1a670d, clean and
matching cached origin/main; current Goal 73 achieved and left selected.
Boundaries: no source implementation, instructions/skills, migration, repair,
Git state operation, cross-project edit, bundle refresh, provider or deployment.
Done when: planning package validated with explicit unclaimed follow-up state.
Evidence: edd-80, edd-81, dec-93, goal-81, goal-82 and chk-563.

Scoped planning ownership: this project agent under direct user approval.
Supported task start/update/done and command-level mutation locks are used;
no invented lease CLI, DB initialization, queue claim or goal activation.
No other active runtime writer lease/queue was evidenced at intake. Historical
archived/blocked goal active_node fields do not identify an overlapping claim.

# Test Plan

- node dist/cli.js validate --changed-only --json
- node dist/cli.js validate --summary --json --limit 20
- Paused-goal/unclaimed-node and reference/path inspection.
- git diff --check and exact unstaged-path review.
- Preserve HEAD, selected goal, Demo bundle and every out-of-scope path.

# Links / Artifacts

- goal-81: task-816 -> task-817 -> task-818 -> test-474.
- goal-82: task-819 -> task-820 -> task-821 -> task-822 with test-151,
  test-475 and test-476.
- edd-80, edd-81, dec-93, chk-563.
- Skill candidates: none. No runtime acceptance tests are claimed by planning.
