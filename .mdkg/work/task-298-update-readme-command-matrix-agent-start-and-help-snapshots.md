---
id: task-298
type: task
title: update README CLI command matrix AGENT_START and help snapshots
status: done
priority: 2
epic: epic-60
parent: goal-9
prev: task-297
next: task-299
tags: [docs, help, command-matrix]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, AGENT_START.md]
relates: [goal-9, epic-60, test-116]
blocked_by: [task-297]
blocks: [task-299]
refs: [edd-15]
aliases: [0-3-0-docs-help-updates]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Document the new SPEC and work invocation surface in user-facing docs and help
snapshots.

# Acceptance Criteria

- README explains optional SPECs and work invocation semantic mirrors.
- Command matrix lists new spec/work commands and flags.
- AGENT_START points agents to the correct commands.
- Help snapshots are regenerated and checked.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- help snapshots

# Implementation Notes

- Keep public wording generic and explicit about non-runtime boundaries.

# Test Plan

- `npm run cli:check`
- `node dist/cli.js --help`
- `git diff --check`

# Links / Artifacts

- `test-116`
