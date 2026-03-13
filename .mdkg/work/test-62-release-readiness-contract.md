---
id: test-62
type: test
title: release readiness contract
status: done
priority: 1
epic: epic-16
tags: [0_0_6, release, gates]
owners: []
links: []
artifacts: [package.json, package-lock.json, chk-5-release-cut-and-readiness-audit]
relates: [task-105, task-108, task-109, epic-16]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [full-gates-pass, version-bump-at-cut, publish-verify-push]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Validate that the repo is actually ready for a `0.0.6` cut and that release bookkeeping happens in the right order.

# Target / Scope

- `task-105`
- `task-108`
- `task-109`

# Preconditions / Environment

- release-candidate tree
- npm auth available at cut time

# Test Cases

- full release gates pass
- version stays `0.0.5` until cut time
- release checkpoint captures real gate evidence
- publish verification and git push are recorded if the cut proceeds

# Results / Evidence

- attach release gate outputs and publish verification

# Notes / Follow-ups

- record blockers if any gate fails
