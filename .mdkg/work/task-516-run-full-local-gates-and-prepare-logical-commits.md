---
id: task-516
type: task
title: run full local gates and prepare logical commits
status: backlog
priority: 1
tags: [mdkg-dev, validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-515, test-239, test-240, test-241, test-242, test-243, test-244, test-245]
blocks: [task-517]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Run the full local validation gate and split work into logical commits.

# Acceptance Criteria

- Goal 32 required local checks pass.
- Commit stack is prepared as logical implementation/docs/test/graph commits.
- No launch side effects have occurred before push.

# Files Affected

- Source, docs, tests, and graph files changed by Goal 32.

# Test Plan

- Goal 32 required checks through `git diff --check`.

# Implementation Notes

# Links / Artifacts
