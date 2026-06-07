---
id: task-282
type: task
title: define optional SPEC semantics and allowed spec_kind values
status: done
priority: 1
epic: epic-54
parent: goal-9
prev: task-281
next: task-283
tags: [spec, spec-kind, semantics]
owners: []
links: []
artifacts: []
relates: [goal-9, epic-54]
blocked_by: [task-281]
blocks: [task-283]
refs: [edd-15, dec-26]
aliases: [allowed-spec-kind-values]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define the 0.3.0 SPEC contract for optional, reusable capability surfaces.

# Acceptance Criteria

- Allowed `spec_kind` values are `cli_tool`, `api`, `agent`, `runtime_agent`, `capability`, `tool`, `model`, `runtime_image`, `integration`, and `project_service`.
- Repos without SPEC files remain valid.
- Documentation-only uses are routed to normal mdkg nodes instead of SPEC.

# Files Affected

- SPEC design and validation planning surfaces.

# Implementation Notes

- Preserve optional adoption and legacy compatibility.

# Test Plan

- `node dist/cli.js validate`
- `node dist/cli.js capability search "spec_kind" --json`

# Links / Artifacts

- `dec-26`

# Contract Definition

Defined on 2026-06-06.

## Optional Adoption

- Repositories with no `SPEC.md` files remain valid.
- Existing legacy SPEC records without `spec_kind` remain valid for 0.3.0 if
  they satisfy the pre-existing SPEC fields.
- New seeded/canonical templates should include `spec_kind`.
- Validation should provide compatibility diagnostics and misuse guidance
  without forcing every repo to adopt SPEC files.

## Allowed `spec_kind` Values

- `cli_tool`: command-line tool or CLI command family.
- `api`: service API, RPC, REST, GraphQL, protocol, or streaming surface.
- `agent`: durable agent role or agent behavior contract.
- `runtime_agent`: agent contract intended for runtime/scheduler projection.
- `capability`: named permission or reusable capability boundary.
- `tool`: callable tool or integration operation.
- `model`: model/provider capability contract.
- `runtime_image`: runtime image, sandbox image, or execution environment.
- `integration`: boundary between mdkg and another repo, service, system, or
  protocol.
- `project_service`: repo or project-level service capability contract.

## Documentation-Only Misuse Routing

The following are not valid SPEC purposes unless they define an invocable or
projectable reusable capability:

- current-state audits
- gap registers
- roadmaps
- go/no-go or launch notes
- checkpoints
- planning notes
- bug reports
- generic implementation tasks
- validation-only checklist documents

Route those to normal mdkg graph nodes:

- `task`, `checkpoint`, or `edd` for audits and gap notes
- `goal`, `epic`, `edd`, or `prd` for roadmaps and implementation plans
- `dec`, `task`, or `checkpoint` for launch/go-no-go notes
- `bug` for defects
- `test` for validation contracts
- `feedback`, `dispute`, or `proposal` for review loops

## Implementation Handoff

`task-283` should implement validation and diagnostics against this contract.
`task-287` should update default and canonical templates to carry
`spec_kind`. `task-285` should include `spec_kind` in concrete capability
index metadata.

# Verification Evidence

- `dec-26` now records the full 0.3.0 SPEC kind contract.
- `edd-15` now summarizes the same allowed values and optional compatibility
  policy.
