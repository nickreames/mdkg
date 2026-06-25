---
id: task-572
type: task
title: close evidence with no DNS production side effects beyond approved domain cutover
status: done
priority: 1
epic: epic-193
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-571]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Close goal-36 with evidence, confirming the only production side effects were approved custom-domain cutover work.

# Acceptance Criteria

- All scoped tasks/tests are done or explicitly documented as blocked with exact evidence.
- Required checks have current receipts.
- Checkpoints link DNS, Vercel, Browser/Chrome, screenshot, route, and checklist evidence.
- Final closeout confirms no npm publish, tag, analytics activation, GitHub settings mutation, or public announcement.
- `goal next goal-36 --json` returns no actionable node without warnings before marking the goal achieved.

# Files Affected

- `.mdkg/work/**`
- `.mdkg/archive/**`
- `.mdkg/index/mdkg.sqlite`

# Implementation Notes

- Use `verify-close-and-checkpoint`.
- Do not close if DNS/SSL is still inconsistent.

# Test Plan

- Full required checks.
- `node dist/cli.js goal next goal-36 --json`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`

# Links / Artifacts

- Goal-36 closeout checkpoint.
