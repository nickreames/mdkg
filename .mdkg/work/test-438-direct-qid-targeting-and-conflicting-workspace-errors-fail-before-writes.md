---
id: test-438
type: test
title: Direct qid targeting and conflicting workspace errors fail before writes
status: done
priority: 0
epic: epic-249
tags: [archive, qid, errors, no-write]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-777]
blocks: []
refs: [goal-70, task-777]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove direct target resolution is explicit, compatible, and fail-closed.

# Target / Scope

Plain archive ID/URI, local qid, imported qid, and qid plus `--ws` combinations.

# Preconditions / Environment

Disposable duplicate IDs and before hashes for every archive output.

# Test Cases

- Plain legacy forms preserve root/`--ws` behavior.
- Local qid compresses the exact archive.
- Imported qid and imported URI plus `--ws` fail before path derivation/writes.
- Qid plus mismatched `--ws` is a deterministic usage error.

# Results / Evidence

Passed: exact local qids compressed the intended duplicate-id archive, imported
qids failed with source-workspace guidance, and a qid conflicting with `--ws`
failed as a usage error before writes.

# Notes / Follow-ups

- Error wording must match `dec-82`.
