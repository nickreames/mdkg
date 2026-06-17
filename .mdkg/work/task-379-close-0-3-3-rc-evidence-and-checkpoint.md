---
id: task-379
type: task
title: close 0.3.3 RC evidence and checkpoint
status: todo
priority: 1
epic: epic-88
parent: goal-16
tags: [0.3.3, closeout, rc]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-378, test-159, test-160, test-161]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Collect release-candidate evidence for 0.3.3 and close `goal-16` without publishing.

# Acceptance Criteria

- All scoped tasks and tests are done.
- Required checks pass through dry-run pack and dry-run publish.
- No real publish, tag, push, deploy, or child repo mutation occurred.

# Files Affected

- .mdkg/work/goal-16*.md
- .mdkg/work/task-379*.md

# Implementation Notes

- Record exact gate outputs in the closeout node.
- Use checkpoint title required by goal-16.

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

`mdkg task done task-379 --checkpoint "0.3.3 goal lifecycle and archived roadmap readiness"`

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
