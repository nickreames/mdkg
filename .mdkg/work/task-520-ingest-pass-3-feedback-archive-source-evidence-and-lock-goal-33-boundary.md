---
id: task-520
type: task
title: ingest pass-3 feedback archive source evidence and lock goal-33 boundary
status: done
priority: 1
epic: epic-165
parent: goal-33
tags: [mdkg-dev, graph-only, pass-3]
owners: []
links: []
artifacts: [pasted-text.txt]
relates: [goal-33, test-249]
blocked_by: []
blocks: [task-521, test-249]
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Perform the mdkg-only setup for pass-3: archive the attached feedback, create `goal-33`, design records, epics, tasks, tests, and routing evidence, then stop before functional source changes.

# Acceptance Criteria

- `archive://archive.mdkg-dev-polish-pass-3-2026-06-24` verifies.
- Goal 33 includes the implementation boundary, required checks, required checkpoints, and no-launch stop conditions.
- `goal next goal-33` routes to `task-520` before closeout.
- After closeout, `goal claim goal-33 task-521` makes the next implementation node explicit.
- No files under `mdkg-dev/`, `docs/`, `examples/`, `src/**`, `scripts/**`, package metadata, generated docs, or deploy config are changed.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js archive verify archive://archive.mdkg-dev-polish-pass-3-2026-06-24 --json`
- `node dist/cli.js goal next goal-33 --json`
- `git diff --check`

# Files Affected

# Implementation Notes

# Links / Artifacts
