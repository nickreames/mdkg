---
id: test-305
type: test
title: skills docs automation and changelog drift contract
status: todo
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, skills, docs, changelog, automation, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-598, task-599]
blocks: []
refs: [task-598, task-599]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate that first-party skills, docs automation, and release-note checks catch
CLI drift.

# Target / Scope

`task-598`, `task-599`, first-party skills, command docs, and changelog/release
notes automation.

# Preconditions / Environment

Run from the repo after behavior/docs changes are implemented.

# Test Cases

- Docs command checker accepts current valid examples and rejects stale ones.
- Publish-readiness checks catch stale source-visible version/release-note
  drift.
- Skill coverage audit maps current command families to first-party skills.
- Changelog/release notes inputs stay reconciled.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Prefer actionable diagnostics over broad snapshots.
