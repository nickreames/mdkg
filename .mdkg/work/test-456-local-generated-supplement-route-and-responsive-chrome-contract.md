---
id: test-456
type: test
title: Local generated supplement route and responsive Chrome contract
status: todo
priority: 1
parent: goal-73
prev: task-794
next: task-795
tags: [goal-73, test, docs, chrome, responsive]
owners: []
links: []
artifacts: []
relates: [task-794, task-793, edd-78]
blocked_by: [task-794]
blocks: [task-795]
refs: [goal-73, dec-84, edd-78]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [install-route, changelog-route, generated-reference-route, desktop, mobile, no-stale-v050-markers, no-console-errors, no-overflow]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Prove the locally built docs render the generated supplement correctly and are
ready for the pre-approved production-triggering push.

# Target / Scope

Install, Changelog, and Generated CLI Reference in built output plus Chrome at
desktop and mobile viewports.

# Preconditions / Environment

All automated gates from `task-794` pass and a local static server exposes the
fresh `docs/dist` output.

# Test Cases

- Every route contains one visible version-neutral current-release supplement.
- Published label, date/count where applicable, commands, links, and generated
  highlights match the `0.5.2` manifest-selected release.
- Supplement markup contains no `release-v050-*`, stale current v0.5.0 label,
  raw HTML injection, or draft-only copy.
- Historical v0.5.0 changelog details remain visible in their normal section.
- Desktop/mobile checks show no clipping or document-level horizontal overflow.
- Navigation works and no page console errors occur.

# Results / Evidence

Pending. Attach command receipts, DOM result JSON, and screenshot paths.

# Notes / Follow-ups

- Any local failure blocks `task-795`; do not push around it.
