---
id: task-693
type: task
title: Add first-class loop readiness metadata fields
status: done
priority: 1
epic: epic-220
parent: goal-59
tags: [loop, metadata, readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, loop-4]
context_refs: []
evidence_refs: [chk-392]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Add the loop metadata needed for operator readiness without introducing
separate `loop_template` or `loop_run` node types.

# Acceptance Criteria

- Loop nodes can represent first-class `pre_run_questions`,
  `pre_approved_actions`, `approval_gated_actions`, `evidence_lanes`,
  `lane_waiver_refs`, `decision_refs`, and `approval_refs`.
- Existing loop fields from `goal-58` remain valid.
- Missing optional readiness metadata does not break legacy loops.
- Invalid typed refs fail clearly when validation can resolve them.
- The design stays generic mdkg and does not encode runtime-specific execution
  behavior.

# Files Affected

- `src/graph/node.ts`
- `src/commands/loop.ts`
- `.mdkg/templates/default/loop.md`
- seeded loop templates if default metadata needs to be present

# Implementation Notes

- Keep metadata additive and backward-compatible.
- Prefer arrays/objects that can round-trip through existing frontmatter
  parsing.
- Use `decision_refs` for durable rationale and `approval_refs` for explicit
  human/orchestrator approval evidence.
- Do not implement `/goal` handoff output.

# Test Plan

- `npm run build`
- focused loop parser/validation tests
- `node dist/cli.js validate --changed-only --json`
- `test-367`

# Links / Artifacts

- `goal-59`
- `edd-69`
- `dec-66`
- `loop-4`
