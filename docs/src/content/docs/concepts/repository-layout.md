---
title: Repository Layout
description: Common mdkg paths and which files are durable source.
---

Common mdkg paths:

| Path | Purpose | Commit? |
|---|---|---|
| `.mdkg/core/` | Rules and pinned project memory | yes |
| `.mdkg/design/` | PRDs, EDDs, decisions | yes |
| `.mdkg/work/` | Goals, tasks, tests, checkpoints | yes |
| `.mdkg/skills/` | Canonical skills | yes |
| `.mdkg/archive/` | Archive sidecars and deterministic caches | sidecars yes, raw source ignored |
| `.mdkg/index/` | Generated search/index cache | no |
| `.mdkg/pack/` | Generated context packs | no |
| `.mdkg/db/runtime/` | Optional local runtime DB | no |
| `.mdkg/db/schema/` | Project DB migrations and schema source | yes |
| `.mdkg/db/state/` | Opt-in sealed project DB state snapshots | review first |
| `.agents/skills/` | Agent-facing skill mirror | generated mirror |
| `.claude/skills/` | Claude-facing skill mirror | generated mirror |

## Durable source

Commit files that carry semantic project memory:

- `.mdkg/core/`
- `.mdkg/design/`
- `.mdkg/work/`
- `.mdkg/skills/`
- `.mdkg/db/schema/`
- archive sidecar Markdown and deterministic archive caches when the archive policy says so

## Rebuildable generated output

Do not treat generated access files as authority:

- `.mdkg/index/`
- `.mdkg/pack/`
- materialized subgraph inspection trees
- local build output such as `dist/`

Regenerate these from source when needed.

## Optional local project DB state

The project DB is local infrastructure, not canonical graph memory. Runtime files under `.mdkg/db/runtime/` should stay local. Schema migrations are source. Sealed DB state snapshots are opt-in review artifacts.

## Skill mirrors

`.mdkg/skills/` is canonical. Product-specific mirrors such as `.agents/skills/` and `.claude/skills/` are generated outputs for coding tools. Update canonical skills first, then sync mirrors.

When in doubt, run:

```bash
mdkg status
mdkg validate
```

Commit durable semantic state. Ignore rebuildable caches and local runtime state. If a generated file is intentionally committed, make sure the owning docs or release task says why.
