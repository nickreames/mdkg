---
id: test-322
type: test
title: website demo local build Browser Chrome validation contract
status: todo
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, website, browser, chrome, local-build]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-620]
blocks: [task-621]
refs: [edd-58, edd-59]
context_refs: [edd-58, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [generated demo site builds locally., browser desktop and mobile checks pass., chrome desktop and mobile checks pass., no console or responsive layout blockers remain.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that a forked demo run produces a locally buildable website with clean
Browser and Chrome rendering.

# Target / Scope

- `task-620`
- generated demo site under `examples/demo-runs/demo-001/`

# Preconditions / Environment

- Demo run exists and has generated website source.
- Local dev/static server can serve the generated site.

# Test Cases

- Generated demo site builds locally.
- Browser desktop and mobile checks pass.
- Chrome desktop and mobile checks pass.
- No console or responsive layout blockers remain.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Capture screenshots and receipts under `/private/tmp` during execution.
