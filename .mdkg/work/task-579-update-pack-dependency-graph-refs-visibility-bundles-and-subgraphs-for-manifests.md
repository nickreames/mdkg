---
id: task-579
type: task
title: update pack dependency graph refs visibility bundles and subgraphs for manifests
status: done
priority: 1
epic: epic-196
parent: goal-37
tags: [manifest, pack, graph-refs, bundles, subgraphs, visibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-pack-compatibility, manifest-graph-refs, manifest-bundle-subgraph-compatibility]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Update context transfer and graph movement so manifest records participate in
packs, refs, dependency traversal, bundles, subgraphs, and visibility checks
the same way valid SPEC records do today.

# Acceptance Criteria

- A work item referencing a canonical manifest packs `MANIFEST.md`.
- Existing work items referencing legacy `SPEC.md` still pack correctly.
- `mdkg graph refs` resolves inbound/outbound manifest and legacy spec refs.
- Bundle creation/import/subgraph projection preserves canonical and legacy
  manifest metadata.
- Public/internal/private visibility checks fail closed when manifest records
  reference incompatible private archive or subgraph records.

# Files Affected

- `tests/pack/pack.test.ts`
- `tests/commands/graph.test.ts`
- `.mdkg/index/mdkg.sqlite`

# Implementation Notes

- Do not special-case manifests only in pack output. The graph edge model must
  resolve aliases consistently before traversal.
- Treat materialized subgraph trees as generated read-only inspection state.
- Existing source traversal already handles canonical manifest and legacy spec
  records through normal graph edges. This task adds focused regression coverage
  plus bundle/subgraph/visibility smoke receipts.

# Results / Evidence

- Added pack coverage proving a work item related to `MANIFEST.md` includes the
  canonical manifest node and a work item related to `SPEC.md` still includes
  the legacy spec node.
- Added `mdkg graph refs` CLI coverage for inbound/outbound canonical manifest
  and legacy spec relationships.
- `node --test dist/tests/pack/pack.test.js`: 13 passing.
- `node --test dist/tests/commands/graph.test.js`: 6 passing.
- `node --test dist/tests/commands/archive_work.test.js`: 11 passing.
- `npm run smoke:bundle`: `bundle smoke passed`.
- `npm run smoke:subgraph`: `subgraph smoke passed`.
- `npm run smoke:visibility`: `visibility smoke passed`.
- Direct temp-repo CLI receipt:
  `node dist/cli.js pack work.pack-manifest --format json --out .mdkg/pack/manifest-work.json`
  produced a pack with `root:agent.pack-worker` at
  `.mdkg/work/agent.pack-worker-pack-worker/MANIFEST.md`.

# Test Plan

- `test-293`
- `npm run smoke:bundle`
- `npm run smoke:subgraph`
- `npm run smoke:visibility`
- `node dist/cli.js pack <manifest-linked-work-id> --format json`

# Links / Artifacts

- `edd-54`
- `task-276`
- `test-293`
