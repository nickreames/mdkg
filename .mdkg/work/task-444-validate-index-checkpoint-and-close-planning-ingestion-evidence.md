---
id: task-444
type: task
title: validate index checkpoint and close planning ingestion evidence
status: done
priority: 1
epic: epic-121
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-443, test-196, test-197, test-198, test-199]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-21
---
# Overview

Run the Goal 1 closeout checks, record a checkpoint, and leave the repo ready for an explicit future Goal 2 activation.

# Acceptance Criteria

- Index and validation gates pass.
- Goal 2 can be shown and packed.
- Graph-only mutation boundary is proven.
- Goal 1 closes with checkpoint evidence.

# Files Affected

- .mdkg/work/chk-*.md
- .mdkg/index/mdkg.sqlite

# Implementation Notes

- Run checks listed on Goal 1.
- Use one milestone checkpoint for the ingestion pass.
- Clear selected achieved goal after closeout if needed to avoid stale doctor warnings.

# Test Plan

- node dist/cli.js validate --json passes.
- git diff --check passes.
- git status --short --branch shows only mdkg graph/archive/design changes.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-121
- context: goal-24
- context: goal-25
