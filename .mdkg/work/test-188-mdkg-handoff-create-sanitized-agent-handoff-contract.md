---
id: test-188
type: test
title: mdkg handoff create sanitized agent handoff contract
status: done
priority: 1
epic: epic-111
parent: goal-22
tags: [handoff, safety, pack]
owners: []
links: []
artifacts: []
relates: [task-422]
blocked_by: [task-422]
blocks: []
refs: []
aliases: [handoff-create-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate `mdkg handoff create` output, receipt shape, and safety warnings.

# Target / Scope

- Handoff command.
- Pack integration.
- Raw marker warning behavior.

# Preconditions / Environment

- Temp repo with goal, task, checkpoint, context refs, evidence refs, validation evidence, and deliberate raw-marker fixture.

# Test Cases

- Handoff output contains objective, state, boundaries, required checks, nodes, checkpoints, validation evidence, and next actions.
- JSON receipt reports output path, warnings, included nodes, and source id.
- Obvious raw marker content is warned and omitted or redacted according to command policy.
- Structural failures fail closed.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Pair with `npm run smoke:handoff`.
