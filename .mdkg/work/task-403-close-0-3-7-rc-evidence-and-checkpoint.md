---
id: task-403
type: task
title: close 0.3.7 RC evidence and checkpoint
status: todo
priority: 2
epic: epic-100
parent: goal-20
tags: [0.3.7, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-402, test-171, test-172, test-173]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Close 0.3.7 live demo readiness evidence.

# Acceptance Criteria

- All 0.3.7 scoped nodes are complete.
- Demo orchestration is validated without deploying.

# Files Affected

- .mdkg/work/goal-20*.md
- .mdkg/work/task-403*.md

# Implementation Notes

- Record demo graph and handoff evidence.

# Test Plan

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Checkpoint Requirement

`mdkg task done task-403 --checkpoint "0.3.7 live demo orchestration readiness"`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
