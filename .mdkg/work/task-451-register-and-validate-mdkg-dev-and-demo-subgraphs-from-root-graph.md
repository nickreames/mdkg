---
id: task-451
type: task
title: register and validate mdkg-dev and demo subgraphs from root graph
status: done
priority: 1
epic: epic-125
parent: goal-25
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

# Implementation Summary

- Created private root-owned bundle snapshots for `examples/demo-agentic-coding` and `examples/template-mdkg-dev`.
- Registered private read-only subgraphs:
  - `demo_agentic_coding`
  - `template_mdkg_dev`
- Verified `mdkg subgraph verify --all --json` returns `ok: true`.
- Proved root-qualified qids with `mdkg show demo_agentic_coding:goal-1 --json` and `mdkg show template_mdkg_dev:goal-1 --json`.
- Avoided `subgraph sync --allow-dirty`; these are explicit snapshot bundles for in-repo examples, not dirty child-repo refreshes.

# Test Plan

- `mdkg subgraph add/list/verify` or current equivalent.
- `mdkg capability resolve` or search/show proof for root-qualified qids if applicable.
- `npm run smoke:demo-graph`
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- checkpoint: chk-191
- bundle: .mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip
- bundle: .mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip
- parent: goal-25
- epic: epic-125
- context: edd-26
