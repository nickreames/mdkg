---
id: task-807
type: task
title: Inventory v0.3.9 tag identity and no-override rewrite options
status: todo
priority: 1
parent: goal-76
tags: [git-gud, tag, audit]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-808]
refs: [goal-76]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-07-21
updated: 2026-07-21
---
# Overview

Prove the tag object, peeled commit, local/live reachability, release provenance
role, and exact git-gud warning; compare range exclusion and explicit
preservation strategies without mutating refs.

# Acceptance Criteria

- Bounded local and live receipts identify `v0.3.9` and `072cf519` exactly.
- Options state effects on tags, GitHub releases, npm provenance, root
  gitlinks, downstream clones, and required future authority.
- No tag, branch, plan, backup ref, or remote state is changed.

# Files Affected

List files/directories expected to change.

- `.mdkg/work/task-807-*`
- future bounded checkpoint only

# Implementation Notes

- Treat published tags as separate authority from branch history.
- Reject any option that silently depends on `--allow-tag-drift`.

# Test Plan

Use read-only local/remote tag commands and the existing audit receipt; review
all options against release and root-integration consumers.

# Links / Artifacts

- `goal-76`
- tag `v0.3.9`
- commit `072cf5193adf897fff5b5041bef90d0a8c2b0a68`
