---
id: test-131
type: test
title: mdkg dev generated command docs gate contract
status: done
priority: 1
epic: epic-73
parent: goal-13
tags: [mdkg-dev, docs, cli-spec, test]
owners: []
links: []
artifacts: []
relates: [goal-13, epic-73, epic-72, task-328, task-330]
blocked_by: [task-346]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate that mdkg.dev command documentation remains blocked until generated
mdkg-native command contract output exists.

# Target / Scope

- Generated command contract and docs gate.
- mdkg.dev readiness and launch gate.

# Preconditions / Environment

- `task-346` has added the generated command docs readiness smoke and publish
  gate.

# Checks

- Future docs-readiness smoke must prove command docs are generated from CLI
  contract output, not hand-maintained command tables.
- mdkg.dev launch planning remains blocked until generated command docs exist.
- Generated command docs must be public-safe and exclude hidden/internal
  command records.

# Test Cases

- Docs readiness smoke consumes the generated mdkg-native command contract.
- Representative examples from generated docs execute in a temp repo.
- Hand-maintained command reference drift fails the gate.
- `task-330` remains blocked until this contract passes.

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

# Notes / Follow-ups

- This is a gate for mdkg.dev planning, not a website implementation test.
