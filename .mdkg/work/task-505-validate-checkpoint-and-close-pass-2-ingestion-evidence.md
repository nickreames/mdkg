---
id: task-505
type: task
title: validate checkpoint and close pass 2 ingestion evidence
status: done
priority: 1
tags: [mdkg-dev, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-504, test-235, test-236, test-237, test-238]
blocks: [task-506]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Run the required graph-only checks and record closeout evidence.

# Acceptance Criteria

- Archive verification passes.
- Index and validation pass.
- Goal 32 show/next/pack checks pass.
- A checkpoint summarizes source evidence, design distillation, Goal 32 scope, and no-functional-mutation boundary.

# Files Affected

- `.mdkg/work/`
- `.mdkg/design/`
- `.mdkg/archive/`

# Test Plan

- Goal 31 required checks.

# Implementation Notes

# Links / Artifacts
