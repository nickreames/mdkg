---
id: task-421
type: task
title: publish project DB queue adapter contract docs and JSON
status: done
priority: 1
epic: epic-110
parent: goal-22
tags: [queue, contract, docs]
owners: []
links: []
artifacts: []
relates: [goal-7]
blocked_by: [task-414]
blocks: [test-187, task-423]
refs: []
aliases: [queue-adapter-docs]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Publish a stable, generic adapter contract for the public project DB queue surface.

# Acceptance Criteria

- Docs distinguish public queue CLI semantics from internal project DB helper surfaces.
- The contract covers payload hash, dedupe key, oldest-ready claim, lease-owner checked ack/fail, retry delay, expired lease reclaim, max-attempt dead-letter, pause/resume, snapshot policy, and stats.
- A read-only JSON contract or equivalent generated reference is available to adapters.
- mdkg docs state that queue rows are delivery state, not canonical runtime history.

# Files Affected

- README and init README.
- CLI command matrix.
- Queue command docs or contract output.
- Publish-readiness assertions.

# Implementation Notes

- Keep the public queue contract stable and explicit; internal event/reducer/lease/materializer helpers remain internal.
- State that queue messages are delivery state, not canonical history.

# Test Plan

- Unit tests or snapshots for contract output.
- Existing queue smokes.
- test-187

# Links / Artifacts

- test-187
