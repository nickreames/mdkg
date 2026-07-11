---
id: task-676
type: task
title: add loop templates and init upgrade fallback coverage
status: done
priority: 1
epic: epic-214
parent: goal-58
tags: [loop, templates, init, upgrade]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-675]
blocks: []
refs: [goal-58, edd-66, dec-65, task-667]
context_refs: []
evidence_refs: [chk-383]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Add validation-clean default loop templates and ensure init/upgrade fallback
paths can scaffold loop nodes consistently.

# Acceptance Criteria

- `.mdkg/templates/default/loop.md` exists and validates.
- Bundled/init fallback templates include the loop template where current
  scaffold rules require it.
- `mdkg new loop "<title>"` or the selected loop creation path can create a
  validation-clean loop node.

# Files Affected

- `.mdkg/templates/default/`
- `src/commands/new.ts`
- init/upgrade template assets and fixture helpers

# Implementation Notes

- Keep template content declarative process state, not runtime execution
  instructions.
- Template should include enough metadata for mode, scope, lineage, child refs,
  evidence refs, and blocker-continuation guidance.

# Test Plan

- New command/template tests for loop creation.
- Upgrade/init smoke coverage if the template is copied into scaffold assets.

# Links / Artifacts

- `task-675`
- `test-351`
