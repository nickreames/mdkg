---
id: task-285
type: task
title: index concrete SPEC records with spec_kind and capability metadata
status: done
priority: 1
epic: epic-55
parent: goal-9
prev: task-284
next: task-286
tags: [spec, capability-index, metadata]
owners: []
links: []
artifacts: [src/graph/capabilities_indexer.ts]
relates: [goal-9, epic-55, test-109, test-110]
blocked_by: [task-284]
blocks: [task-286, test-110]
refs: [edd-15]
aliases: [spec-capability-metadata-indexing]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Extend capability records for SPEC files so search/list/show expose the useful
frontmatter needed by orchestrators and humans.

# Acceptance Criteria

- SPEC capability records include `spec_kind`, capabilities, resource refs, work contract refs, projection refs, and security-relevant metadata when present.
- Imported subgraph SPEC records remain read-only.
- Existing skill, work, core, and design capability records remain compatible.

# Files Affected

- `src/graph/capabilities_indexer.ts`
- `tests`

# Implementation Notes

- Keep capability output deterministic and redaction-safe.

# Test Plan

- Unit tests for SPEC capability record metadata.
- `npm run smoke:capabilities`
- `node dist/cli.js capability list --kind spec --json`

# Links / Artifacts

- `test-109`
- `test-110`

# Implementation Evidence

Completed on 2026-06-06.

## Source Changes

- `src/graph/capabilities_indexer.ts`
  - SPEC capability records now project `spec_kind` in the `spec` metadata
    object.
- `tests/graph/capabilities_indexer.test.ts`
  - The fixture SPEC now includes `spec_kind: agent`.
  - The unit test asserts projected SPEC metadata includes `spec_kind` and
    requested capabilities while existing skill, work, core, and design
    capability records remain present.

## Live Dogfood Proof

- `node dist/cli.js capability list --kind spec --json` returns
  `root:spec.mdkg-cli`.
- The returned record includes `spec.spec_kind: cli_tool`,
  `requested_capabilities`, `work_contracts`, dependency refs, links, headings,
  visibility, source hash, and deterministic indexed metadata.

## Verification Evidence

- `npm run build`: passed.
- `npm run build:test`: passed.
- `node --test dist/tests/graph/capabilities_indexer.test.js`: passed, 4 tests.
- `npm run smoke:capabilities`: passed.
- `npm run test`: passed, 413 tests.
- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `node dist/cli.js capability list --kind spec --json`: passed and exposed
  `spec_kind`.
- `git diff --check`: passed.

## Follow-ups

- `test-109` can now close against the dogfood SPEC metadata proof.
- `test-110` remains open for the public `mdkg spec ...` command surface and
  richer search/show validation.
