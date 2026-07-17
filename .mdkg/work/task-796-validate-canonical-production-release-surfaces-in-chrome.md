---
id: task-796
type: task
title: Validate canonical production release surfaces in Chrome
status: todo
priority: 1
parent: goal-73
prev: task-795
next: test-457
tags: [goal-73, chrome, production, docs, validation]
owners: []
links: []
artifacts: []
relates: [task-795, test-457, task-797]
blocked_by: [task-795]
blocks: [test-457]
refs: [goal-73, dec-84, edd-78]
context_refs: [edd-46, test-456]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Validate the exact-SHA implementation deployment on canonical production
domains through the user-requested Chrome surface before goal closeout.

# Acceptance Criteria

- Invoke `chrome:control-chrome` and validate
  `https://docs.mdkg.dev/start-here/install/`,
  `https://docs.mdkg.dev/project/changelog/`, and
  `https://docs.mdkg.dev/reference/generated-cli-reference/` at desktop and
  mobile viewports.
- Require generated v0.5.2 current-release facts, version-neutral supplement
  identifiers, working links, no console errors, and no horizontal overflow.
- Require no scoped stale v0.5.0 supplement label while preserving normal
  historical v0.5.0 changelog content.
- Perform a basic unaffected-homepage check on `https://mdkg.dev/`.
- Store bounded live screenshots and DOM receipts alongside local artifacts and
  relate them to the implementation SHA and deployment IDs.
- Keep Chrome checks read-only; do not submit forms or mutate provider state.

# Files Affected

- Local ignored Chrome evidence only; canonical sites are read-only targets.

# Implementation Notes

- Reload canonical pages after Vercel confirms exact-SHA production readiness.
- Scope stale-marker assertions to the supplement container.

# Test Plan

`test-457` combines Vercel identity/readiness, build logs, canonical Chrome
proof, and final closeout deployment requirements.

# Links / Artifacts

- `task-795`
- `test-457`
- `task-797`
