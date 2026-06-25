---
title: Advanced Alpha Overview
description: Larger workflow surfaces that are useful but not part of the first-run path.
---

Advanced alpha surfaces are useful for larger agentic workflows, but they are not the first-run path. Start here when the basic Plan -> Work -> Evidence loop is already working in a small repository and you need stronger coordination or local state.

## Use when

- [Demo graphs](/advanced-alpha/demo-graphs/): use a deterministic sample graph to understand goal routing, packs, and evidence before applying mdkg to a larger repo.
- [Subgraphs and bundles](/advanced-alpha/subgraphs-and-bundles/): inspect sibling or child repo graph state from a parent repo without editing the child graph.
- [Graph movement](/advanced-alpha/graph-movement/): clone, fork, import, or repair graph state while preserving links and ownership boundaries.
- [Project DB and queues](/advanced-alpha/project-db-queues/): add local queue delivery state or project DB checks without turning mdkg into hosted runtime storage.
- [Read-only MCP](/advanced-alpha/read-only-mcp/): expose mdkg graph reads to a local MCP client while keeping mutation in the CLI.

## How to choose

Start with the lowest-risk surface:

1. Use demo graphs when you need to learn the workflow without touching an existing repo.
2. Use subgraphs when you need cross-repo visibility but not cross-repo mutation.
3. Use graph movement only when you need to clone, import, or repair graph structure.
4. Use project DB queues only when local delivery state is part of the repo workflow.
5. Use MCP only when another local tool needs read-only graph access.

## Do not use when

- You only need first-run setup. Use [Install](/start-here/install/) and [Quickstart](/start-here/quickstart/) instead.
- You need a hosted queue, worker runner, analytics backend, or canonical product database. mdkg stays local and git-native.
- You need to store raw prompts, provider payloads, credentials, or bulky runtime traces. Keep those outside mdkg graph state.

Use these surfaces only after `mdkg init --agent`, `mdkg index`, `mdkg validate`, and the basic Plan -> Work -> Evidence loop are comfortable in a small repository.

## Common mistakes

- Using advanced alpha commands to skip the first-run setup. Get `status`, `validate`, and one pack working first.
- Treating queue rows as canonical product history. Queue state is local delivery state.
- Refreshing subgraph bundles from dirty child repos. Commit accepted child changes first.
- Treating MCP as a mutation API. The public MCP surface is read-only in the current alpha.
