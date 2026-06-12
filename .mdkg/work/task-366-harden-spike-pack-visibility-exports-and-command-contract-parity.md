---
id: task-366
type: task
title: harden spike pack visibility exports and command contract parity
status: todo
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, pack, visibility, command-contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348, task-349]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Harden spike behavior in context packs, visibility-filtered output, structured
exports, and generated command metadata so the new node type behaves like a
first-class work item everywhere agents inspect mdkg state.

# Acceptance Criteria

- `mdkg pack <spike-id>` includes the spike root, relevant edges, and latest
  checkpoint behavior deterministically.
- Goal-root packs include scoped spikes and avoid unrelated spikes.
- Public/internal visibility filtering handles spikes consistently with other
  work-node types.
- `mdkg show/list/search` structured formats include spikes without malformed
  output.
- Generated command contract and command docs account for `mdkg new spike` and
  spike lifecycle wording.

# Files Affected

- Pack ordering/export code and tests.
- Command contract/docs generation outputs.
- Visibility and structured-output tests.

# Implementation Notes

- Treat spike as actionable work, not as architecture/reference-only content.
- Keep pack ordering stable with existing task/bug/test roots.
- Do not expose private-only source material in public packs.

# Test Plan

- `npm run test`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- `npm run smoke:spike`

# Links / Artifacts

- `task-348`
- `task-349`
- `test-154`
