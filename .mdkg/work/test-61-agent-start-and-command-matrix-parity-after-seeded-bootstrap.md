---
id: test-61
type: test
title: agent start and command matrix parity after seeded bootstrap
status: done
priority: 1
epic: epic-16
tags: [0_0_6, startup, docs, skills]
owners: []
links: []
artifacts: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/skills/registry.md, tests/commands/init.test.ts]
relates: [task-104, task-106, task-107, epic-16]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [startup-references-seeded-skill, matrix-parity, registry-parity]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Validate that the startup doc, command matrix, and registry all agree on the new seeded bootstrap behavior.

# Target / Scope

- `task-104`
- `task-106`
- `task-107`

# Preconditions / Environment

- root docs plus init assets

# Test Cases

- `AGENT_START.md` points to SOUL/HUMAN, `.mdkg/README.md`, `CLI_COMMAND_MATRIX.md`, and the seeded planning skill
- command matrix matches runtime help for the agent bootstrap and event behavior
- registry reflects the same seeded skills and mirror expectations

# Results / Evidence

- attach docs parity evidence and any updated snapshots

# Notes / Follow-ups

- none once green
