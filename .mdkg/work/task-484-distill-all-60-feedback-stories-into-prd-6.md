---
id: task-484
type: task
title: distill all 60 feedback stories into prd-6
status: done
priority: 1
tags: [mdkg-dev, prd, feedback, taxonomy]
owners: []
links: []
artifacts: [mdkg_dev_feedback]
relates: [test-225]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Distill all 60 feedback stories into `prd-6` so Goal 30 has a clear P0/core-P1/deferred implementation boundary.

# Acceptance Criteria

- `prd-6` describes P0 launch blockers.
- `prd-6` identifies core P1 stories in Goal 30 scope.
- `prd-6` records P2/deferred stories and implementation risks.

# Files Affected

- `.mdkg/design/prd-6-*.md`

# Test Plan

- `node dist/cli.js show prd-6 --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
