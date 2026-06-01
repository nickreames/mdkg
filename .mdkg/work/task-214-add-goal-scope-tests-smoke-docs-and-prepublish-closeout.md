---
id: task-214
type: task
title: add goal scope tests smoke docs and prepublish closeout
status: done
priority: 1
epic: epic-37
prev: task-213
tags: [goal, tests, smoke, docs, prepublish]
owners: []
links: []
artifacts: [scripts/smoke-goal.js, README.md, CLI_COMMAND_MATRIX.md, CHANGELOG.md]
relates: [epic-37, task-208, task-209, task-210, task-211, task-212, task-213]
blocked_by: [task-209, task-210, task-211, task-212, task-213]
blocks: []
refs: [rule-3, rule-5, rule-6]
aliases: [goal-scope-closeout]
skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-06-01
updated: 2026-06-01
---

# Overview

Close the selected-goal and recursive scope slice only after docs, tests,
smokes, and full non-publish prepublish gates pass.

# Acceptance Criteria

- README, command matrix, startup docs, init assets, and changelog describe the
  selected-goal loop.
- `smoke:goal` proves selected goal, recursive scope traversal, claim, pack,
  evaluate, validate, and normal `mdkg next` behavior in a fresh packed temp
  repo.
- `epic-37` and child tasks are closed with verification evidence.
- Full npm pack and publish dry-runs pass without a real publish.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `CHANGELOG.md`
- `AGENT_START.md`
- `assets/init/`
- `scripts/smoke-goal.js`

# Implementation Notes

- This task owns the final non-publish release gate for the 0.1.5 goal-scope
  slice.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:goal`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Verification Evidence

- Docs, seeded init assets, command matrix, and changelog were updated for the
  selected-goal loop.
- Full non-publish gate passed: build, tests, CLI parity, graph validation,
  all smokes, publish-readiness assertion, npm pack dry-run, npm publish
  dry-run, and `git diff --check`.

# Links / Artifacts

- `epic-37`
- `task-208`
- `task-213`
