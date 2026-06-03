---
id: task-231
type: task
title: db foundation tests smoke closeout and profile followups
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, tests, smoke, closeout, profiles]
owners: []
links: []
artifacts: [scripts/smoke-db.js, package.json, scripts/assert-publish-ready.js, CHANGELOG.md, .mdkg/work/task-232-define-project-db-profile-contract-from-foundation-evidence.md, .mdkg/work/task-233-design-first-project-db-profile-fixture-and-smoke.md, .mdkg/work/task-234-design-profile-privacy-export-and-redaction-gates.md]
relates: [goal-1, epic-30, edd-12, epic-34, task-223, task-224, task-225, task-226, task-227, task-228, task-229, task-230]
blocked_by: []
blocks: [task-193]
refs: [edd-12]
aliases: [db-foundation-closeout, project-db-profile-followups]
skills: [verify-close-and-checkpoint]
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Close the DB foundation goal with full test coverage, packed temp-repo smoke,
prepublish dry-run evidence, and future profile nodes based on what the
implementation proved.

# Acceptance Criteria

- Unit and CLI coverage for all implemented DB commands passes.
- Packed temp repo proves `mdkg init --agent`, `mdkg db init`, `migrate`,
  `verify`, `stats`, `db index rebuild`, `db index status`, `db index verify`,
  `mdkg index`, `validate`, and relevant search/show behavior.
- Full prepublish dry-run gate passes without real npm publish.
- `goal-1` and `epic-30` record completion evidence and are closed only after
  checks pass.
- Future project DB profile artifacts or tasks are created under `epic-34` or a
  new related planning node after implementation evidence is available.

# Explicit Exclusions

- No real npm publish.
- No consumer repo edits.
- No profile implementation in this closeout task.

# Files Affected

- Test suite and smoke scripts.
- mdkg graph closeout nodes.
- Future profile planning artifacts.

# Implementation Notes

Create future profile nodes only after the DB foundation behavior has test
evidence. Do not implement profile behavior in this task.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- DB-specific packed temp smoke.
- `node scripts/assert-publish-ready.js`
- isolated-cache `npm pack --dry-run --json`
- isolated-cache `npm publish --dry-run`
- `git diff --check`

# Closeout Evidence

- Added `scripts/smoke-db.js` and wired `npm run smoke:db` into `package.json`
  and the `prepublishOnly` gate.
- Strengthened `scripts/assert-publish-ready.js` to require compiled project DB
  migration output and seeded init docs for `mdkg db init`, `migrate`,
  `verify`, and `stats`.
- Created future profile follow-up tasks under `epic-34`:
  - `task-232`: define project DB profile contract from foundation evidence.
  - `task-233`: design first project DB profile fixture and smoke.
  - `task-234`: design profile privacy export and redaction gates.
- Verification passed:
  - `npm run smoke:db` (`db smoke passed`).
  - `npm run test` (403 tests passed).
  - `npm run cli:check`.
  - `node dist/cli.js validate`.
  - `node dist/cli.js db index verify --json`.
  - `node scripts/assert-publish-ready.js`.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
    produced `mdkg-0.1.7.tgz`.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
    completed with `+ mdkg@0.1.7`.
  - `git diff --check`.
- No real npm publish and no consumer repo edits occurred.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
- `epic-34`
