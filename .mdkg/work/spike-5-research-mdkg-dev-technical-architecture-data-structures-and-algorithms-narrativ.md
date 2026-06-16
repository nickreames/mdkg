---
id: spike-5
type: spike
title: research mdkg.dev technical architecture data structures and algorithms narrative
status: done
priority: 2
epic: epic-79
parent: goal-15
tags: [mdkg-dev, architecture, data-structures, algorithms, spike]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-15
updated: 2026-06-15
---
# Research Question

How should `mdkg.dev` explain mdkg's core data structures and algorithms so the
tool feels technically credible without overwhelming new users?

# Context And Constraints

- mdkg has several real technical systems: Markdown frontmatter graph nodes,
  deterministic indexes, context packs, skill mirrors, generated command
  contracts, local node:sqlite project DB queues/events/materializers, snapshots,
  visibility filtering, and subgraphs.
- Some systems are internal-only or deferred publicly. Docs must distinguish
  shipped public CLI from internal helper surfaces.
- This spike should produce narrative structure, not implementation.

# Search Plan

- Review README, command matrix, generated command contract, project DB
  migrations/helpers, and smoke coverage.
- Use Diataxis to separate conceptual explanations from operational guides and
  command reference.

# Findings

- mdkg's architecture can be explained as layered deterministic memory:
  Markdown graph source, generated indexes, command receipts, packs, optional
  project DB state, and archived/bundled projections.
- The graph model is the key user mental model: nodes have typed frontmatter,
  edges are explicit refs, and commands select/pack/mutate nodes through stable
  IDs.
- The algorithmic credibility comes from deterministic traversal, pack budgets,
  validation, visibility filtering, dry-run planning, SQLite migrations, queue
  leasing, snapshot hash/CAS, and generated command contract hashes.
- Docs should avoid presenting every internal structure at once. Start with
  "what file is canonical?" and "what command proves it?"

# Options And Tradeoffs

- Full architecture reference: precise but intimidating.
- Concept snippets embedded in guides: approachable but fragmented.
- Layered architecture path: best fit. Put short concept blocks in guides and
  maintain a deeper technical reference.

# Recommendation

Publish a "How mdkg works" concept path:

1. Graph nodes: Markdown plus typed frontmatter.
2. Edges and IDs: stable refs, qids, scope, blockers, and visibility.
3. Indexes and caches: generated review aids, not canonical state.
4. Packs: deterministic context extraction with budgets and profiles.
5. Skills and SPEC/WORK: reusable capability mirrors and invocation records.
6. Project DB: optional local delivery/state layer with queues and snapshots.
7. Subgraphs: read-only child graph snapshots and materialized inspection.

Every section should link to the command reference and at least one validated
example.

# Follow-Up Nodes To Create

- `task-356`: include a "How mdkg works" guide as an outcome guide, not only
  reference prose.
- `task-358`: share the state-boundary table between architecture and trust docs.
- `task-371`: design architecture and state-boundary visuals without starting
  website implementation.
- `test-157`: require technical architecture claims to link to source or smoke
  evidence.

# Skill Candidates

- Technical architecture narrative skill for turning graph/data-structure
  implementation into user-facing conceptual docs.
- Command-proof linking skill for connecting architecture claims to commands,
  tests, and smoke scripts.

# Data Structures And Algorithms Notes

- Core data structures to document: `Node`, edge map, qid, generated index,
  command contract command metadata, pack node ordering, project queue message,
  project event, receipt artifact, writer lease, sealed snapshot manifest.
- Core algorithms to document: frontmatter parse/validate, next selection,
  recursive goal scope traversal, pack graph traversal/order/budgeting, dry-run
  fix planning, queue claim/lease/ack/fail, snapshot seal/verify/diff,
  subgraph sync/materialize, visibility filtering.

# UX Notes

- Use progressive disclosure: quick mental model first, architecture reference
  second, code-level details last.
- Diagrams should show canonical versus generated state clearly.

# Security Notes

- Architecture docs must clearly label ignored runtime DB files and generated
  caches.
- Public docs should not describe internal helpers as public CLI.

# mdkg.dev Launch Implications

- A credible launch needs at least one technical architecture guide because mdkg
  asks users to trust a local project-memory model.
- Architecture docs should be source-backed and smoke-backed, not aspirational.

# Evidence And Sources

- Local evidence: `src/graph/node.ts`, `src/graph/goal_scope.ts`,
  `src/pack/order.ts`, `src/core/project_db_queue.ts`,
  `src/core/project_db_snapshot.ts`, `src/commands/fix.ts`,
  `dist/command-contract.json`.
- Diataxis documentation framework: https://diataxis.fr/
