---
id: test-332
type: test
title: validate package release gates and consumer dependency handoff
status: todo
priority: 1
tags: [goal-48, release, consumer-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate the eventual package/release gate and runtime-consumer handoff before
mdkg declares generic contract-profile support ready for Omni Room consumers.

# Target / Scope

- `task-635`
- `task-636`
- Later release execution gates and downstream dependency guidance.

# Preconditions / Environment

- Candidate implementation tasks are complete in a later execution pass.
- Package version and registry state are resolved live during that pass.

# Test Cases

- Local build, unit tests, CLI checks, docs/reference checks, workflow
  validation, scaffold/upgrade smoke, and relevant package smokes pass.
- `npm pack --dry-run --json` or successor package review shows expected
  payload without accidental docs/template/source omissions.
- Runtime-consumer handoff does not hardcode a future mdkg version and does not
  require unreleased flags without an experimental/local caveat.
- Closeout records exact changed files, validation receipts, local commit SHA,
  remaining dirty state, and no-push status.

# Results / Evidence

Pending. This test is intentionally todo with the seeded planning goal.

# Notes / Follow-ups

- Publishing, version bumping, tagging, pushing, or downstream mutation require
  a later explicit release execution goal.
