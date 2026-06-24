---
title: Advanced Alpha Overview
description: Larger workflow surfaces that are useful but not part of the first-run path.
---

Advanced alpha surfaces are useful for larger agentic workflows, but they are not the first-run path. Start here when the basic Plan -> Work -> Evidence loop is already working in a small repository and you need stronger coordination or local state.

## Use when

- [Project DB and queues](/advanced-alpha/project-db-queues/): add local queue delivery state or project DB checks without turning mdkg into hosted runtime storage.
- [Read-only MCP](/advanced-alpha/read-only-mcp/): expose mdkg graph reads to a local MCP client while keeping mutation in the CLI.
- [Subgraphs and bundles](/advanced-alpha/subgraphs-and-bundles/): inspect sibling or child repo graph state from a parent repo without editing the child graph.
- [Graph movement](/advanced-alpha/graph-movement/): clone, fork, import, or repair graph state while preserving links and ownership boundaries.
- [Demo graphs](/advanced-alpha/demo-graphs/): use a deterministic sample graph to understand goal routing, packs, and evidence before applying mdkg to a larger repo.

## Do not use when

- You only need first-run setup. Use [Install](/start-here/install/) and [Quickstart](/start-here/quickstart/) instead.
- You need a hosted queue, worker runner, analytics backend, or canonical product database. mdkg stays local and git-native.
- You need to store raw prompts, provider payloads, credentials, or bulky runtime traces. Keep those outside mdkg graph state.

Use these surfaces only after `mdkg init --agent`, `mdkg index`, `mdkg validate`, and the basic Plan -> Work -> Evidence loop are comfortable in a small repository.
