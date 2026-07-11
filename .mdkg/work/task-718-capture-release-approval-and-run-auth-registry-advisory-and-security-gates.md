---
id: task-718
type: task
title: Capture release approval and run auth registry advisory and security gates
status: todo
priority: 1
epic: epic-233
prev: task-717
next: task-719
tags: [release, approval, security, registry]
owners: []
links: []
artifacts: []
relates: [goal-64, test-389]
blocked_by: [task-717]
blocks: [task-719]
refs: [test-389]
context_refs: [goal-64, epic-233, edd-72, dec-69, task-717]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Present the complete local readiness receipt, obtain one explicit bounded
approval, then run all external read-only release gates before any push or publish.

# Acceptance Criteria

- Approval explicitly covers registry/auth/advisory/security access, first push,
  npm publish, `/opt/homebrew` replacement, activation push, and production deploy.
- Approval explicitly records that no Git tag will be created.
- Npm auth is valid, latest is below 0.5.0, and `mdkg@0.5.0` is absent.
- Dependency advisories and repository security scan have no unresolved
  release-blocking findings.

# Files Affected

List files/directories expected to change.

- Mdkg approval/checkpoint/evidence nodes
- Temporary npm/security receipts outside committed secrets

# Implementation Notes

- If target version exists, auth fails, or a blocker is found, stop before push.
- Never print or commit tokens or raw private provider payloads.

# Test Plan

Run `test-389` and attach sanitized auth, registry, advisory, security, and
approval receipts before unblocking `task-719`.

# Links / Artifacts

- `dec-69`
- `edd-72`
