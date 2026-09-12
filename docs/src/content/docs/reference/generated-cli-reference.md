---
title: CLI Reference
description: Useful mdkg command families for the public alpha.
---

This page is the readable entrypoint for the commands most users should learn first. For complete live behavior, run `mdkg --help` and command-specific help in your installed version.

## Core commands

- `mdkg init --agent` initializes repo-local project memory for human and agent workflows.
- `mdkg index` rebuilds local search and capability caches.
- `mdkg status` inspects repo, package, graph, selected-goal, cache, and project DB health.
- `mdkg new` creates graph nodes and workflow files.
- `mdkg show` inspects a node.
- `mdkg search` finds graph nodes.
- `mdkg goal` manages long-running objectives and active work routing.
- `mdkg task` starts, updates, and completes task-like work nodes.
- `mdkg pack` builds deterministic context for a work node.
- `mdkg handoff create` creates copy-ready agent handoffs.
- `mdkg validate` validates graph integrity and warning categories.
- `mdkg skill` manages repo-local agent skills and mirrors.
- `mdkg fix` plans and applies selected repairs, including ID repair.

## Native Git and revision inspection

Use `mdkg git inspect --json` to observe local repository state, sanitized
remote descriptors and accepted-revision hashes. It does not contact remotes,
probe authentication, or update the Git index. These hashes are local evidence,
not remote acceptance or execution proof.

Use native Git for branches, worktrees, clone/fetch, commits, merges and push;
authentication stays external. mdkg graph reconciliation and optional DB
snapshots remain explicit separate operations, never implicit Git orchestration.
The 0.6.0 candidate removes all former Git mutation/lifecycle wrappers without
aliases. See [Native Git and mdkg](/advanced-alpha/git-materialization/).

## Advanced alpha commands

The CLI also includes advanced graph, archive, bundle, subgraph, project DB queue, MCP, workflow mirror, and graph movement commands. Treat those surfaces as public alpha and validate them in your repo before depending on them.

Use these docs next:

- [Read-only MCP](/advanced-alpha/read-only-mcp/)
- [Native Git and mdkg](/advanced-alpha/git-materialization/)
- [Subgraphs and bundles](/advanced-alpha/subgraphs-and-bundles/)
- [Graph movement](/advanced-alpha/graph-movement/)
- [Demo graphs](/advanced-alpha/demo-graphs/)
- [Project DB and queues](/advanced-alpha/project-db-queues/)

Maintainers can refresh this reference from the command contract with:

```bash
npm run docs:generate
npm run docs:check
```

For integration metadata, see `dist/command-contract.json` in the mdkg repository.
