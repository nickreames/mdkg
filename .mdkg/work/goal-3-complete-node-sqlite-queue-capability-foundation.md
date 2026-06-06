---
id: goal-3
type: goal
title: Complete node sqlite queue capability foundation
status: done
priority: 1
goal_state: achieved
goal_condition: Complete epic-33's local node:sqlite queue foundation so mdkg has internal queue migrations, helpers, tests, packed smoke coverage, docs, and non-publish prepublish readiness without exposing a public queue CLI.
scope_refs: [epic-33]
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, node dist/cli.js validate, npm run smoke:db, npm run smoke:db-queue, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [project-db, queue, sqlite, goal, pre-v1]
owners: []
links: []
artifacts: [/private/tmp/mdkg-global-e2e.MY3dD1, /private/tmp/mdkg-global-0.1.8-smoke.ILUSqM]
relates: [epic-33, task-244, task-245, task-246, task-247]
blocked_by: []
blocks: [task-244, task-245, task-246, task-247]
refs: [edd-12]
aliases: []
skills: [pursue-mdkg-goal]
created: 2026-06-04
updated: 2026-06-04
---
# Objective

Implement the internal local node:sqlite queue foundation for mdkg project DB
state while preserving the boundary that queues are delivery infrastructure, not
canonical event history.

# End Condition

`epic-33` has a tested internal queue foundation: mdkg-owned queue migration,
runtime helpers, deterministic unit coverage, packed temp-repo smoke coverage,
docs/release-gate updates, and non-publish package dry-runs. No public queue CLI
or real npm publish is included.

# Non-Goals

- Public `mdkg db queue ...` commands.
- Hosted or external queue adapters.
- Worker/materializer implementation before event, receipt, reducer, and
  lease/CAS contracts are stable.
- Real npm publish, tag, or push.

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
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- Queue migration is idempotent and follows the foundation migration.
- Queue helpers cover enqueue, claim, ack, fail/retry, dead-letter, lease expiry,
  and stats with deterministic `now_ms` injection.
- Queue rows are internal project DB delivery state, not canonical event history.
- Packed smoke proves the installed package can exercise queue helpers in a temp
  mdkg repo.
- Prepublish gates include queue smoke and publish readiness checks without a
  real publish.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Global `mdkg@0.1.7` e2e passed from `/opt/homebrew/bin/mdkg` in
`/private/tmp/mdkg-global-e2e.MY3dD1`. Source then shipped internal queue
implementation and release gates for `0.1.8`. After separate publish approval,
`mdkg@0.1.8` was published, installed globally at `/opt/homebrew/bin/mdkg`, and
smoked in `/private/tmp/mdkg-global-0.1.8-smoke.ILUSqM`. No tag or push was
performed.

# Iteration Log

- 2026-06-04: Created goal after global install/e2e validation of published
  `mdkg@0.1.7`.
- 2026-06-04: Implemented queue migration/helpers, deterministic tests, packed
  queue smoke, docs, and release gates.
- 2026-06-04: Closed child tasks `task-247`, `task-244`, `task-246`, and
  `task-245`; marked goal achieved after full non-publish verification.
- 2026-06-04: After separate publish approval, published `mdkg@0.1.8`,
  installed `mdkg@latest` globally, and passed temp global smoke with queue
  helper proof.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Global install proof:
  - `npm view mdkg@latest version --prefer-online` returned `0.1.7`.
  - Initial global `/opt/homebrew/bin/mdkg --version` returned `0.1.6`.
  - `npm install -g mdkg@0.1.7 --registry=https://registry.npmjs.org/ --foreground-scripts` succeeded with `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.
  - Final `command -v mdkg` returned `/opt/homebrew/bin/mdkg`.
  - Final `mdkg --version` returned `0.1.7`.
  - Final `npm list -g mdkg --depth=0` showed `mdkg@0.1.7`.
- Global temp E2E proof:
  - Temp root: `/private/tmp/mdkg-global-e2e.MY3dD1`.
  - Fresh repo ran `mdkg init --agent`, project DB init/migrate/verify/stats,
    snapshot seal/verify, task create, `mdkg index`, `mdkg validate`, search,
    show, ignore-policy checks, startup-doc checks, and skill mirror checks.
- Source implementation proof:
  - `npm run build` passed.
  - `node --test dist/tests/commands/db_index.test.js` passed 13 tests.
  - `npm run test` passed 406 tests.
  - `npm run cli:check` passed.
  - `node dist/cli.js validate` passed after `node dist/cli.js index`.
  - `npm run smoke:db` passed.
  - `npm run smoke:db-queue` passed and printed `db queue smoke passed:
    mdkg-0.1.8.tgz`.
  - `node scripts/assert-publish-ready.js` passed.
  - `env NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run
    --json` passed and included `dist/core/project_db_queue.js`.
  - `env NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
    passed and printed `+ mdkg@0.1.8`.
  - `git diff --check` passed.
- Publish follow-up proof:
  - `env NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache
    NPM_CONFIG_USERCONFIG=/private/tmp/mdkg-npm-publish.npmrc npm publish
    --registry=https://registry.npmjs.org/ --access public` passed and printed
    `+ mdkg@0.1.8`.
  - `npm view mdkg version --prefer-online` returned `0.1.8`.
  - `npm view mdkg dist-tags --json` showed `latest` as `0.1.8`.
  - `env NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm install -g
    mdkg@latest --registry=https://registry.npmjs.org/ --foreground-scripts`
    installed `mdkg@0.1.8`.
  - `command -v mdkg` returned `/opt/homebrew/bin/mdkg`.
  - `mdkg --version` returned `0.1.8`.
  - `npm list -g mdkg --depth=0` showed `mdkg@0.1.8`.
  - Temp global smoke root `/private/tmp/mdkg-global-0.1.8-smoke.ILUSqM`
    passed project DB init/migrate/verify/stats, snapshot seal/verify, task
    create/index/validate/search/show, ignore-policy checks, no public queue CLI
    check, and packaged queue helper lifecycle proof.
  - Queue smoke stats ended with `acked: 1`, `dead_letter: 1`, and
    `project_queue_message` row count `2`.
  - No tag or push was performed.
