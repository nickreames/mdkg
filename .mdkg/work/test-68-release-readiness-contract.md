---
id: test-68
type: test
title: release readiness contract
status: done
priority: 1
epic: epic-17
tags: [0_0_7, test, release]
owners: []
links: []
artifacts: [npm-run-build, npm-run-test, node-dist-cli-skill-sync, node-dist-cli-validate, npm-run-cli-check, npm-run-smoke-consumer, .mdkg/work/chk-6-release-cut-and-readiness-audit.md]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-03-12
updated: 2026-03-12
---
# Overview

Validate that the `0.0.7` tree is internally consistent and ready for a normal version-bump / tag / publish sequence.

# Target / Scope

- `epic-17`
- `task-116`
- release-facing docs, init assets, runtime help, and packaged consumer behavior

# Preconditions / Environment

- build output is current
- live repo graph validates
- mirrored skills can be synced successfully

# Test Cases

- build passes
- unit tests pass
- validate passes
- CLI matrix/help parity passes
- packaged consumer smoke passes
- release checkpoint exists and records the current state

# Results / Evidence

Record the gate outputs in `artifacts` and link the release checkpoint.

# Notes / Follow-ups

- if any gate fails, keep `task-116` and `epic-17` open and record the blocker in the checkpoint
