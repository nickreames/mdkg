---
id: task-404
type: task
title: consolidate mdkg dev launch tasks into 0.4.0 lane
status: todo
priority: 2
epic: epic-101
parent: goal-21
tags: [0.4.0, mdkg-dev, consolidation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-10]
blocks: [task-405]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Consolidate legacy mdkg.dev launch nodes into the canonical 0.4.0 launch goal.

# Acceptance Criteria

- Legacy `goal-15` context is preserved.
- Launch work is grouped by docs/SEO, generated docs/examples, and trust/security/downstream gates.

# Files Affected

- .mdkg/work/**

# Implementation Notes

- Do not delete historical launch nodes.

# Test Plan

- Validate graph links.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
