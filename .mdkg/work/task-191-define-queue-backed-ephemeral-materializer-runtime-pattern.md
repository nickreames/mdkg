---
id: task-191
type: task
title: define queue backed ephemeral materializer runtime pattern
status: todo
priority: 2
epic: epic-29
tags: [project-db, queue, materializer, sandbox]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-33, task-190]
blocked_by: [task-190]
blocks: [task-193]
refs: []
aliases: [ephemeral-materializer-pattern]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define the future queue-backed materializer pattern where disposable workers
hydrate state, process durable events, emit receipts, and shut down.

# Acceptance Criteria

- Queue messages carry lightweight references such as project, branch, and event
  ids.
- Worker loads durable event bodies from the event store.
- Worker hydrates latest sealed snapshot, applies typed reducers, verifies,
  seals, writes receipts, and acknowledges the queue.
- Sandbox filesystem, active WAL, and scratch files are disposable.

# Explicit Exclusions

- Queue is not the durable event history.
- No external queue adapter required in the first local project DB phase.

# Files Affected

- Future worker pattern docs, local worker smoke, and queue adapter contracts.

# Implementation Notes

Plan queue-backed materialization after local event, receipt, lease, and seal
contracts are stable.

# Test Plan

- Future integration smoke can replay a local event batch through a simulated
  worker without an external queue service.

# Links / Artifacts

- `epic-33`
- `task-190`
