---
id: task-268
type: task
title: define canonical SPEC frontmatter and compatibility rules
status: done
priority: 1
epic: epic-46
parent: goal-8
tags: [spec, frontmatter, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-46, test-99]
blocked_by: [task-266, task-267]
blocks: [task-271, task-277]
refs: [edd-14]
aliases: [spec-frontmatter-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define canonical SPEC frontmatter keys, optional extension keys, and backwards
compatibility rules.

# Acceptance Criteria

- Required keys and optional keys are separated.
- Unknown-key diagnostics are classified as warning or error.
- Existing template frontmatter has a migration path.
- Product-specific extension keys are allowed only in downstream repos.

# Test Plan

- `mdkg validate`
- `mdkg capability search "SPEC frontmatter contract" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Keep existing SPEC consumers compatible unless a future migration task says
  otherwise.
- This pass defines frontmatter policy only. It does not change parser,
  template, capability indexer, or bundled init behavior.

# Frontmatter Contract

Canonical mdkg `SPEC.md` frontmatter is a closed, validation-backed contract.
The current parser derives allowed keys and value kinds from the active
`spec.md` template schema, then applies additional SPEC-specific validation.
Later implementation can change the schema, but this design keeps existing
SPEC consumers compatible.

## Required Keys

Required keys for canonical mdkg SPEC records:

- `id`: lowercase portable id for the SPEC, not a numeric work-node id.
- `type`: always `spec`.
- `title`: non-empty display title.
- `version`: semantic version such as `0.1.0`.
- `role`: one of `orchestrator`, `subagent`, `standalone_agent`,
  `tool_service`, or `remote_agent`.
- `runtime_mode`: one of `room_orchestrated`, `standalone`, `tool_service`, or
  `remote`.
- `update_policy`: one of `manual`, `proposal_required`, `automatic`, or
  `disabled`.
- `created`: `YYYY-MM-DD`.
- `updated`: `YYYY-MM-DD`.

`status`, `priority`, and `skills` are intentionally not SPEC frontmatter keys.
Lifecycle and execution state belong in goal/task/test nodes, not durable
capability contracts.

## Optional Canonical Keys

Optional keys supported by the current SPEC schema and capability indexer:

- `work_contracts`: list of relative paths ending in `WORK.md`.
- `requested_capabilities`: list of stable capability ids.
- `skill_refs`: list of portable ids or qids for skills.
- `tool_refs`: list of portable ids or qids for tools.
- `model_refs`: list of portable ids or qids for model specs.
- `wasm_component_refs`: list of portable ids or qids for WASM components.
- `runtime_image_refs`: list of portable ids or qids for runtime-image specs.
- `subagent_refs`: list of portable ids or qids for subagent specs.
- `resource_profile`: lowercase token describing the intended resource class.
- `tags`: lowercase tags for discovery.
- `owners`: lowercase owner ids.
- `links`: reviewable links.
- `artifacts`: related files or artifact refs.
- `relates`: graph refs.
- `refs`: graph refs, portable refs, or URI refs accepted by the graph parser.
- `aliases`: lowercase aliases for discovery.

These optional keys should remain additive. Empty lists are valid when the
absence is intentional and the body sections explain the contract.

## Capability Indexing Contract

Capability search should continue to expose the machine-readable SPEC fields
that current agents need for routing:

- `version`
- `role`
- `runtime_mode`
- `work_contracts`
- `requested_capabilities`
- `skill_refs`
- `tool_refs`
- `model_refs`
- `wasm_component_refs`
- `runtime_image_refs`
- `subagent_refs`
- `resource_profile`
- `update_policy`

New frontmatter keys should not be assumed searchable until a later capability
indexing task explicitly adds them.

## Unknown-Key Policy

Current behavior is closed-schema: a key absent from the active SPEC template
schema is an error. That remains the canonical mdkg policy for generic mdkg
templates.

Future diagnostics should classify unknown keys as follows:

- Unknown key in canonical mdkg templates or checked-in generic examples:
  `error`.
- Unknown key in a normal repo SPEC using the canonical template set: `error`.
- Unknown key in an imported, legacy, or compatibility-review mode where the
  parser can inspect raw frontmatter before failing: `warning` with a repair
  suggestion.
- Known downstream extension key that is present in a downstream repo's local
  template schema: accepted downstream, but not promoted into canonical mdkg by
  default.
- Product-specific extension key in canonical mdkg templates, examples, design
  docs, or seeded assets: `error`.

Extension keys must be deliberate. Downstream repos may use local template
schemas to allow lower-case extension keys such as
`x_<repo_namespace>_<field>`, but canonical mdkg should not add those keys as
generic public examples.

## Compatibility And Migration Policy

The current `.mdkg/templates/default/spec.md` remains the compatibility source
for `mdkg new spec` until a future implementation task changes scaffold
behavior. The richer `.mdkg/templates/specs/*.SPEC.md` family is the design
surface for future template promotion.

Migration rules:

- Existing SPECs with current required keys remain valid.
- Richer section contracts from `task-267` may initially be validated as
  warnings for legacy minimal scaffolds.
- The canonical placeholder for the mdkg scaffold should remain `{{id}}` when
  reconciling `base.SPEC.md` with the default scaffold, because current
  `mdkg new spec` replacement uses `id`.
- New canonical frontmatter keys require a template-schema update, capability
  indexing decision when searchable, docs/examples, and migration notes.
- Removing or renaming current keys requires an explicit migration task and
  compatibility window.
- Product-specific frontmatter belongs only in downstream repo template sets or
  local SPECs, never in canonical mdkg templates.

# Links / Artifacts

- `goal-8`
- `epic-46`
