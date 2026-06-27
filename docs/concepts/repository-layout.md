# Repository Layout

Common mdkg paths:

| Path | Purpose | Commit? |
|---|---|---|
| `.mdkg/core/` | Rules and pinned project memory | yes |
| `.mdkg/design/` | PRDs, EDDs, decisions | yes |
| `.mdkg/work/` | Goals, tasks, tests, checkpoints | yes |
| `.mdkg/skills/` | Canonical skills | yes |
| `.mdkg/config.json` | Local overlays and configured skill mirror targets | yes when repo-owned |
| `.mdkg/archive/` | Archive sidecars and deterministic caches | sidecars yes, raw source ignored |
| `.mdkg/index/` | Generated search/index cache | no |
| `.mdkg/pack/` | Generated context packs | no |
| `.mdkg/db/runtime/` | Optional local runtime DB | no |
| `.mdkg/db/schema/` | Project DB migrations and schema source | yes |
| `.mdkg/db/state/` | Opt-in sealed project DB state snapshots | review first |
| `.agents/skills/` | Agent-facing skill mirror | generated mirror |
| `.claude/skills/` | Claude-facing skill mirror | generated mirror |
| configured skill mirror paths | Additional contained mirrors from `.mdkg/config.json` | generated mirror |

`.mdkg/skills/` is canonical. Default product mirrors live under
`.agents/skills/` and `.claude/skills/`, and repos can add arbitrary contained
mirror paths through `.mdkg/config.json`. These arbitrary contained mirror paths
stay generated from canonical skills.

`COLLABORATION.md` is the canonical operator profile. `HUMAN.md` remains a
one-release legacy alias for older prompts.

`MANIFEST.md` is the canonical reusable capability file. `SPEC.md` remains a
one-release compatibility alias; new docs, skills, and examples should use
`MANIFEST.md` and `mdkg manifest ...`.

When in doubt, run:

```bash
mdkg status
mdkg validate
```

Commit durable semantic state. Ignore rebuildable caches and local runtime state. If a generated file is intentionally committed, make sure the owning docs or release task says why.
