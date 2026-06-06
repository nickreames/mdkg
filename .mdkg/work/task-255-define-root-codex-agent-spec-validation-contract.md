---
id: task-255
type: task
title: define root Codex agent SPEC validation contract
status: done
priority: 1
epic: epic-42
parent: goal-6
tags: [codex, agents, spec, validation]
owners: []
links: []
artifacts: []
relates: [goal-6, epic-42, test-91]
blocked_by: [task-254]
blocks: [task-256]
refs: [dec-22, edd-14]
aliases: [root-codex-agent-validation-contract]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Define the root Codex profile validation contract without editing root TOML.

# Acceptance Criteria

- Valid TOML.
- One agent per file.
- `name`, `description`, and `developer_instructions` present.
- Unique names and intentional-only built-in collisions.
- No secrets or local-only auth/provider state.
- Durable behavior mirrored into SPEC or flagged as repair work.

# Files Affected

- Child mdkg planning nodes only.

# Implementation Notes

- Do not mutate root `.codex/agents` from this child task.

# Test Plan

- `mdkg capability search "Codex projection" --json`

# Links / Artifacts

- `edd-14`
