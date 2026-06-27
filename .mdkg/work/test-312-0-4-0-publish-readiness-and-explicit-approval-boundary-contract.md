---
id: test-312
type: test
title: 0.4.0 publish readiness and explicit approval boundary contract
status: todo
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, publish-readiness, npm, approval, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-606]
blocks: []
refs: [task-606]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate the `0.4.0` package publish-readiness recommendation and explicit
approval boundary.

# Target / Scope

`task-606`, `goal-42`, package release metadata, changelog/release notes,
pre-publish gates, npm dry-run behavior, and no-side-effect boundaries.

# Preconditions / Environment

All `goal-42` docs/site/example/browser contracts are complete or their gaps are
known and recorded.

# Test Cases

- Git/changelog audit maps every publish-bound change to release notes,
  version references, tests, docs/site changes, browser proof, and package
  payload.
- Registry checks prove current latest and whether `mdkg@0.4.0` is already
  published.
- Build, test, CLI, docs, publish-readiness, pack dry-run, and publish dry-run
  gates pass before any ready recommendation.
- Final closeout recommends either `publish/launch ready pending explicit
  approval` or lists exact remaining gaps.
- No real npm publish, git tag, push, deploy, DNS, analytics, or downstream repo
  mutation occurs without explicit approval.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Readiness is not authorization to publish or launch.
