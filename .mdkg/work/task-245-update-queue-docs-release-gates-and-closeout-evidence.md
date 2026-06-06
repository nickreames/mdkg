---
id: task-245
type: task
title: update queue docs release gates and closeout evidence
status: done
priority: 1
epic: epic-33
parent: goal-3
tags: [project-db, queue, docs, release]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, CHANGELOG.md, assets/init/README.md, assets/init/AGENT_START.md, assets/init/CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js]
relates: [goal-3, epic-33, task-244, task-246]
blocked_by: [task-246]
blocks: []
refs: [rule-5]
aliases: [queue-release-gate-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Update docs, command matrix boundaries, publish-readiness assertions, and
closeout evidence for the internal queue capability.

# Acceptance Criteria

- README, command matrix, changelog, and seeded docs describe the queue as an
  internal local node:sqlite capability with no public CLI yet.
- `scripts/assert-publish-ready.js` requires the compiled queue helper and seeded
  queue boundary docs.
- Full non-publish release gate passes, including pack and publish dry-runs.

# Files Affected

List files/directories expected to change.

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `CHANGELOG.md`
- `assets/init/README.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `assets/init/AGENT_START.md`
- `scripts/assert-publish-ready.js`

# Implementation Notes

- Move source version to `0.1.8 - Unreleased`.
- Do not run a real npm publish, create a tag, or push.

# Test Plan

- `npm run cli:check`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Links / Artifacts

- `goal-3`
- `task-246`
- `rule-5`
