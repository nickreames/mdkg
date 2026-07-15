---
id: test-444
type: test
title: v0.5.1 release candidate version package and CI gates pass
status: todo
priority: 0
epic: epic-250
tags: [release, v0.5.1, ci]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-783]
blocks: [task-784]
refs: [goal-71, task-783]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove the exact approved release commit is internally consistent and green in CI.

# Target / Scope

Version/lock/changelog, package contents, local gates, approval, origin SHA, CI,
and no-tag state.

# Preconditions / Environment

Goal 70 achieved with clean checkpoint and local commit.

# Test Cases

- All version facts equal 0.5.1.
- Full release gates and package inspection pass.
- Approval predates push; exact pushed SHA has green CI; no tag exists.

# Results / Evidence

Pending release-candidate checkpoint.

# Notes / Follow-ups

- Failure returns to local repair before npm publication.
