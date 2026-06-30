---
id: task-629
type: task
title: create sanitized demo 1 graph filesystem and output snapshot
status: todo
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, snapshot, no-secret, graph, filesystem, output]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-628]
blocks: [task-630, test-324, task-622]
refs: [task-628, edd-60]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Create the public-safe data snapshot that powers Demo 1. The snapshot should
show enough mdkg graph, source, and output context for readers to understand the
demo without exposing private prompts, provider payloads, secrets, or unrelated
local files.

# Acceptance Criteria

- Snapshot is derived from `examples/demo-runs/demo-001` and records its source
  version or commit context.
- Snapshot includes a bounded sanitized mdkg graph selection.
- Snapshot includes selected read-only filesystem files and explicit omission
  rules.
- Snapshot includes or points to the final output route/source needed for
  `/demo/1/output`.
- No-secret and public-claims audits are required before the snapshot can be
  used by public mdkg-dev routes.

# Files Affected

- Future implementation likely adds mdkg-dev demo data files.
- Future implementation may add a static output copy for Demo 1.
- This task's closeout may write mdkg checkpoint/evidence only.

# Implementation Notes

- Keep the snapshot intentionally small and reviewable.
- Do not include raw event logs, raw prompts, provider payloads, cookies, bypass
  secrets, tokens, or private absolute paths.
- If any data cannot be made public-safe, record the omission instead of
  redacting in a way that implies completeness.

# Test Plan

- no-secret audit of snapshot files
- public-claims audit of demo copy and rendered output
- Browser/Chrome local validation once routes exist
- `test-324`

# Links / Artifacts

- `task-628`
- `edd-60`
