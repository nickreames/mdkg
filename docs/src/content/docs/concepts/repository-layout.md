---
title: Repository Layout
description: Common mdkg paths and which files are durable source.
---

Common mdkg paths fall into four groups. Commit durable semantic source, review opt-in evidence, and keep generated or local runtime files out of normal source commits.

## Commit as durable source

`.mdkg/core/`
: Rules and pinned project memory.

`.mdkg/design/`
: PRDs, EDDs, decisions, and architecture notes.

`.mdkg/work/`
: Goals, epics, tasks, tests, spikes, checkpoints, and closeout evidence.

`.mdkg/skills/`
: Canonical skill definitions. Tool-specific mirrors are generated from here.

`.mdkg/config.json`
: Local workspace configuration, including customization overlays and configured
skill mirror targets. Commit it when the repo intentionally owns those
standards.

`.mdkg/db/schema/`
: Project DB migrations and schema source.

## Review before committing

`.mdkg/archive/`
: Archive sidecar Markdown and deterministic archive caches can be committed when the archive policy says so. Keep raw private source bundles out of public exports.

`.mdkg/db/state/`
: Opt-in sealed project DB state snapshots. Review queue policy, visibility, and snapshot contents before committing.

`.agents/skills/`
: Agent-facing skill mirror. Commit only when this repo intentionally tracks the generated mirror.

`.claude/skills/`
: Claude-facing skill mirror. Commit only when this repo intentionally tracks the generated mirror.

Configured skill mirror paths
: Additional contained mirror targets declared in `.mdkg/config.json`. Treat
them as generated outputs unless the repo explicitly tracks them.

## Keep local or rebuildable

`.mdkg/index/`
: Generated search, capability, skill, subgraph, and SQLite index cache. Rebuild it with `mdkg index`.

`.mdkg/pack/`
: Generated context packs. Recreate them with `mdkg pack`.

`.mdkg/db/runtime/`
: Optional local project DB runtime files. They are local infrastructure, not canonical graph memory.

## Durable source

Commit files that carry semantic project memory:

- `.mdkg/core/`
- `.mdkg/design/`
- `.mdkg/work/`
- `.mdkg/skills/`
- `.mdkg/config.json`
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

`.mdkg/skills/` is canonical. Product-specific mirrors such as `.agents/skills/`
and `.claude/skills/` are defaults, and repos can add arbitrary contained mirror
paths through `.mdkg/config.json`. These arbitrary contained mirror paths stay
generated from canonical skills. Update canonical skills first, then sync
mirrors.

## Collaboration and capability naming

`COLLABORATION.md` is the canonical operator profile. `HUMAN.md` remains a
one-release legacy alias for older prompts and should fade out as repos upgrade.

`MANIFEST.md` is the canonical reusable capability file. `SPEC.md` remains a
one-release compatibility alias; new docs, skills, and examples should use
`MANIFEST.md` and `mdkg manifest ...`.

When in doubt, run:

```bash
mdkg status
mdkg validate
```

Commit durable semantic state. Ignore rebuildable caches and local runtime state. If a generated file is intentionally committed, make sure the owning docs or release task says why.
