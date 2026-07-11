---
id: goal-68
type: goal
title: implement optional linked repository mdkg scaffold upgrades
status: todo
priority: 2
goal_state: paused
goal_condition: Optional linked upgrade mode is complete when the existing single-repository default remains unchanged, explicit linked include and exclude selection is deterministic and containment-safe, strict all-target dry-run blocks every write on unsafe overlap, sequential apply emits complete or explicit partial receipts, unrelated dirtiness is preserved, and the command never installs mdkg infers Git submodules stages commits pushes registers subgraphs refreshes bundles or changes gitlinks.
scope_refs: [task-758, task-759, task-760, task-761, task-762, test-420, test-421, test-422, test-423, test-424]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node dist/cli.js upgrade --help, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, npm pack --dry-run --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [upgrade, multi-repo, subgraph, scaffold, optional]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-73, dec-79]
context_refs: [goal-60, goal-65, edd-73, dec-79]
evidence_refs: []
aliases: [linked-repository-upgrade]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Objective

Add an explicit agent-safe orchestration mode that applies the installed mdkg
scaffold upgrade contract across one root and selected local mdkg repositories.

# End Condition

`mdkg upgrade --linked` supports repeatable include/exclude selectors, strict
aggregate preflight, bounded sequential apply, deterministic receipts, and
packed-package/docs parity without taking Git or subgraph-refresh ownership.

# Non-Goals

- No implicit discovery from `.gitmodules`.
- No external repository paths in v1; includes stay contained under root.
- No npm version resolution, package installation, staging, commit, push,
  subgraph registration/sync, or gitlink mutation.
- No requirement that this goal complete before materialization consumers.

# Recursive Algorithm

1. Freeze selector, ordering, receipt, and compatibility contracts.
2. Aggregate existing per-repo dry-run receipts and dirty-overlap checks.
3. Implement strict preflight and bounded sequential apply with locks.
4. Emit explicit complete, blocked, or partial receipts.
5. Align help, generated contract, docs, tests, and packed-package smokes.

# Required Skills

Use the required skills in frontmatter.

# Required Checks

Run all source/package checks plus a multi-repository temporary fixture matrix.

# Acceptance Criteria

- Root is always first; enabled local `source_path` targets follow by alias.
- Explicit excludes win and duplicate canonical targets fail.
- No apply begins unless every selected plan is safe and overlap-free.
- Unrelated dirtiness is reported but preserved.
- Apply-time race stops remaining targets and records applied/pending sets.
- Existing `mdkg upgrade` behavior remains unchanged without `--linked`.

# Definition Of Done

- Goal condition is achieved and packed-package proof passes.
- Commit and subgraph refresh remain explicit downstream steps.

# Stop Conditions

- Scope starts treating read-only subgraph projection as write authorization.
- Safe behavior requires cross-repository rollback or hidden Git mutation.
- Generic upgrade compatibility cannot be preserved.

# Current State

Paused non-blocking successor. First node is `task-758`.

# Iteration Log

- 2026-07-11: Seeded from accepted `dec-79`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
