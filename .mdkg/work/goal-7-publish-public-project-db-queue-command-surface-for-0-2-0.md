---
id: goal-7
type: goal
title: Publish public project DB queue command surface for 0.2.0
status: done
priority: 1
goal_state: achieved
goal_condition: Publish mdkg 0.2.0 with a public `mdkg db queue ...` CLI, queue pause/resume control state, snapshot queue-policy gates, packed CLI-only smoke, npm registry verification, global install, and temp-directory E2E proof.
scope_refs: [epic-29, epic-31, epic-33]
last_active_node: task-265
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate, npm run smoke:db, npm run smoke:db-queue, npm run smoke:db-queue-cli, npm run smoke:db-events, npm run smoke:db-materializer, npm run smoke:db-snapshot, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [project-db, queue, cli, release, 0_2_0]
owners: []
links: []
artifacts: []
relates: [goal-3, goal-5, goal-6, epic-29, epic-33]
blocked_by: []
blocks: [task-260, task-261, task-262, task-263, task-264, task-265, test-95, test-96, test-97]
refs: []
aliases: []
skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-05
updated: 2026-06-05
---
# Objective

Make project DB queues usable through a public `mdkg db queue ...` command
surface and publish that surface as `mdkg@0.2.0`.

# End Condition

`mdkg@0.2.0` is published to npm, installed globally from the public registry on
this machine, and proven in a fresh temp repo using only the global binary. The
proof must cover queue create/pause/resume/enqueue/claim/ack/fail/dead-letter,
drain-safe and paused snapshot sealing, db health checks, graph validation, and
ignore policy.

# Non-Goals

- Top-level `mdkg queue` alias.
- Public event, reducer, lease, or materializer CLI.
- Git tag or push unless separately requested.
- Reverting unrelated dirty worktree changes.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `pursue-mdkg-goal`
- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:db`
- `npm run smoke:db-queue`
- `npm run smoke:db-queue-cli`
- `npm run smoke:db-events`
- `npm run smoke:db-materializer`
- `npm run smoke:db-snapshot`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `mdkg db queue` is documented in help, README, command matrix, init assets,
  and changelog.
- Queue control state supports active/paused queues, rejects enqueue/claim while
  paused, and still allows settlement actions.
- Snapshot sealing defaults to drained queue state and supports an explicit
  paused-queue policy.
- Packed and global temp E2E use public CLI commands, not private helper imports.
- npm registry latest is checked before real publish and after publish.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- npm registry already has `0.2.0`; stop and re-plan `0.2.1`.
- npm publish fails due token, 2FA, or package policy after checks are green.
- Global install into `/opt/homebrew` is denied by the OS.
- Any required release gate fails and cannot be fixed without changing scope.

# Current State

`goal-6` is paused so the public queue release can take priority. Current
published npm latest was previously verified as `0.1.10`; source and local
global install are on `0.2.0`.

# Iteration Log

- 2026-06-05: Created the public queue release goal and scoped task/test lane.
- 2026-06-06: Completed implementation, docs, local gates, packed CLI smoke,
  dry-run publish, local tarball global install, and global temp E2E. Paused at
  `task-265` because the real npm publish command was denied by the approval
  policy as external public registry disclosure.
- 2026-06-06: Retried publish with explicit user approval and a temporary npm
  userconfig mapping `NPM_TOKEN` to registry auth. Real publish succeeded,
  registry dist-tag `latest` reports `0.2.0`, registry-backed global install
  completed, and a fresh global temp E2E passed.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pre-publish registry guard: `mdkg@latest` was `0.1.10`.
- `npm publish --dry-run` passed after the full package prepublish ladder.
- `/opt/homebrew/bin/mdkg --version` reported `0.2.0` after local tarball
  global install.
- Global temp E2E passed at
  `/private/tmp/mdkg-public-queue-0.2.0.647Lzo/repo`.
- Real `npm publish --registry=https://registry.npmjs.org/` succeeded with
  `+ mdkg@0.2.0`.
- `npm view mdkg@0.2.0 version --prefer-online` returned `0.2.0`; npm
  dist-tags report `latest: 0.2.0`.
- Registry-backed `npm install -g mdkg@0.2.0` installed to
  `/opt/homebrew/bin/mdkg`.
- Registry-installed global temp E2E passed at
  `/private/tmp/mdkg-public-queue-registry-0.2.0.ks9F87/repo`.
