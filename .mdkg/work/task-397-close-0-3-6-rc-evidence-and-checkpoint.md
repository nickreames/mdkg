---
id: task-397
type: task
title: close 0.3.6 RC evidence and checkpoint
status: todo
priority: 2
epic: epic-97
parent: goal-19
tags: [0.3.6, closeout]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-395, task-396, test-168, test-169, test-170]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Close 0.3.6 local MCP release-candidate evidence.

# Acceptance Criteria

- All 0.3.6 scoped nodes are complete.
- Dry-run gates pass.

# Files Affected

- .mdkg/work/goal-19*.md
- .mdkg/work/task-397*.md

# Implementation Notes

- Record MCP smoke and no-mutation proof.

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

`mdkg task done task-397 --checkpoint "0.3.6 local MCP readiness"`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
