---
id: task-578
type: task
title: update capability index search and spec command output for manifests
status: done
priority: 1
epic: epic-196
parent: goal-37
tags: [manifest, capability-index, search, cli, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-capability-index, manifest-search-compatibility, spec-command-legacy-output, manifest.md, manifest.md-legacy-spec.md, spec.md-compatibility-alias]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Update capability discovery and command output so manifest records are
discoverable under canonical manifest terminology while legacy SPEC queries and
consumers remain useful.

# Acceptance Criteria

- `MANIFEST.md` files appear in global and capability indexes.
- Legacy `SPEC.md` files still appear and remain discoverable.
- Search text includes both manifest and legacy spec terms during the bridge.
- `mdkg capability search "MANIFEST.md legacy SPEC.md" --json` returns the
  relevant capability/design/work records.
- `mdkg manifest list/show/validate` is the canonical future command surface.
- `mdkg spec list/show/validate` remains as a legacy alias for one
  compatibility release with manifest-first output and deprecation labeling.
- Existing JSON consumers are not broken without explicit migration metadata.

# Files Affected

- `src/graph/capabilities_indexer.ts`
- `src/commands/capability.ts`
- `src/commands/spec.ts`
- `src/cli.ts`
- `CLI_COMMAND_MATRIX.md`
- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`
- `tests/commands/capability.test.ts`
- `tests/commands/spec.test.ts`
- `tests/commands/cli.test.ts`
- `tests/commands/cli_help_matrix.test.ts`
- `.mdkg/index/mdkg.sqlite`

# Implementation Notes

- Preserve source path and legacy/canonical markers so the UI/CLI can explain
  why a record is deprecated.
- Add lower-case token-friendly aliases for punctuation-heavy queries.
- Keep capability JSON `kind: spec` for compatibility, and add explicit
  `manifest` metadata for `semantic_kind`, source basename/type, compatibility
  mode, deprecation, and command-family migration.

# Results / Evidence

- Capability records for manifest semantic nodes now include manifest bridge
  metadata while preserving compatibility `kind: spec`.
- Capability search text includes manifest metadata and bridge aliases such as
  `MANIFEST.md legacy SPEC.md` and `spec.md compatibility alias`.
- Added `mdkg manifest list/show/validate` as the canonical command family.
- Retained `mdkg spec list/show/validate` as the legacy alias with
  manifest-first JSON metadata and non-JSON deprecation labeling.
- Updated CLI help, command matrix, and generated command docs.
- `node --test dist/tests/commands/capability.test.js`: 3 passing.
- `node --test dist/tests/commands/spec.test.js`: 4 passing.
- `node --test dist/tests/commands/cli.test.js`: 15 passing.
- `node --test dist/tests/commands/cli_help_matrix.test.js`: 5 passing.
- `npm run smoke:capabilities`: `capability cache smoke passed`.
- `npm run cli:check`: `cli command matrix check: ok`.
- `npm run cli:contract`: `command contract check: ok`.
- `npm run docs:check`: `ok: true` after `npm run docs:generate`.
- `node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json`
  returned `dec-50`, `edd-54`, and `spec.mdkg-cli`.
- `node dist/cli.js capability search "spec.md compatibility alias" --json`
  returned `dec-50`, `edd-54`, and `spec.mdkg-cli`.
- `node dist/cli.js manifest list --json` returned the dogfood
  `spec.mdkg-cli` record with `kind: manifest`, `compatibility_kind: spec`,
  and legacy manifest metadata.

# Test Plan

- `test-292`
- `npm run smoke:capabilities`
- `node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json`
- `node dist/cli.js capability search "spec.md compatibility alias" --json`

# Links / Artifacts

- `edd-54`
- `task-276`
- `test-292`
