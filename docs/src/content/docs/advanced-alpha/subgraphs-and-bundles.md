---
title: Subgraphs And Bundles
description: Use root-qualified graph context without mutating child repositories.
---

Subgraphs let a parent mdkg graph reason about child graphs without pretending to own them.

Bundles are generated projections of child graph state. They are useful for orchestration, reporting, and planning across repositories. Replace `CHILD_ALIAS` with the configured subgraph alias from `mdkg subgraph list --json`.

```bash
mdkg subgraph list --json
mdkg subgraph audit --json
mdkg subgraph sync CHILD_ALIAS --json
mdkg bundle verify --json
```

## Ownership model

- The child repository owns its `.mdkg` graph.
- The root repository owns its subgraph bundle copy.
- Root-qualified qids avoid id collisions, for example `runtime:goal-27`.
- Root orchestration should not mutate dirty child repositories.

The safe sequence is:

1. Gather read-only baselines in each repo.
2. Apply or commit approved child mdkg-only changes in the child repo.
3. Confirm the child repo is clean.
4. Sync the root-owned bundle from that accepted child commit.
5. Validate the root graph.

## Dirty child repos

If a child repo is dirty, pause and decide whether those changes are approved. Avoid using dirty-source overrides as a default. A stale bundle is easier to reason about than a root graph that captured unreviewed child state.

## What to check

```bash
git status --short --branch
mdkg subgraph audit --json
mdkg subgraph verify --json
mdkg validate --summary --json --limit 20
```

Use subgraph warnings as routing context. A read-only subgraph node can block local work, but it is not locally actionable unless you switch into the owning repo.
