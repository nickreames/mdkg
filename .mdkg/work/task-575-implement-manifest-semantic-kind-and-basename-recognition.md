---
id: task-575
type: task
title: implement MANIFEST semantic kind and basename recognition
status: done
priority: 1
epic: epic-195
parent: goal-37
tags: [manifest, parser, file-kind, omni]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-semantic-kind, manifest-basename-recognition, legacy-spec-file-kind]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Introduce the canonical manifest semantic kind and update basename recognition
so `MANIFEST.md` is first-class while legacy `SPEC.md` remains parseable.

# Acceptance Criteria

- Internal model has a canonical manifest kind or equivalent normalized
  manifest semantic record.
- `MANIFEST.md` maps to the canonical manifest kind.
- `SPEC.md` maps to the same logical kind through an explicit legacy alias.
- User-facing errors and help mention `MANIFEST.md` first.
- Serialized/indexed compatibility is preserved for existing `kind: spec`
  consumers or changed only with a documented migration path.

# Files Affected

- `src/graph/agent_file_types.ts`
- `src/graph/node.ts`
- `src/graph/indexer.ts`
- `src/graph/sqlite_index.ts`
- parser and fixture helpers identified by `task-573`

# Implementation Notes

- Avoid a pure display-layer rename. The normalized semantic kind must be used
  by validation, indexing, pack, and work trigger behavior.
- Keep source path identity intact so diagnostics can tell users which legacy
  file to rename.

# Implementation Evidence

- Added canonical `manifest` to agent workflow file types with
  `MANIFEST.md` as its basename while retaining legacy `spec` / `SPEC.md`.
- Added a shared manifest-semantic predicate so validation, capability
  indexing, and work trigger/contract relationship code treat `manifest` and
  legacy `spec` as the same logical capability family.
- Reused the existing `spec` template schema for parser validation of
  `type: manifest` until the later scaffold/template task vendors canonical
  manifest templates.
- Preserved compatibility for existing capability JSON by projecting manifest
  nodes as `kind: "spec"` records while exposing `node_type: "manifest"` and
  the original source path.
- Updated immediate CLI help and command matrix text to mention `MANIFEST.md`
  first while documenting `SPEC.md` as the legacy alias.
- Added focused tests proving a valid `MANIFEST.md` with `type: manifest`
  validates, indexes as a manifest node, and remains visible to existing
  `kind: spec` capability consumers.

# Verification Evidence

- `npm run build`: pass.
- `npm run build:test`: pass.
- `node --test dist/tests/commands/agent_file_types.test.js`: 35 pass.
- `node --test dist/tests/graph/capabilities_indexer.test.js`: 4 pass.
- `node --test dist/tests/commands/spec.test.js`: 3 pass.
- `node --test dist/tests/commands/cli.test.js`: 15 pass.
- `npm run cli:check`: pass.
- `npm run cli:contract`: pass.
- `node dist/cli.js validate --json`: `ok: true`, zero warnings, zero errors.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, zero
  warnings, zero errors.
- `node dist/cli.js work validate --type manifest --json`: accepted the new
  type and returned `ok: true`.

# Test Plan

- `node --test dist/tests/commands/agent_file_types.test.js`
- `node --test dist/tests/graph/capabilities_indexer.test.js`
- `test-289`
- `test-290`

# Links / Artifacts

- `edd-54`
- `task-276`
- `test-289`
- `test-290`
