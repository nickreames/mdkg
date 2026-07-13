---
id: test-389
type: test
title: Single approval external gates and no tag policy are enforced
status: done
priority: 1
epic: epic-233
tags: [release, approval, security, no-tag]
owners: []
links: []
artifacts: []
relates: [goal-64, task-718]
blocked_by: []
blocks: []
refs: [task-718, goal-69, task-776, test-434, chk-497, dec-81, chk-511]
context_refs: [goal-64, goal-69, epic-233, edd-72, dec-69, edd-75, dec-80, dec-81]
evidence_refs: [chk-496, chk-497, chk-511]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-12
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

The operator approved the exact bounded Goal 64 release sequence. `chk-496`
records the approval text, scope, no-tag policy, and stop/fix-forward rules.

Npm registry/auth/advisory evidence was clean when using the contract-required
temporary userconfig: authenticated owner `nickreames`, current/latest `0.4.2`,
target `0.5.0` absent, and zero dependency advisories. The repository security
gate executed and correctly failed closed with 51 findings. `chk-497` transfers
the evidence to `goal-69`. Goal 69 subsequently fixed all 51 rows, the exact
matrix and full release ladder passed, and `chk-511` records the manual
source-backed requalification accepted in `dec-81`. The original security
blocker is closed without waiving any finding.

The single bounded approval in `chk-496` remains the authority for the release
sequence. It does not authorize a Git tag, and no tag was created during
remediation or requalification.

# Notes / Follow-ups

- Narrow approval must be re-requested, not inferred.
- Completion of `task-718` means the gate ran, not that the security result passed.
