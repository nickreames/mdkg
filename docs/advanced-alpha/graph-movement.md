---
title: Graph Movement
description: Clone, fork, import, and repair mdkg graph state with explicit id policy.
---

Graph movement commands support reusable planning templates and multi-repo demos.

They are powerful enough to change graph shape, so treat them as planned operations with receipts.

Common surfaces include:

```bash
mdkg graph clone --help
mdkg graph fork --help
mdkg graph import-template --help
mdkg fix ids --help
```

## Id policy

- Preserve ids when moving a graph into a separate repository.
- Rewrite ids when importing a template into the same graph.
- Preserve links during rewrite.
- Prefer explicit `--dry-run` receipts before `--apply`.

## Selected goal policy

When importing a template that should become active work, use an explicit start goal.

```bash
mdkg graph import-template ./template --start-goal goal-1 --select-goal --dry-run --json
mdkg graph import-template ./template --start-goal goal-1 --select-goal --apply --json
```

The selected imported goal should activate cleanly and competing local active root goals should pause. Import should not leave multiple active root goals.

## Branch repair

When separate branches create the same numeric ids, repair should keep the main-branch ids stable and rewrite the incoming ids with link preservation.

Use repair planning before apply:

```bash
mdkg fix plan --json
mdkg fix ids --base-ref main --dry-run --json
mdkg fix ids --base-ref main --apply --json
```

Do not use graph movement commands to bypass review. Validate after every apply.
