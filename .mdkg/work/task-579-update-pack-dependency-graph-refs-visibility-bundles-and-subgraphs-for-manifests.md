---
id: task-579
type: task
title: update pack dependency graph refs visibility bundles and subgraphs for manifests
status: todo
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
updated: 2026-06-25
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

- `src/pack/**`
- `src/graph/**`
- `src/commands/graph.ts`
- `src/commands/bundle.ts`
- `src/commands/subgraph.ts`
- `tests/commands/pack.test.ts`
- bundle/subgraph/visibility smoke tests

# Implementation Notes

- Do not special-case manifests only in pack output. The graph edge model must
  resolve aliases consistently before traversal.
- Treat materialized subgraph trees as generated read-only inspection state.

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
