---
id: task-537
type: task
title: add public command-example validation against the command contract
status: todo
priority: 1
epic: epic-173
parent: goal-34
tags: [mdkg-dev, commands, docs-check]
owners: []
links: []
artifacts: []
relates: [goal-34, test-261]
blocked_by: [task-535]
blocks: [task-544]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-43, edd-39]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Add automation that catches stale or invalid public command examples before previews drift.

# Acceptance Criteria

- New command/example docs check scans public content.
- Canonical examples are validated against command contract, help, or safe focused execution.
- Illustrative placeholders are consistently marked and allowlisted.
- `npm run docs:check-commands` or equivalent exists and is wired into pass-4 gates.
- `test-261` passes.

# Files Affected

- `scripts/**`
- `package.json`
- `docs/**`
- `mdkg-dev/**`

# Implementation Notes

- Do not execute external side-effect commands as part of validation.
- Prefer deterministic fixtures for commands needing repo state.

# Test Plan

Unit/parser tests and pass-4 smoke intentionally fail on known invalid examples during development, then pass after corrections.

# Links / Artifacts

- `test-261`
