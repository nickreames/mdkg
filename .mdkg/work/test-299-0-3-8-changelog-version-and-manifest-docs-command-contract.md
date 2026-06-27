---
id: test-299
type: test
title: 0.3.8 changelog version and manifest docs command contract
status: todo
priority: 4
tags: [release, polish, test, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, scripts/check-doc-command-examples.js, scripts/assert-publish-ready.js]
relates: []
blocked_by: []
blocks: []
refs: [goal-39, goal-38, task-585]
context_refs: [goal-38, task-585, task-586, task-587, task-588]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [changelog-0-3-8-manifest-not-unreleased, version-reference-parity, manifest-command-examples-recognized, assertion-catches-version-drift]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate the focused release-metadata blockers from `goal-38` before rerunning
the full publish dry-run.

# Target / Scope

- `CHANGELOG.md`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `scripts/check-doc-command-examples.js`
- `scripts/assert-publish-ready.js`

# Preconditions / Environment

- `package.json` remains `0.3.8`.
- No publish, tag, push, deploy, or downstream mutation is allowed.

# Test Cases

- `changelog-0-3-8-manifest-not-unreleased`: MANIFEST/SPEC notes are in
  `0.3.8`, not only under `Unreleased`.
- `version-reference-parity`: `README.md`, `CLI_COMMAND_MATRIX.md`,
  `package.json`, and `package-lock.json` agree on `0.3.8`.
- `manifest-command-examples-recognized`: `npm run docs:check-commands` accepts
  `mdkg manifest list/show` examples.
- `assertion-catches-version-drift`: publish-readiness assertions would fail if
  public current-version references drift from `package.json`.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- This test should close before `test-298`.
