---
id: task-816
type: task
title: Implement compact default init and focused instruction router
status: done
priority: 1
parent: goal-81
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-363]
blocks: []
refs: [edd-80, dec-93]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Implement goal-81's first increment: default compact agent setup with an explicit
graph-only alternative. Owner is mdkg-project-agent under the user's Goal 81 Run
authorization; scope and exclusions are recorded in goal-81.

# Acceptance Criteria

- Default init and legacy --agent seed thin AGENTS/CLAUDE wrappers and one compact
  .mdkg router; --graph-only omits agent guidance, skills and native mirrors.
- Conflicting flags fail before writes; preserve explicit ignore-option behavior.
- Help and output receipts reflect actual mode and exact emitted paths.
- Startup loads current constraints then focused work/skills, not the whole matrix.
- No website llms endpoint, README, LICENSE or unrelated project document changes
  are implied. No universal mandatory handbook or fleet migration dependency.

# Files Affected

Future source: src/commands/init.ts, src/commands/init_manifest.ts, init assets,
CLI help/contracts and focused init tests. No files changed by this node today.

# Implementation Notes

Follow edd-80. Freeze the generated-file inventory before implementing seed
changes; preserve root maintained source documentation as source where needed.
No on-read initialization or implicit agent enablement for existing graph-only
repos. Existing layouts remain readable until the reviewed upgrade path exists.

# Test Plan

Fresh empty repo, custom wrappers, default/--agent/--graph-only modes, conflicting
flags, ignore variants and second invocation. Prove emitted links resolve and
there is one bounded startup route. Full acceptance is test-474.

# Links / Artifacts

- edd-80, dec-93, goal-81.
- 2026-09-05: npm run build passed. Focused init/compact-bootstrap suite passed
  12/12 tests after npm run build:test. Default compact setup, explicit graph-only,
  managed wrapper preservation, conflicting modes, native mirrors and legacy
  --agent compatibility covered. Full CLI/docs and cross-command integration
  gates remain required by Goal 81 before closure.
