---
id: task-288
type: task
title: harden WORK.md invocation contract fields and validation
status: done
priority: 1
epic: epic-56
parent: goal-9
prev: task-287
next: task-289
tags: [work, schema, validation]
owners: []
links: []
artifacts: [.mdkg/templates/default/work.md, src/graph/agent_file_types.ts]
relates: [goal-9, epic-56, test-111]
blocked_by: [task-287]
blocks: [task-289, test-111]
refs: [dec-27]
aliases: [work-invocation-contract]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Ensure `WORK.md` is a reusable invocation contract tied to an agent/spec or
capability.

# Acceptance Criteria

- Work contracts preserve required capabilities, inputs, outputs, receipt requirement, and dependency refs.
- Validation rejects ambiguous or empty invocation contracts.
- Existing work fixtures remain compatible or receive documented migration.

# Files Affected

- `.mdkg/templates/default/work.md`
- `src/graph/agent_file_types.ts`
- `tests`

# Implementation Notes

- Keep WORK as reusable contract, not an invocation instance.

# Test Plan

- Unit fixtures for valid and invalid WORK contracts.
- `npm run test`
- `node dist/cli.js validate`

# Links / Artifacts

- `test-111`
