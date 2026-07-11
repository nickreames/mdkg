---
id: epic-223
type: epic
title: Pilot typed command descriptors for loop commands
status: todo
priority: 1
tags: [loop, cli, descriptor, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, prop-4, task-691, task-692, test-366]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Use the loop command family as the first typed descriptor pilot so command
routing, help, and contract metadata can share explicit command definitions.

# Scope

- Minimal descriptor model for loop commands.
- Descriptor-backed metadata for loop help and command contract generation.
- Preservation of existing public loop command behavior.

# Milestones

- `task-699`: introduce the loop descriptor pilot.
- `task-700`: use descriptors for generated command metadata.

# Out of Scope

- Migrating `work`, `db queue`, `subgraph`, `pack`, or `git`.
- A generalized command framework beyond what loop needs.

# Risks

- Over-abstracting command definitions.
- Breaking help or command-contract parity.

# Links / Artifacts

- `prop-4`
- `task-691`
- `task-692`
- `test-366`
