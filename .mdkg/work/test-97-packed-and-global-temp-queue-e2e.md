---
id: test-97
type: test
title: packed and global temp queue E2E
status: done
priority: 1
epic: epic-29
parent: goal-7
tags: [project-db, queue, e2e, npm, test]
owners: []
links: []
artifacts: []
relates: [goal-7, task-264, task-265, test-95, test-96]
blocked_by: [task-264]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Validate the queue CLI through packaged and globally installed mdkg binaries.

# Target / Scope

Packed package smoke and post-publish global temp-directory E2E.

# Preconditions / Environment

For packed smoke, npm installs the tarball into a temp prefix. For post-publish
E2E, `/opt/homebrew/bin/mdkg` is installed from npm registry at `0.2.0`.

# Test Cases

- `scripts/smoke-db-queue-cli.js` uses packaged `mdkg db queue ...` only.
- Global temp repo exercises queue lifecycle and snapshot safety.
- `db verify`, `db stats`, `snapshot dump/diff`, `index`, `validate`, and
  `search` work after queue operations.
- Runtime DB files remain ignored; schema migrations and sealed state are
  commit-eligible by policy.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Stop if global install into `/opt/homebrew` is denied.
