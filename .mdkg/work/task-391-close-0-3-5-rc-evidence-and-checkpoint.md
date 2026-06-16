---
id: task-391
type: task
title: close 0.3.5 RC evidence and checkpoint
status: todo
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-390, test-165, test-166, test-167]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Close 0.3.5 graph clone/import release-candidate evidence.

# Acceptance Criteria

- All 0.3.5 scoped nodes are complete.
- Dry-run release gates pass.

# Files Affected

- .mdkg/work/goal-18*.md
- .mdkg/work/task-391*.md

# Implementation Notes

- Record clone/import receipts and smokes.

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

`mdkg task done task-391 --checkpoint "0.3.5 graph clone template import readiness"`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
