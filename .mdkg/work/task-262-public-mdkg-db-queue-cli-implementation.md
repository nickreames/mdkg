---
id: task-262
type: task
title: public mdkg db queue CLI implementation
status: done
priority: 1
epic: epic-33
parent: goal-7
tags: [project-db, queue, cli, implementation]
owners: []
links: []
artifacts: []
relates: [goal-7, epic-33, task-261, test-95]
blocked_by: [task-261]
blocks: [task-264, test-95]
refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-05
updated: 2026-06-05
---
# Overview

Expose the project DB queue primitives through the public `mdkg db queue ...`
CLI namespace.

# Acceptance Criteria

- `mdkg db queue` help lists create, pause, resume, enqueue, claim, ack, fail,
  dead-letter, release-expired, stats, list, and show.
- Commands support `--json` receipts and useful human-readable output.
- Payload input supports exactly one of `--payload-json` or `--payload-file`.
- Usage errors, validation errors, and wrong-worker lease errors return existing
  CLI error classes/status behavior.
- Public CLI tests exercise normal lifecycle and core misuse cases.

# Files Affected

- `src/cli.ts`
- `src/commands/db.ts`
- `tests/commands/cli*.test.ts`

# Implementation Notes

- Do not expose arbitrary SQL.
- Do not add top-level `mdkg queue` aliases in this release.

# Test Plan

- Unit/dispatch tests plus `npm run smoke:db-queue-cli`.

# Links / Artifacts

- related docs
- related issues
- references
