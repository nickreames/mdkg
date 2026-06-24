---
id: task-561
type: task
title: create logical commits push main verify Vercel deployments logs and previews
status: todo
priority: 1
epic: epic-188
parent: goal-35
tags: [mdkg-dev, git, vercel, preview]
owners: []
links: []
artifacts: []
relates: [test-280]
blocked_by: [task-560]
blocks: [task-562]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Commit the implementation logically, push `main` to `origin/main`, and prove Vercel previews redeployed correctly.

# Acceptance Criteria

- Local commits are logical and reviewable.
- Push is non-force to `origin/main`.
- Vercel deployments/logs for `mdkg-dev` and `mdkg-docs` are verified.
- Hosted preview routes match local proof.
- No DNS, production promotion, analytics, tag, npm publish, or GitHub settings mutation occurs.

# Test Plan

- `git status --short --branch`
- Vercel deployment/log inspection.
- Hosted Browser/Chrome route checks.

# Files Affected

# Implementation Notes

# Links / Artifacts
