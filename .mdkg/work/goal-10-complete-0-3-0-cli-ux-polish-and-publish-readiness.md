---
id: goal-10
type: goal
title: Complete 0.3.0 CLI UX polish and publish readiness
status: done
priority: 1
goal_state: achieved
goal_condition: The goal is complete when 0.3.0 CLI UX polish is implemented, docs/help examples are coherent, a packed temp-repo CLI UX polish smoke passes, full prepublish and npm dry-run evidence is recorded, and no real npm publish, tag, or push has happened.
scope_refs: [epic-64, task-305, task-306, task-307, task-308, task-309, test-119, test-120, test-121]
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate --json, npm run smoke:init, npm run smoke:upgrade, npm run smoke:work-invocation, npm run smoke:cli-ux-polish, npm run prepublishOnly, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [goal, release, polish, cli, prepublish]
owners: []
links: []
artifacts: []
relates: [epic-64]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Objective

Close the remaining 0.3.0 CLI UX polish gaps before publish readiness:
coherent docs examples, clearer help text for optional SPEC and work invocation
commands, a packed temp-repo UX smoke, and fresh dry-run package evidence.

# End Condition

- README and init README examples use one coherent trigger/order/receipt flow.
- `mdkg work --help` lists `work order status` and `work receipt verify`.
- `mdkg work trigger --help`, `work order status --help`,
  `work receipt verify --help`, and `spec validate --help` explain the new UX
  and read-only/no-execution boundaries.
- A packed `smoke:cli-ux-polish` runs against a fresh temp repo using only the
  installed CLI.
- Full prepublish, pack dry-run, and publish dry-run evidence is recorded.
- No real `npm publish`, tag, or push happens in this goal.

# Non-Goals

- No real npm publish.
- No tag or push.
- No public worker execution.
- No public event/reducer/lease/materializer CLI.
- No downstream migration automation implementation.

# Recursive Algorithm

1. `node dist/cli.js goal select goal-10 --json`
2. `node dist/cli.js goal next goal-10 --json`
3. `node dist/cli.js goal claim goal-10 <work-id> --json`
4. Work one scoped node at a time.
5. Run relevant checks, record evidence, and close the node.
6. Continue until `goal next goal-10 --json` returns no actionable node.

# Required Skills

- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate --json`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:work-invocation`
- `npm run smoke:cli-ux-polish`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `task-305` through `task-309` are done.
- `test-119` through `test-121` are done.
- `epic-64` is done.
- `goal next goal-10 --json` returns no actionable node.
- Goal evidence says publish-ready, not published.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

`goal-9` is achieved. This goal is a narrow final polish lane before the real
`0.3.0` publish decision. Preflight found the requested `epic-63` id had been
skipped by a failed forward-ref scaffold attempt, so the polish epic is
`epic-64`; no `epic-63` file exists.

# Iteration Log

- `task-305` audited the live 0.3.0 graph/release state and locked the narrow
  polish boundary.
- `task-306` fixed README/init examples, SPEC/work help, command matrix text,
  and help tests.
- `task-307` added `scripts/smoke-cli-ux-polish.js`, `npm run
  smoke:cli-ux-polish`, prepublish wiring, and publish-readiness assertions.
- `task-308` ran the full final ladder through `npm publish --dry-run`.
- `task-309` recorded closeout evidence and confirmed this goal is
  publish-ready but not published.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `npm run build` passed.
- `npm run test` passed with 426 tests and 0 failures.
- `npm run cli:check` passed.
- `node dist/cli.js validate --json` passed with `ok: true`.
- `npm run smoke:init` passed.
- `npm run smoke:upgrade` passed.
- `npm run smoke:work-invocation` passed.
- `npm run smoke:cli-ux-polish` passed against packaged temp repos including
  `/private/tmp/mdkg-cli-ux-polish.AObkHh`, `/private/tmp/mdkg-cli-ux-polish.FW0AMb`,
  and `/private/tmp/mdkg-cli-ux-polish.j0HyT5`.
- `npm run prepublishOnly` passed, including the new CLI UX polish smoke.
- `node scripts/assert-publish-ready.js` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed for `mdkg@0.3.0`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed
  with `+ mdkg@0.3.0`.
- `git diff --check` passed.
- No real `npm publish`, tag, or push was run.
