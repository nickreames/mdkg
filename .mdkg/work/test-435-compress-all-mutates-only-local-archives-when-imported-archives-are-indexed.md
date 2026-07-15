---
id: test-435
type: test
title: Compress all mutates only local archives when imported archives are indexed
status: done
priority: 0
epic: epic-249
tags: [archive, subgraph, ownership]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-777, task-778]
blocks: []
refs: [goal-70, bug-1, task-777, task-778]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove merged-index imports do not become `--all` mutation targets.

# Target / Scope

Disposable root with one writable local archive and one archive-bearing imported
bundle; run both current failure capture and corrected command.

# Preconditions / Environment

Temporary repositories only; hash local outputs and imported bundle before run.

# Test Cases

- `archive compress --all --json` succeeds.
- Exactly the local archive is compressed and the imported qid is excluded.
- Repeated runs preserve deterministic ordering and selection evidence.

# Results / Evidence

Passed in `archive_compress_ownership.test.ts`: the receipt selected only
`root:archive.shared`, reported the imported projection as excluded, changed
only the local sidecar evidence, and preserved imported state.

# Notes / Follow-ups

- Failure keeps Goal 70 open.
