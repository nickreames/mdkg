---
id: task-277
type: task
title: define SPEC template migration and backcompat plan
status: done
priority: 1
epic: epic-51
parent: goal-8
tags: [spec, migration, compatibility, templates]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-51, test-105]
blocked_by: [task-268, task-276]
blocks: [task-278]
refs: [edd-14]
aliases: [spec-backcompat-plan]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define migration and compatibility behavior for existing templates and seeded
assets.

# Source Anchors

Future migration work should align with the existing upgrade and template
surfaces:

- `mdkg upgrade` defaults to dry-run and writes nothing.
- `mdkg upgrade --apply` is the only mutating scaffold path.
- Upgrade JSON receipts already expose `safe_to_apply`, `will_write_paths`,
  `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`.
- `src/commands/upgrade.ts` preserves customized docs, templates, skills, and
  core files.
- `src/graph/template_schema.ts`, `src/templates/loader.ts`, and
  `src/commands/new.ts` already support bundled template fallback when local
  templates are missing.
- `scripts/smoke-upgrade.js`, `tests/commands/upgrade.test.ts`, and
  `tests/commands/agent_file_types.test.ts` cover upgrade, missing template,
  and bundled fallback behavior today.

# Compatibility Modes

Future SPEC validation should distinguish four compatibility contexts:

- current: existing template schema behavior and existing `SPEC.md` consumers.
- compat: richer SPEC contracts produce warnings or repair diagnostics for
  legacy minimal scaffolds.
- strict: canonical mdkg templates, examples, and newly promoted SPEC fixtures
  must satisfy the richer contracts.
- downstream-local: downstream repos may accept local extension keys through
  local template schemas without promoting those keys into canonical mdkg.

The default migration path should be `current -> compat -> strict`, with a
reviewable release note and dry-run upgrade evidence before strict diagnostics
become errors for normal repositories.

# Migration Rules

- Existing `spec` nodes with current required frontmatter remain valid.
- Existing `.mdkg/templates/default/spec.md` consumers remain valid until a
  future source implementation explicitly promotes richer template behavior.
- Richer body-section contracts initially produce warnings or repair
  diagnostics for legacy minimal SPECs.
- New canonical frontmatter keys require a template-schema update, capability
  indexing decision, docs/examples, and migration notes before becoming
  required.
- Removing or renaming current keys requires a dedicated migration task,
  compatibility window, upgrade dry-run tests, and release notes.
- Product-specific extension keys are never added to canonical mdkg examples or
  seeded templates.
- Downstream local extensions must remain downstream-owned and should be
  preserved by mdkg upgrade.

# Upgrade Dry-Run Contract

Future SPEC template upgrades must be previewable before apply. A dry-run
receipt for SPEC changes should make these decisions reviewable:

- which template files would be created or updated.
- which files are preserved because they were customized locally.
- which changes are safe to apply automatically.
- which conflicts block apply.
- which compatibility diagnostics would change from warning to error.
- which init/dist assets must be refreshed.
- whether skill mirrors or projection files would be touched.

`mdkg upgrade --apply` must not overwrite customized SPEC templates,
downstream-local template sets, product-specific extension schemas, or
projection files. If a richer template cannot be safely applied, upgrade should
preserve the file and emit repair guidance.

# Template Promotion Policy

Promote templates in this order:

1. Keep `.mdkg/templates/specs/*.SPEC.md` as design/rich-template source.
2. Keep `.mdkg/templates/default/spec.md` as the compatibility scaffold until
   parser and diagnostics tests are green.
3. Add parser diagnostics that understand both minimal and rich SPEC shapes.
4. Add upgrade dry-run evidence for richer default scaffold changes.
5. Promote default scaffold changes only after `task-277` compatibility rules,
   upgrade tests, and docs are complete.
6. Refresh dist init assets and publish-readiness assertions in the same future
   source implementation slice.

The rich template family and default scaffold must not diverge silently. If
they intentionally differ, the docs and diagnostics should explain which shape
is authoring guidance and which shape is compatibility scaffolding.

# Downstream Extension Policy

Downstream repositories may carry local template sets or extension keys such
as lower-case `x_<namespace>_<field>` fields when their local schema allows
them. Canonical mdkg should treat those as downstream-owned:

- do not rewrite them during mdkg upgrade.
- do not add them to public mdkg examples.
- do not fail imported subgraph records solely because the owner workspace has
  a local schema extension.
- do surface repair guidance when a downstream extension leaks into canonical
  mdkg templates, docs, or fixtures.

# Validation And Test Expectations

Future implementation should add tests for:

- fresh init receives no unnecessary upgrade changes.
- old/minimal SPEC templates validate in compatibility mode.
- richer templates validate in strict mode.
- customized local SPEC templates are reported in
  `preserved_customizations` and not overwritten.
- missing local templates use bundled fallback with clear upgrade guidance.
- downstream extension keys are preserved when local schema allows them.
- product-specific extension keys in canonical mdkg templates fail.
- `smoke:upgrade`, `smoke:init`, `smoke:capabilities`, and `smoke:visibility`
  cover the release path.

# Release Notes Boundary

A future release that changes SPEC template behavior should explicitly say:

- whether changes are parser-only, diagnostics-only, scaffold-only, or
  upgrade-apply changes.
- whether existing repos see warnings or errors.
- how to preview changes with `mdkg upgrade --dry-run --json`.
- how to preserve local/downstream templates.
- that no projection/exporter files are written unless a separate exporter
  goal implements that behavior.

# Acceptance Criteria

- Existing `spec` nodes and template consumers remain valid or receive clear
  warnings.
- Template upgrades are previewable before apply.
- Downstream product-specific extensions are not rewritten by mdkg defaults.

# Test Plan

- Future upgrade dry-run contract references SPEC template changes.
- `mdkg capability search "spec backcompat plan" --json`
- `mdkg help upgrade`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Preserve existing template consumers unless a future migration is explicit.

# Links / Artifacts

- `goal-8`
- `epic-51`
