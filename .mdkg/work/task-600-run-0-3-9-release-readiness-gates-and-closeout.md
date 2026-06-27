---
id: task-600
type: task
title: run 0.3.9 release readiness gates and closeout
status: todo
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, release-readiness, prepublish, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-595, task-596, task-597, task-598, task-599, test-302, test-303, test-304, test-305]
blocks: []
refs: [task-595, task-596, task-597, task-598, task-599]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Run the full `0.3.9` release-readiness ladder after implementation tasks and
contracts pass.

# Acceptance Criteria

- Build, tests, CLI checks, docs checks, publish-readiness assertions, pack
  dry-run, and publish dry-run pass.
- Temp-repo proof covers config overlays, custom mirror targets,
  `COLLABORATION.md`/`HUMAN.md`, and MANIFEST/SPEC compatibility.
- A checkpoint records command evidence, known warnings, package payload
  summary, and no-publish/no-tag/no-push boundaries.
- `goal-41` can be marked achieved only after the dry-run ladder is clean.

# Files Affected

- mdkg graph/checkpoint evidence
- generated index state

# Implementation Notes

- This task may run publish dry-run only; real publish is a later approval
  boundary.
- Use isolated npm cache under `/private/tmp/mdkg-npm-cache`.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`
- `node dist/cli.js validate --json`
- `git diff --check`

# Links / Artifacts

- `goal-41`
- `test-306`
