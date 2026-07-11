---
id: test-389
type: test
title: Single approval external gates and no tag policy are enforced
status: todo
priority: 1
epic: epic-233
tags: [release, approval, security, no-tag]
owners: []
links: []
artifacts: []
relates: [goal-64, task-718]
blocked_by: [task-718]
blocks: []
refs: [task-718]
context_refs: [goal-64, epic-233, edd-72, dec-69]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Ensure every external check/mutation is covered by one explicit bounded approval
and that the no-tag decision remains visible.

# Target / Scope

Approval, npm auth/version absence, advisories, repository security, no-tag policy.

# Preconditions / Environment

Completed local preflight checkpoint and explicit operator response.

# Test Cases

- Verify approval enumerates both pushes, publish, global install, and deployment.
- Confirm npm 0.5.0 absence/auth and security/advisory gates.
- Confirm no tag command is authorized or executed.
- Stop on any failed or ambiguous receipt.

# Results / Evidence

Pending explicit release approval.

# Notes / Follow-ups

- Narrow approval must be re-requested, not inferred.
