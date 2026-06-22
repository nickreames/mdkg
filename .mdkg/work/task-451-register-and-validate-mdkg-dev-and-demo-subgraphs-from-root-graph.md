---
tags: [mdkg-dev, subgraph, examples]
owners: []
links: []
artifacts: []
relates: [task-450, test-204]
blocked_by: [task-450]
blocks: [task-452, test-204]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [edd-24, edd-26, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: task-451
type: task
title: register and validate mdkg-dev and demo subgraphs from root graph
status: todo
priority: 1
parent: goal-25
epic: epic-125
---
# Overview

Register mdkg-dev and demo/example graphs as read-only planning subgraphs only after they exist and validate independently.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and task-450 creates valid nested graphs.
- Root graph registration uses root-qualified qids when referring across graph boundaries.
- Subgraphs are added only after each source graph validates cleanly.
- Root-owned bundles or subgraph snapshots are generated from clean accepted child graph states.
- Dirty child graph states are not synced with unsafe allow-dirty shortcuts.
- Subgraph materialization, if used, is ignored/read-only inspection output.
- Mutating commands against subgraph qids are not used.

# Files Affected

- `.mdkg` subgraph registration/bundle metadata.
- Nested example graph `.mdkg` files created by task-450.

# Implementation Notes

- Keep subgraphs as planning context, not a mechanism for root mutation of child work.
- Record demo/subgraph proof checkpoint before closing with task-450 evidence.

# Test Plan

- `mdkg subgraph add/list/verify` or current equivalent.
- `mdkg capability resolve` or search/show proof for root-qualified qids if applicable.
- `npm run smoke:demo-graph`
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-125
- context: edd-26
