---
id: task-457
type: task
title: verify goal-25 completeness and derived state hygiene
status: done
priority: 1
epic: epic-127
parent: goal-26
tags: [mdkg-dev, goal-audit, derived-state]
owners: []
links: []
artifacts: []
relates: [goal-26, test-207]
blocked_by: [task-456]
blocks: []
refs: []
context_refs: [chk-186, chk-187, chk-188, chk-189, chk-190, chk-191, chk-192, chk-193, chk-194]
evidence_refs: [chk-195]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Independently verify that goal-25 is complete and that derived graph/index/subgraph state is current before Browser E2E begins.

# Acceptance Criteria

- `node dist/cli.js index` has been run.
- `node dist/cli.js validate --summary --json --limit 20` is clean.
- `node dist/cli.js doctor --strict --json` is clean or accepted warnings are recorded.
- `node dist/cli.js goal show goal-25 --json` confirms `status: done`, `goal_state: achieved`, and `last_active_node: task-454`.
- `node dist/cli.js goal next goal-25 --json` returns `node: null` with no warnings.
- `node dist/cli.js goal current --json` is understood and does not leave stale achieved work selected.
- `task-445` through `task-455`, `test-200` through `test-206`, and `chk-186` through `chk-194` exist with coherent evidence.
- Demo subgraph warnings are fixed or documented as acceptable snapshot policy.
- A baseline audit checkpoint is created.

# Files Affected

- `.mdkg/work/chk-*`
- `.mdkg/config.json` only if stale subgraph freshness policy needs evidence-aligned clarification.

# Implementation Notes

- This task may update checkpoint text if existing evidence is stale or incomplete.
- Do not edit mdkg-dev source from this task.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js goal show goal-25 --json`
- `node dist/cli.js goal next goal-25 --json`
- `node dist/cli.js subgraph verify --all --json`

# Links / Artifacts

- goal-25
- chk-194
- chk-195

# Closeout Evidence

- Baseline audit checkpoint: chk-195.
- `node dist/cli.js validate --summary --json --limit 20`: pass, warning_count 0, error_count 0.
- `node dist/cli.js doctor --strict --json`: ok true; accepted local-only DB runtime warning verified by `node dist/cli.js db verify --json`.
- `node dist/cli.js goal show goal-25 --json`: `status: done`, `goal_state: achieved`, `last_active_node: task-454`.
- `node dist/cli.js goal next goal-25 --json`: `node: null`, warnings [].
- `node dist/cli.js subgraph verify --all --json`: pass, two subgraphs, both fresh and warning/error free.
