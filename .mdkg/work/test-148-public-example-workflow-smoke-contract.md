---
id: test-148
type: test
title: public example workflow smoke contract
status: todo
priority: 2
epic: epic-80
parent: goal-15
tags: [mdkg-dev, examples, temp-repo, smoke]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-356]
blocks: []
refs: []
aliases: []
skills: []
cases: [fresh repo example works, queue example works, spec work example works]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that public mdkg.dev examples execute in fresh temp repos and match the
documented CLI surface.

# Target / Scope

- `task-356`
- public examples for init, index, status/doctor, goals/tasks, pack,
  SPEC/WORK invocation, queues, and subgraphs

# Preconditions / Environment

- Fresh temp repo under `/private/tmp`.
- Installed or packed mdkg CLI for the target release.
- No network dependency unless a specific example explicitly documents one.

# Test Cases

- Run each public example command sequence in a fresh repo.
- Assert JSON outputs remain machine-readable on stdout.
- Assert examples do not require secrets, unpublished commands, or
  machine-specific paths.
- Run `mdkg validate --json` and relevant smoke checks after examples complete.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If an example cannot be made deterministic, move it to a conceptual guide and
  record the limitation.
