---
id: task-266
type: task
title: audit current SPEC template and default spec surfaces
status: done
priority: 1
epic: epic-46
parent: goal-8
tags: [audit, spec, templates]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/default/spec.md]
relates: [goal-8, epic-46, test-98]
blocked_by: []
blocks: [task-267, task-268]
refs: [edd-14]
aliases: [current-spec-surface-audit]
skills: [select-work-and-ground-context]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Audit the current SPEC templates, default `spec.md`, capability indexing, and
authoring guidance before expanding the design.

# Acceptance Criteria

- Current template families are listed.
- Gaps between `.mdkg/templates/specs` and `.mdkg/templates/default/spec.md` are
  recorded.
- Existing discovery and validation behavior is summarized.
- No source implementation is changed.

# Test Plan

- `mdkg capability search "SPEC template taxonomy" --json`
- `mdkg validate`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Inspect current template and default surfaces before proposing implementation.

# Audit Findings

Current canonical SPEC template families under `.mdkg/templates/specs`:

- `agent.SPEC.md`
- `api.SPEC.md`
- `base.SPEC.md`
- `capability.SPEC.md`
- `integration.SPEC.md`
- `model.SPEC.md`
- `project.SPEC.md`
- `runtime-agent.SPEC.md`
- `runtime-image.SPEC.md`
- `tool.SPEC.md`

The specialized template family is richer than the live default scaffold. The
base template includes identity, purpose, authority boundary, resource boundary,
optional resource URIs, capabilities, queue/event semantics, single-writer
policy, inputs, outputs, receipts/evidence, dependencies, security/privacy,
validation checks, closeout evidence, projection targets, versioning, change
policy, and open questions. The current `.mdkg/templates/default/spec.md`
remains a smaller validation-compatible scaffold with purpose, runtime, work
contracts, and capabilities only.

Observed gaps to carry into `task-267` and `task-268`:

- `base.SPEC.md` uses `id: {{spec_id}}`, while the current default scaffold uses
  `id: {{id}}`.
- Specialized templates use `extends` and `template_kind` metadata, but the
  current `mdkg new spec` path does not expand that family; a scaffold probe
  selected `.mdkg/templates/default/spec.md`.
- The root `.mdkg/templates/specs` family is present for design and authoring,
  but no matching seeded `assets/init/templates/specs` or
  `assets/init/templates/default/spec.md` surface exists yet.
- Current validation recommends the older four SPEC headings: purpose, runtime,
  work contracts, and capabilities. Goal-8 section semantics and diagnostics
  are not implemented yet.

Existing discovery and validation behavior:

- The capability indexer already supports `kind: spec` and SPEC frontmatter
  fields such as `version`, `role`, `runtime_mode`, `work_contracts`,
  `requested_capabilities`, `skill_refs`, `tool_refs`, `model_refs`,
  `wasm_component_refs`, `runtime_image_refs`, `subagent_refs`,
  `resource_profile`, and `update_policy`.
- `capability list --kind spec` currently returns zero repo SPEC records; SPEC
  design is discoverable through the design doc and the authoring skill rather
  than committed concrete `SPEC.md` nodes.
- Current SPEC validation enforces existing frontmatter enums and required
  fields, but it does not enforce the richer goal-8 section contract.
- No source implementation files were changed during this audit.

# Links / Artifacts

- `goal-8`
- `epic-46`
