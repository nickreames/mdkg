---
id: task-609
type: task
title: tag mdkg 0.3.9 published commit and close publish evidence
status: done
priority: 1
parent: goal-43
tags: [release, 0.3.9, tag, checkpoint]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-313]
blocks: []
refs: [goal-43, test-313]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Create durable mdkg closeout evidence, mark the publish lane complete, create
annotated tag `v0.3.9` on the published commit, and push that tag to origin.

# Acceptance Criteria

- A checkpoint records publish commit SHA, registry version, dist-tags, temp
  install path, key command results, accepted warnings, and no-`0.4.0` boundary.
- `goal-43` is marked achieved after publish validation evidence exists.
- Annotated tag `v0.3.9` points to the published commit, not to any later
  evidence-only commit unless those are the same commit.
- `git push origin v0.3.9` succeeds after validation passes.
- Final status is clean or contains only explicitly explained mdkg evidence.

# Files Affected

- mdkg checkpoint/work/goal files
- local and remote git tag `v0.3.9`

# Implementation Notes

- If post-publish evidence creates a commit after the published commit, tag the
  saved published SHA explicitly.
- Do not tag or publish `0.4.0`.

# Test Plan

- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --json`
- `git diff --check`
- `git tag --points-at <published-sha>`
- `git ls-remote --tags origin refs/tags/v0.3.9`
- `git status --short --branch`

# Links / Artifacts

- `goal-43`
- `test-313`
