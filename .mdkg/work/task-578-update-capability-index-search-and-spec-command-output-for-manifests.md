---
id: task-578
type: task
title: update capability index search and spec command output for manifests
status: todo
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
updated: 2026-06-25
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
- `src/graph/capabilities_index_cache.ts`
- `src/commands/capability.ts`
- `src/commands/spec.ts`
- `src/cli.ts`
- generated command contract/reference files
- example graph indexes

# Implementation Notes

- Preserve source path and legacy/canonical markers so the UI/CLI can explain
  why a record is deprecated.
- Add lower-case token-friendly aliases for punctuation-heavy queries.

# Test Plan

- `test-292`
- `npm run smoke:capabilities`
- `node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json`
- `node dist/cli.js capability search "spec.md compatibility alias" --json`

# Links / Artifacts

- `edd-54`
- `task-276`
- `test-292`
