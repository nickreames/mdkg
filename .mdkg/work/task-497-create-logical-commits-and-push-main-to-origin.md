---
id: task-497
type: task
title: create logical commits and push main to origin
status: todo
priority: 1
tags: [mdkg-dev, git, push]
owners: []
links: []
artifacts: []
relates: [test-234]
blocked_by: [task-496]
blocks: [task-498]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Commit implementation work logically and push only `main` to `origin/main` after all local gates pass.

# Acceptance Criteria

- Commits are logically grouped: product pages, docs, tests/smokes, graph closeout.
- `git diff --check` passes before commit.
- Push is non-force and targets `origin/main`.
- No npm publish, tag, DNS, analytics, GitHub settings mutation, or production promotion occurs.

# Test Plan

- `git status --short --branch`
- `git log --oneline -5`
- `git push origin main`

# Files Affected

# Implementation Notes

# Links / Artifacts
