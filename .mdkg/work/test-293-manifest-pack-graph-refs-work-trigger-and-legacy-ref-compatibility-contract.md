---
id: test-293
type: test
title: manifest pack graph refs work trigger and legacy ref compatibility contract
status: done
priority: 1
epic: epic-196
parent: goal-37
tags: [manifest, pack, graph-refs, work-trigger, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-577, task-579]
context_refs: []
evidence_refs: []
aliases: [manifest-pack-work-trigger-contract, legacy-spec-ref-pack-contract]
skills: []
cases: [pack-manifest, pack-legacy-spec, work-trigger-manifest, work-trigger-spec, graph-refs-manifest]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Prove context transfer and work invocation references continue working for
canonical manifests and legacy specs.

# Target / Scope

- `task-577`
- `task-579`

# Preconditions / Environment

Fixture graph contains work linked to a canonical manifest and work linked to a
legacy spec.

# Test Cases

- `mdkg pack` includes canonical `MANIFEST.md` when a work item references it.
- `mdkg pack` still includes legacy `SPEC.md` for existing references.
- `mdkg graph refs` reports manifest and legacy spec relationships.
- `mdkg work trigger` accepts canonical manifest refs with exactly one work
  contract.
- `mdkg work trigger` still accepts legacy spec refs during compatibility.
- Bundle/subgraph/visibility smokes do not regress.

# Results / Evidence

- PASS: `node --test dist/tests/pack/pack.test.js` verifies canonical
  `MANIFEST.md` and legacy `SPEC.md` records are included through pack
  traversal from related work nodes.
- PASS: `node --test dist/tests/commands/graph.test.js` verifies
  `mdkg graph refs` reports inbound/outbound relationships for canonical
  manifests and legacy specs.
- PASS: `node --test dist/tests/commands/archive_work.test.js` verifies direct
  work triggers, canonical manifest triggers, legacy spec triggers, and
  manifest-first missing/ambiguous contract errors.
- PASS: `npm run smoke:bundle`, `npm run smoke:subgraph`, and
  `npm run smoke:visibility`.
- PASS: direct temp-repo `mdkg pack work.pack-manifest --format json --out ...`
  receipt contained the canonical `MANIFEST.md` node.

# Notes / Follow-ups

- Keep non-manifest workflow files unchanged.
