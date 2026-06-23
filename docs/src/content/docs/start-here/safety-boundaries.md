---
title: Safety Boundaries
description: What mdkg does and does not do.
---

Markdown Knowledge Graph is durable semantic memory, not an execution runtime.

## What mdkg does

- Stores graph state in Markdown and frontmatter.
- Builds deterministic context packs.
- Records goals, tasks, spikes, checkpoints, decisions, and evidence refs.
- Creates bounded handoffs for humans and agents.
- Validates graph state and generated caches.

## What mdkg does not do

- It does not execute agent work automatically.
- It does not execute skill scripts.
- It is not a hosted memory service.
- It is not a vector database.
- It is not a comprehensive secret scanner or DLP product.
- It does not make queue state canonical runtime history.

## Advanced alpha boundaries

- MCP is read-only.
- Subgraphs are read-only planning context.
- Mutating commands reject subgraph qids.
- Visibility filtering is metadata enforcement, not arbitrary body redaction.
- Handoff raw-marker warnings are safety aids, not comprehensive scanning.
- Internal project DB events, reducers, leases, and materializers are not public CLI surfaces.
