---
id: task-412
type: task
title: update graph import docs smoke and publish readiness assertions
status: done
priority: 1
epic: epic-104
parent: goal-19
tags: [0.3.6, graph-import, docs, smoke]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-411]
blocks: [test-179]
refs: []
aliases: []
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Update user-facing docs, packed smoke coverage, and publish-readiness assertions for graph import activation behavior.

# Acceptance Criteria

- README and init README describe activation and competing-goal pause semantics.
- CLI command matrix documents receipt fields and conflict behavior.
- `smoke:graph-clone` exercises an active local goal plus active imported start goal.
- Publish-readiness assertions require the new docs and smoke coverage.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `scripts/smoke-graph-clone.js`
- `scripts/assert-publish-ready.js`

# Implementation Notes

- Add a `0.3.6 - Unreleased` changelog note instead of changing the already-published `0.3.5` section.

# Test Plan

- `npm run smoke:graph-clone`
- `node scripts/assert-publish-ready.js`

# Links / Artifacts

- test-179
