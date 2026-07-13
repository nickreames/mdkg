---
id: task-722
type: task
title: Activate and push the website release then verify production deployments
status: progress
priority: 1
epic: epic-235
prev: task-721
next: task-723
tags: [release, activation, deploy, vercel]
owners: []
links: []
artifacts: []
relates: [goal-64, test-393]
blocked_by: [task-721]
blocks: [task-723]
refs: [test-393]
context_refs: [goal-62, goal-63, goal-64, epic-235, edd-72, dec-69, task-721]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-13
---
# Overview

After npm and real global proof, make the single release activation change,
push the website commit, and verify both production deployments are current.

# Acceptance Criteria

- Before-state proves production promotion is dormant while npm 0.5.0 is live.
- Activation diff contains only the accepted release-state/content changes.
- Second push succeeds and both Vercel projects deploy the expected commit.
- Custom domains serve the activated release and correct displayed version.

# Files Affected

List files/directories expected to change.

- Source-controlled release activation data
- Origin and mdkg.dev/docs.mdkg.dev production deployments

# Implementation Notes

- No npm republish or Git tag accompanies site activation.
- Failed deployment is fixed forward from the published package state.

# Test Plan

Run `test-393` with before/after activation, commit, deployment-currentness, and
domain receipts.

# Links / Artifacts

- `dec-69`
- `goal-42`
