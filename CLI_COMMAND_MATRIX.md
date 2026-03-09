# CLI Command Matrix

as_of: 2026-03-05
source: current CLI surface in `src/cli.ts`, manual audit findings, and `edd-9`

## Primary commands

| Command | Primary audience | Why it stays visible | Current simplification stance |
| --- | --- | --- | --- |
| `init` | human + agent | bootstrap the repo | keep `--llm` primary, `--omni` optional |
| `new` | human | capture work and docs | keep broad capability, shorten visible help |
| `search` | human + agent | discover current truth | keep visible |
| `show` | human + agent | inspect exact truth | default full body, `--meta` for compact view |
| `next` | human + agent | choose the next work item | keep visible |
| `pack` | agent + human | deterministic handoff primitive | keep central, shorten visible help, add `--profile` |
| `validate` | human + agent | trust gate | keep stable |

## Advanced / maintenance commands

| Command | Why it remains | Why it is de-emphasized |
| --- | --- | --- |
| `checkpoint` | milestone compression and provenance | not part of first-run loop |
| `index` | explicit cache rebuild | auto-reindex reduces first-run need |
| `guide` | repo operating guide | secondary to `show` and `pack` |
| `format` | normalization | maintenance command |
| `doctor` | install / diagnostics | troubleshooting only |
| `workspace` | multi-workspace admin | advanced repo administration |

## Flag simplification decisions in this pass

### Init
- documented primary flags: `--llm`, `--omni`, `--force`, `--no-update-ignores`, explicit ignore update flags
- compatibility flags kept but hidden from primary help: `--agents`, `--claude`

### Show
- default: full body content
- compact mode: `--meta`
- compatibility-only hidden flag: `--body`

### Pack
- documented primary flags: `--profile`, `--verbose`, `--format`, `--out`, `--skills`, `--skills-depth`, `--dry-run`, `--stats`, `--list-profiles`
- advanced shaping / debug flags remain supported but de-emphasized: `--depth`, `--edges`, `--strip-code`, `--max-code-lines`, `--max-chars`, `--max-lines`, `--max-tokens`, `--truncation-report`, `--stats-out`
- compatibility alias added: `--profile` -> `--pack-profile`

### Global flags
- documented primary globals: `--root`, `--help`, `--version`
- cache/debug flags remain supported but hidden from primary help: `--no-cache`, `--no-reindex`

## Deferred decisions

- whether to remove any top-level command entirely
- whether to remove hidden compatibility flags or keep them indefinitely
- whether `pack` default profile should change in v0.5
