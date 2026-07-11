---
id: epic-233
type: epic
title: Run approval gated security registry and publish sequence
status: todo
priority: 1
tags: [release, approval, security, npm]
owners: []
links: []
artifacts: []
relates: [goal-64]
blocked_by: []
blocks: []
refs: [task-718, task-719, test-389, test-390]
context_refs: [goal-64, edd-72, dec-69]
evidence_refs: []
aliases: [v0-5-0-approval-and-publish]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Obtain one bounded authorization, clear all external preflight gates, put the
release commit on origin with green CI, and publish exactly `mdkg@0.5.0`.

# Scope

- One explicit approval receipt enumerating every side effect.
- Auth, target-version absence, advisory, and repository security checks.
- First push with announcement dormant and required CI success.
- Npm publish with verified credentials and immediate registry receipt.

# Milestones

- `task-718` / `test-389`: approval and external gates.
- `task-719` / `test-390`: first push, CI, and npm publish.

# Out of Scope

Git tag creation, website activation, and unpublishing/rewriting npm history.

# Risks

- Approval scope can be ambiguous.
- Registry or CI state can change between preflight and publish.

# Links / Artifacts

- `edd-72`
- `dec-69`
- external links
