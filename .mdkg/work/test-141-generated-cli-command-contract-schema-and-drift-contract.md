---
id: test-141
type: test
title: generated cli command contract schema and drift contract
status: done
priority: 1
epic: epic-73
parent: goal-13
tags: [cli-spec, command-contract, drift, test]
owners: []
links: []
artifacts: []
relates: [edd-22, task-345, task-346]
blocked_by: [task-345]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate that generated command contract output is complete, deterministic, and
strict enough to replace hand-maintained command docs as the source of truth.

# Target / Scope

- `task-345`
- `edd-22`
- command metadata schema and drift checks

# Preconditions / Environment

- Generated command contract implementation exists.
- Built CLI help can be captured.

# Test Cases

- Every public help target has exactly one command contract record.
- Every public command contract record has help coverage.
- Mutating commands fail schema validation without side-effect, write-path,
  lock-policy, atomic-write, dry-run, receipt, visibility, and danger metadata.
- Contract records are sorted deterministically and produce a stable hash.
- Check mode fails when generated artifacts drift.
- Optional OpenCLI projection, if present, is generated from the mdkg-native
  contract.

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

# Notes / Follow-ups

- `test-131` covers the later docs-readiness and mdkg.dev launch gate.
