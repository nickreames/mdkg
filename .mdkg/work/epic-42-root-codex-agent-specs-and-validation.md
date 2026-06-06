---
id: epic-42
type: epic
title: root Codex agent SPECs and validation
status: done
priority: 1
tags: [codex, agents, spec, validation]
owners: []
links: []
artifacts: []
relates: [goal-6, edd-14, dec-22]
blocked_by: []
blocks: [task-255, test-91]
refs: [dec-22]
aliases: [root-codex-agent-validation]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Define how root Codex agent profiles become durable SPEC-backed projections.

# Goal

Make root Codex validation reproducible and SPEC-backed.

# Scope

Validation contract and repair requirements only.

# Milestones

- Required projection fields documented.
- SPEC linkage requirement documented.

# Out of Scope

- Root TOML mutation.

# Risks

- Runtime-specific TOML fields are mistaken for durable capability source.

# Links / Artifacts

- `dec-22`
- `edd-14`
