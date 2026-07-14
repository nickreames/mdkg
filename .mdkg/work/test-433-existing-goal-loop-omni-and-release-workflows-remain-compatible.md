---
id: test-433
type: test
title: Existing goal loop Omni and release workflows remain compatible
status: done
priority: 1
epic: epic-245
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: [tests/security-remediation.test.mjs]
relates: [goal-69]
blocked_by: [task-764, task-765, task-766, task-767, task-768, task-769, task-770, task-771, task-772, task-773]
blocks: []
refs: [edd-75, dec-80, task-774]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Run broad regression coverage after security changes so fail-closed behavior does
not silently break valid goal, loop, semantic-file, DB, graph, docs, or release
workflows.

# Target / Scope

All implementation tasks `task-763` through `task-773` and supported public CLI
surfaces affected by them.

# Preconditions / Environment

Clean dependency install, built source, packaged tarball candidate, and existing
fixtures including legacy `SPEC.md` compatibility.

# Test Cases

- Full unit tests, CLI contract/check, generated docs, and graph validation.
- Goal/loop create/list/show/plan/next/fork/pack and dry-run purity.
- MANIFEST/legacy SPEC, WORK/WORK_ORDER/RECEIPT/FEEDBACK/DISPUTE/PROPOSAL.
- Archive, bundle, subgraph, visibility, SQLite/project DB, parallel, init/upgrade,
  docs/sites, and installed-package smokes.
- JSON/XML/TOON/MD output envelopes remain stable for valid input.

# Results / Evidence

Pending. Link the uninterrupted `task-775` prepublish checkpoint.

# Notes / Follow-ups

- Intentional new fail-closed errors require contract/docs updates and tests.
