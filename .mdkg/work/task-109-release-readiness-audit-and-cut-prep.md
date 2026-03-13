---
id: task-109
type: task
title: release readiness audit and cut prep
status: done
priority: 1
epic: epic-16
tags: [0_0_6, release, audit]
owners: []
links: []
artifacts: [package.json, package-lock.json, README.md, CLI_COMMAND_MATRIX.md, npm-run-build, npm-run-test, node-dist-cli-skill-sync, node-dist-cli-validate, npm-run-cli-check, npm-run-smoke-consumer]
relates: [dec-19, epic-16]
blocked_by: []
blocks: [test-62]
refs: [test-62]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Run the full release gate, decide whether the tree is ready for `0.0.6`, and perform the cut only if every gate is green.

# Acceptance Criteria

- `package.json` stays at `0.0.5` until this task
- `chk-5-release-cut-and-readiness-audit` is created and populated with real evidence
- all release gates pass before version bump/tag/publish
- if any gate fails, the blocker is recorded and the release remains open

# Files Affected

- `package.json`
- `package-lock.json`
- release-facing docs
- release checkpoint node

# Implementation Notes

- do not tag or publish until the checkpoint captures the actual gate results
- use the same publish verification pattern as `0.0.4` / `0.0.5`

# Test Plan

- `test-62`
- full release gate run

# Links / Artifacts

- `dec-19`
