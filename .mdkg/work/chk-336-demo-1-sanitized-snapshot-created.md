---
id: chk-336
type: checkpoint
title: demo 1 sanitized snapshot created
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-629]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-629]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

Demo 1 now has a bounded, sanitized data snapshot for public route rendering.
The snapshot represents the mdkg graph, selected read-only file excerpts, safety
notes, and output metadata without raw execution traces or secrets.

# Scope Covered

- `task-629`
- `goal-44`

## Changed Surfaces

- `mdkg-dev/src/data/demoSnapshots.ts`
- `mdkg-dev/public/demo-001/ocean-flow-map.svg`
- mdkg task/checkpoint state

## Boundaries

- in scope: sanitized Demo 1 graph/files/output snapshot
- out of scope: provider payloads, raw prompts, deployment records, live URLs
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Snapshot content follows `edd-60`: graph, selected filesystem, and output
  preview surfaces are represented separately.
- Heavy interactive viewer behavior remains deferred by `edd-61`.

# Implementation Summary

Created a typed Astro data source that can be rendered statically and reused by
the demo index, detail, and output pages. The SVG output artifact is copied into
public assets so the route can be built and validated without remote fetches.

# Implementation Details

- Code or graph surfaces changed: new data module and public Demo 1 SVG.
- Architecture or data-shape notes: snapshot is intentionally small and
  committed, not a live filesystem mount.
- Compatibility notes: route data can expand to additional accepted demos later.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js task done task-629 --checkpoint ... --json`
- result: checkpoint `chk-336` created after attaching the snapshot artifacts.
- command: `rg -n "NPM_TOKEN|_authToken|BEGIN .*PRIVATE|password|secret|api[_-]?key|bypass|cookie|provider payload|raw prompt" mdkg-dev/src mdkg-dev/public/demo-001`
- result: only benign public-safety wording appeared; no credentials or tokens.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: the no-secret command intentionally matches explanatory safety text

# Known Issues / Follow-ups

- Route rendering still needed to be implemented in `task-630`.
- Browser/Chrome visual proof still needed to be collected in downstream tests.

## Follow-up Refs

- `task-630`
- `test-324`
- `test-329`

# Links / Artifacts

- `mdkg-dev/src/data/demoSnapshots.ts`
- `mdkg-dev/public/demo-001/ocean-flow-map.svg`

# Raw Content Safety

- Snapshot text is bounded and public-facing; no raw prompts, provider payloads,
  environment values, credentials, or bulky traces are included.
