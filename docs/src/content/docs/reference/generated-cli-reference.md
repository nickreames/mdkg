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

## Git lifecycle commands

Use `mdkg git` when an agent run needs low-level Git lifecycle receipts around a
repo-backed mdkg checkpoint. The command family uses the system Git CLI;
authentication stays external through SSH, credential helpers, `gh`, CI/runtime
environment, or existing shell state. mdkg records sanitized refs, hashes,
policy names, and receipts rather than credentials or provider payloads.

- `mdkg git inspect --json` reports the current repo, remotes, working-tree
  state, source descriptor, accepted commit, and tree hash.
- `mdkg git clone <repository-ref> --target <path> --branch <name> --json`
  clones a real Git remote into an explicit contained target.
- `mdkg git fetch --remote origin --branch main --json` fetches an explicit
  remote and branch through system Git.
- `mdkg git closeout --json` validates mdkg state and writes static JSON and
  Markdown closeout receipts. When project DB state participated, closeout also
  seals SQLite snapshot evidence and writes a deterministic dump.
- `mdkg git push-ready --remote origin --branch main --json` is read-only and
  requires explicit remote/branch, a clean worktree, passing mdkg validation,
  credential-safe remote configuration, and required DB snapshot evidence.
- `mdkg git push --remote origin --branch main --stage-all --message "agent checkpoint" --json`
  writes closeout evidence, stages changes, commits, reruns push readiness, and
  pushes only after the caller or runtime has approved the real remote update.

## Advanced alpha commands

The CLI also includes advanced graph, archive, bundle, subgraph, project DB queue, MCP, workflow mirror, and graph movement commands. Treat those surfaces as public alpha and validate them in your repo before depending on them.

Use these docs next:

- [Read-only MCP](/advanced-alpha/read-only-mcp/)
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
