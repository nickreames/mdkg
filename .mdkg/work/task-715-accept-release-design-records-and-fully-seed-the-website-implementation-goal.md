---
id: task-715
type: task
title: Accept release design records and fully seed the website implementation goal
status: done
priority: 1
epic: epic-231
prev: task-714
tags: [release, design, handoff, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63, test-387]
blocked_by: [task-714]
blocks: [test-387]
refs: [goal-63, test-387, edd-71, dec-68, dec-73, dec-74, prd-11, prop-7, prop-8, epic-236, epic-237, epic-238, epic-239, epic-240]
context_refs: [goal-62, goal-63, epic-231, edd-71, dec-68, dec-73, dec-74, prd-11, prop-7, prop-8, task-714]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Finalize accepted planning records and convert `goal-63` from an empty placeholder
into a fully executable local website/docs implementation goal.

# Acceptance Criteria

- EDD, DEC, PRD, claim ledger, screenshots, audit, three concepts, and operator
  decision are complete and mutually consistent.
- Goal 63 receives exact epics, tasks, tests, assets, copy, routes, browser checks,
  required skills/checks, active node, and accepted design refs.
- Its implementation lanes cover shared release-state gating, the incremental
  homepage announcement, top-level loop docs and security walkthrough,
  upgrade/release metadata, and responsive/accessibility/browser proof.
- Goal 63 becomes unblocked and active only after Goal 62 closes.
- Goal 63 still prohibits push/deploy and keeps activation dormant.

# Files Affected

List files/directories expected to change.

- `.mdkg/design/edd-71-*`, `dec-68-*`, and `prd-11-*`
- `.mdkg/work/goal-63-*` and newly allocated child nodes

# Implementation Notes

- Allocate new child IDs with `mdkg new`; do not pre-guess them.
- This task is mdkg-only and makes no website/docs source changes.

# Test Plan

Run `test-387`, validate the graph, show/next Goal 63, and dry-run a concise pack
for its first implementation task.

# Results / Evidence

- Accepted planning state is mutually consistent across `edd-71`, `dec-68`,
  `dec-73`, `dec-74`, `prd-11`, `prop-7`, and `prop-8`.
- Allocated five epics (`epic-236` through `epic-240`), thirteen tasks
  (`task-730` through `task-742`), and seven tests (`test-401` through
  `test-407`) through `mdkg new`.
- Goal 63 now contains exact manifest, Process Rail, Loops IA, security
  walkthrough, upgrade/reference, smoke, browser, accessibility, local-commit,
  and Goal 64 handoff contracts.
- Goal 63 points to `task-730` first and remains paused behind Goal 62 until
  `test-387` passes and Goal 62 closes.
- Package, website, docs, generated command, test, release, and deployment source
  files remain untouched in this mdkg-only planning task.

# Links / Artifacts

- `goal-63`
- `edd-71`
- `dec-68`
- `dec-73`
- `dec-74`
- `prop-8`
- `prd-11`
