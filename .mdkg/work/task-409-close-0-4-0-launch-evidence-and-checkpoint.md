---
id: task-409
type: task
title: close 0.4.0 launch evidence and checkpoint
status: todo
priority: 2
epic: epic-103
parent: goal-21
tags: [0.4.0, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-408, test-174, test-175, test-176, test-177]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Close canonical mdkg.dev launch readiness evidence.

# Acceptance Criteria

- All 0.4.0 scoped nodes are complete.
- Launch evidence is recorded.
- Deploy/publish still requires separate explicit request if not already requested.

# Files Affected

- .mdkg/work/goal-21*.md
- .mdkg/work/task-409*.md

# Implementation Notes

- Record final public docs and launch gate receipts.

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

`mdkg task done task-409 --checkpoint "0.4.0 mdkg.dev launch readiness"`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
