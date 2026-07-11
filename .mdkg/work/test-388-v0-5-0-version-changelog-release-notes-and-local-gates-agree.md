---
id: test-388
type: test
title: v0.5.0 version changelog release notes and local gates agree
status: todo
priority: 1
epic: epic-232
tags: [release, version, changelog, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-64, task-716, task-717]
blocked_by: [task-717]
blocks: []
refs: [task-716, task-717]
context_refs: [goal-64, epic-232, edd-72, dec-69]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Prove the v0.5.0 candidate is internally consistent and locally releasable before
external approval or mutation.

# Target / Scope

Version/lock/changelog/generated docs/sites, full gates, tarball, upgrade, previews.

# Preconditions / Environment

Clean release commit candidate, temporary npm cache, local site servers/browser.

# Test Cases

- Scan all visible version and release-note surfaces for 0.5.0 parity.
- Map every publish-bound change to release notes or explicit classification.
- Run full package/graph/docs/site/smoke/pack/publish dry-run ladder.
- Prove public activation remains dormant in committed source.

# Results / Evidence

Pending Goals 1/3 and `task-717`.

# Notes / Follow-ups

- Any local failure blocks the approval request.
