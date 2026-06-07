---
id: chk-60
type: checkpoint
title: 0.3.0 optional SPEC kind contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-282]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-282]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

Defined the 0.3.0 optional SPEC semantics and the allowed `spec_kind` values
that implementation must enforce and index.

# Scope Covered

- `task-282`: optional adoption, legacy compatibility, allowed `spec_kind`
  values, documentation-only misuse routing, and implementation handoff.

# Decisions Captured

- SPEC files remain optional.
- Legacy SPEC files without `spec_kind` remain valid in 0.3.0 when they satisfy
  existing SPEC validation.
- New SPEC records and templates should use one of: `cli_tool`, `api`, `agent`,
  `runtime_agent`, `capability`, `tool`, `model`, `runtime_image`,
  `integration`, or `project_service`.
- Audits, gap registers, roadmaps, go/no-go notes, checkpoints, planning notes,
  defects, generic tasks, and validation checklists should route to normal mdkg
  node types unless they define reusable invocable capability surfaces.

# Implementation Summary

- Updated `dec-26` with the full SPEC kind contract and misuse routing.
- Updated `edd-15` with the data-model summary and compatibility rule.
- Added searchable `spec_kind` metadata to the relevant design anchors.
- Added task-level implementation handoff notes for `task-283`, `task-285`, and
  `task-287`.

# Verification / Testing

- `node dist/cli.js index`: passed.
- `node dist/cli.js capability search "spec_kind" --json`: returned `dec-26`
  and `edd-15`.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `git diff --check`: passed.

# Known Issues / Follow-ups

- Validation implementation remains open in `task-283`.
- Template updates remain open in `task-287`.
- Capability index `spec_kind` metadata remains open in `task-285`.

# Links / Artifacts

- `task-282`
- `dec-26`
- `edd-15`
- `.mdkg/pack/pack_standard_task-282_20260606-104952044.md`
