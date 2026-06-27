---
id: test-317
type: test
title: 0.4.0 package payload and publish dry run contract
status: done
priority: 1
epic: epic-204
parent: goal-42
tags: [0.4.0, npm, pack, publish-dry-run, payload, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-613]
blocks: [task-614, task-606, test-312]
refs: [task-613, task-606, test-312]
context_refs: []
evidence_refs: [chk-314]
aliases: []
skills: []
cases: []
created: 2026-06-27
updated: 2026-06-27
---
# Overview

Validate that the local `0.4.0` package payload and publish dry-run are complete
enough to permit an explicit real-publish approval decision.

# Target / Scope

`task-613`, npm registry preflight, pack dry-run payload, publish dry-run, and
no-side-effect boundary.

# Preconditions / Environment

`task-613` has completed and command receipts are available.

# Test Cases

- Registry state shows latest below `0.4.0` and `mdkg@0.4.0` unpublished before
  the real publish node opens.
- Pack dry-run includes `dist/cli.js`, init config, `COLLABORATION.md`,
  MANIFEST/SPEC compatibility assets, seeded skills, `README.md`,
  `CLI_COMMAND_MATRIX.md`, `CHANGELOG.md`, and `scripts/postinstall.js`.
- Publish dry-run succeeds against the public npm registry with isolated cache.
- No real npm publish, tag, push, deploy, DNS, analytics, or Vercel mutation
  occurs in the dry-run task.

# Results / Evidence

Passed. See `chk-314`.

# Notes / Follow-ups

- Passing this test is not approval to publish; it only unblocks `task-614`.
