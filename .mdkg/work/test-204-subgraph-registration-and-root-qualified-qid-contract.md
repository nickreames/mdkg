---
tags: [mdkg-dev, contract, subgraph]
owners: []
links: []
artifacts: []
relates: [task-451, test-203]
blocked_by: [task-451]
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [edd-24, edd-26, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: test-204
type: test
title: subgraph registration and root-qualified qid contract
status: todo
priority: 1
parent: goal-25
epic: epic-125
---
# Overview

Validate mdkg-dev/demo subgraph registration from the root graph.

# Acceptance Criteria

- Nested mdkg-dev/demo graphs validate before subgraph registration.
- Root subgraph references use root-qualified qids where needed and do not rely on overlapping unqualified IDs.
- Subgraph sync or bundle refresh runs only from clean accepted nested graph states.
- Materialized subgraph trees, if used, are read-only/ignored inspection output.
- Root planning can search/show/pack read-only subgraph context without mutating child graphs.

# Test Plan

- `mdkg subgraph list/verify` or current equivalent.
- `npm run smoke:demo-graph`
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-125
