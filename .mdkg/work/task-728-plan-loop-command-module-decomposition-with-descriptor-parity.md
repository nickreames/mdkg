---
id: task-728
type: task
title: Plan loop command module decomposition with descriptor parity
status: todo
priority: 2
tags: [loop, cli, modularity, planning]
owners: []
links: []
artifacts: []
relates: [loop-6, goal-60, prop-5]
blocked_by: []
blocks: []
refs: [loop-6, goal-60, prop-5, spike-31, test-399]
context_refs: [spike-31, prop-5]
evidence_refs: [spike-31]
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Turn the backend/API/CLI dogfood evidence into a bounded decomposition plan for the loop command implementation. This is future `goal-60` planning work, not a v0.5.0 release blocker and not authorization to refactor the current implementation.

# Acceptance Criteria

- Map current `src/commands/loop.ts` responsibilities and internal dependency boundaries.
- Recommend extraction order for template discovery, fork/materialization, readiness, provenance, routing, and output adapters.
- Preserve typed descriptor ownership, JSON envelopes, dry-run purity, and command compatibility through `test-399`.
- Compare incremental decomposition with generic CLI-framework-first and no-refactor alternatives.
- Do not modify source until `goal-60` is intentionally activated and scoped.

# Files Affected

- mdkg design and work nodes owned by future `goal-60`
- No source files in this planning task

# Implementation Notes

- Start from measurements and boundaries recorded in `spike-31` and the selected recommendation in `prop-5`.
- Prefer loop-owned extractions before attempting a generic command framework across older command families.
- Treat descriptors as public contract metadata, not as a requirement that every internal service live in one module.

# Test Plan

- Review the proposed module map against all loop commands and side-effect declarations.
- Ensure `test-399` enumerates the compatibility surface future implementation must preserve.
- Confirm `goal-61` does not claim this future refactor as completed release work.

# Links / Artifacts

- Audit evidence: `spike-31`
- Recommended direction: `prop-5`
- Future regression contract: `test-399`
