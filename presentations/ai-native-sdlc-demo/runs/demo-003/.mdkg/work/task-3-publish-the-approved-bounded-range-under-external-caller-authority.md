---
id: task-3
type: task
title: Publish the approved bounded range under external caller authority
status: backlog
priority: 1
epic: epic-1
parent: goal-1
prev: test-2
next: test-3
tags: [demo, publication, authority-gated, non-force]
owners: []
links: []
artifacts: [artifacts/publication-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-2]
context_refs: [prd-2, edd-1, dec-2, test-2, chk-3]
evidence_refs: [test-2]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-28
updated: 2026-07-28
---
# Overview

Publish only the caller-approved bounded Git range after validating a separate
matching external human authority receipt.

# Acceptance Criteria

- Require a caller-owned authority receipt that binds the semantic source,
  run binding, child seal, shared-source lease, branch, fetched origin SHA,
  exact prospective range policy, path-and-operation allowlist, owner, validity
  window, normal non-force push, repair limits, hard blockers, and fallback.
- Re-fetch immediately before range validation and require intended branch,
  clean owned paths, zero-behind state, and no unrelated integration.
- Create only bounded in-scope local commits permitted by the receipt.
- Prove the complete parent/range/path hash before push.
- Perform only a normal non-force push to the named remote/branch.
- Fail closed on origin advance, lease/allowlist drift, credentials failure,
  force/history requirement, unrelated changes, or expired authority.
- Write `artifacts/publication-receipt.json` with pre/post remote SHA, commit
  range, range hash, changed paths, command classification, and next QID.

# Files Affected

- Only exact rows in the external authority receipt.
- `artifacts/publication-receipt.json`.

# Implementation Notes

- The run binding and graph do not grant publication authority.
- No force push, history rewrite, tag, package publication, provider mutation,
  DNS, analytics, or unrelated integration.
- Deadline and repair bounds in the caller's timed-run contract override
  remaining retries.

# Test Plan

- range/path/hash verification before the push
- remote SHA and zero-ahead/zero-behind verification after the push
- `test-3`

# Links / Artifacts

- external event-authority receipt by hash
- `RUN_BINDING.json`
- `IMMUTABLE_CHILD_CONTRACT.json`
- `test-2`
- `test-3`
