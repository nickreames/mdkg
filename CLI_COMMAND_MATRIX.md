# CLI Command Matrix

as_of: 2026-03-11
package_version_in_source: 0.0.6
source: live help from `src/cli.ts`, runtime command handlers, and `dec-15`..`dec-18`
status: canonical single-source command and flag reference for mdkg

## Purpose

This file is the one place humans and LLMs should check for the live mdkg command surface.

Verification commands:
- `npm run cli:snapshot`
- `npm run cli:check`

## Teaching model

Primary commands:
- `init`
- `new`
- `show`
- `list`
- `search`
- `pack`
- `skill`
- `task`
- `next`
- `validate`

Advanced / maintenance commands:
- `event`
- `checkpoint`
- `index`
- `guide`
- `format`
- `doctor`
- `workspace`

Skills are first-class and are accessed only through `mdkg skill ...`.
Generic `list/show/search` do not expose skills.

## Global usage

Usage:
- `mdkg <command> [options]`

Global flags:
- `--root`, `-r <path>`
- `--help`, `-h`
- `--version`, `-V`

Hidden but supported runtime flags used by selected commands:
- `--no-cache`
- `--no-reindex`

## Primary commands

### `mdkg init`

When to use:
- bootstrap a repo with mdkg
- optionally add agent-ready scaffolding

Usage:
- `mdkg init [options]`

Flags:
- `--force`
- `--llm`
- `--agent`
- `--no-update-ignores`
- `--update-gitignore`
- `--update-npmignore`
- `--update-dockerignore`

Compatibility flags still supported but not part of the primary story:
- `--agents`
- `--claude`

Notes:
- `--agent` is independent from `--llm`
- `--llm --agent` is the full AI-agent bootstrap path
- published bootstrap config is root-only by default
- `--agent` seeds three default mdkg usage skills into canonical `.mdkg/skills/`, updates the registry, creates `events.jsonl`, and syncs non-empty mirrors

### `mdkg new`

When to use:
- create a new node in the mdkg graph
- optionally emit a baseline event when event logging is enabled

Usage:
- `mdkg new <type> "<title>" [options]`

Types:
- `rule`
- `prd`
- `edd`
- `dec`
- `prop`
- `epic`
- `feat`
- `task`
- `bug`
- `checkpoint`
- `test`

Primary flags:
- `--ws <alias>`
- `--status <status>`
- `--priority <0..9>`
- `--epic <id>`
- `--tags <tag,tag,...>`
- `--skills <slug,slug,...>`
- `--template <set>`
- `--run-id <id>`

Advanced metadata flags:
- `--parent <id>`
- `--prev <id>`
- `--next <id>`
- `--relates <id,id,...>`
- `--blocked-by <id,id,...>`
- `--blocks <id,id,...>`
- `--links <value,value,...>`
- `--artifacts <value,value,...>`
- `--refs <value,value,...>`
- `--aliases <value,value,...>`
- `--owners <value,value,...>`
- `--cases <value,value,...>`
- `--supersedes <id,id,...>`

### `mdkg show`

When to use:
- inspect one mdkg node exactly
- use `mdkg skill show <slug>` for skills

Usage:
- `mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]`

Flags:
- `--ws <alias>`
- `--meta`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- default behavior prints full body content
- `--meta` omits the body
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `show` envelope shape

Removed surface:
- `mdkg show skill:<slug>`

### `mdkg list`

When to use:
- list mdkg nodes with deterministic filters
- use `mdkg skill list` for skills

Usage:
- `mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]`
- `           [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--type <type>`
- `--status <status>`
- `--ws <alias>`
- `--epic <id>`
- `--priority <n>`
- `--blocked`
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `list` envelope shape

Removed surface:
- `mdkg list --type skill`

### `mdkg search`

When to use:
- search node metadata and linked identifiers
- use `mdkg skill search` for skills

Usage:
- `mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]`
- `               [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--type <type>`
- `--status <status>`
- `--ws <alias>`
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- search returns nodes only
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `search` envelope shape

Removed surfaces:
- `mdkg search --type skill`
- generic `mdkg search` returning skills

### `mdkg pack`

When to use:
- build the deterministic handoff context for humans and agents

Usage:
- `mdkg pack <id-or-qid> [options]`
- `mdkg pack --list-profiles`

Primary flags:
- `--ws <alias>` / `-w`
- `--verbose` / `-v`
- `--format <fmt>` / `-f`
- `--out <path>` / `-o`
- `--profile <name>`
- `--skills <mode>`
- `--skills-depth <mode>`
- `--dry-run`
- `--stats`
- `--list-profiles`

Advanced flags:
- `--depth <n>`
- `--edges <edge,edge,...>`
- `--strip-code`
- `--max-code-lines <n>`
- `--max-chars <n>`
- `--max-lines <n>`
- `--max-tokens <n>`
- `--truncation-report <path>`
- `--stats-out <path>`

Allowed formats:
- `md`
- `json`
- `toon`
- `xml`

Profiles:
- `standard`
- `concise`
- `headers`

Compatibility alias still supported:
- `--pack-profile`

### `mdkg skill`

When to use:
- create, discover, inspect, and validate skills
- orchestrators should use this namespace for stage-tagged skill lookup

#### `mdkg skill new`

Usage:
- `mdkg skill new <slug> "<name>" --description "<description>" [options]`

Flags:
- `--description <text>`
- `--tags <tag,tag,...>`
- `--authors <name,name,...>`
- `--links <url,url,...>`
- `--run-id <id>`
- `--with-scripts`
- `--force`

#### `mdkg skill sync`

Usage:
- `mdkg skill sync [--force]`

Flags:
- `--force`

Notes:
- syncs canonical `.mdkg/skills/` into `.agents/skills/` and `.claude/skills/`
- preserves unrelated existing folders
- same-slug collisions fail unless forced

Scaffold behavior:
- writes `.mdkg/skills/<slug>/SKILL.md`
- creates `references/`
- creates `assets/`
- creates `scripts/` only with `--with-scripts`
- updates `.mdkg/skills/registry.md`

#### `mdkg skill list`

Usage:
- `mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `list` envelope shape
- preferred orchestrator lookup pattern: `mdkg skill list --tags stage:plan --json`

#### `mdkg skill show`

Usage:
- `mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]`

Flags:
- `--meta`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- default behavior prints full skill body
- `--meta` omits the body
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `show` envelope shape

#### `mdkg skill search`

Usage:
- `mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `search` envelope shape
- preferred orchestrator lookup pattern: `mdkg skill search "checkpoint" --tags stage:review --json`

#### `mdkg skill validate`

Usage:
- `mdkg skill validate [<slug>]`

Notes:
- validates all skills when no slug is passed
- validates one skill when a slug is passed
- reuses the repo skill validation rules

### `mdkg task`

When to use:
- mutate structured task-like fields and capture routine lifecycle evidence
- keep narrative/body edits and manual parent summaries in markdown
- optionally append baseline task events when event logging is enabled

Usage:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"]`
- `mdkg task update <id-or-qid> [options]`
- `mdkg task done <id-or-qid> [--checkpoint "<title>"] [options]`

#### `mdkg task start`

Usage:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"]`

Behavior:
- supports `task`, `bug`, and `test` only
- sets `status: progress`
- if `events.jsonl` is missing for the workspace, prints a short `stderr` reminder about `mdkg event enable`

#### `mdkg task update`

Usage:
- `mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]`
- `                   [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]`
- `                   [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]`
- `                   [--clear-blocked-by] [--run-id <id>] [--note "<text>"]`

Behavior:
- supports `task`, `bug`, and `test` only
- list mutations are additive and unique
- scalar fields replace existing values
- `--clear-blocked-by` clears blockers before optional re-add

#### `mdkg task done`

Usage:
- `mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]`
- `                 [--add-refs <id,...>] [--checkpoint "<title>"] [--run-id <id>] [--note "<text>"]`

Behavior:
- supports `task`, `bug`, and `test` only
- sets `status: done`
- `--checkpoint` creates a related checkpoint
- if `events.jsonl` is missing for the workspace, prints a short `stderr` reminder about `mdkg event enable`

Closeout guidance:
- use `--checkpoint` for milestone compression and parent closeout summaries
- do not create a checkpoint for every routine task completion
- feat/epic status edits remain manual; use checkpoints as the durable narrative layer

### `mdkg next`

When to use:
- ask mdkg for the next work item to pull forward

Usage:
- `mdkg next [<id-or-qid>] [--ws <alias>]`

Flags:
- `--ws <alias>`

### `mdkg validate`

When to use:
- run the repo trust gate before calling work done

Usage:
- `mdkg validate [--out <path>] [--quiet]`

Flags:
- `--out <path>`
- `--quiet`

Notes:
- validates nodes, graph integrity, skills, and event log contracts

## Advanced / maintenance commands

### `mdkg event`

When to use:
- ensure or append append-only episodic logs
- keep a durable provenance trail for mutating workflows

#### `mdkg event enable`

Usage:
- `mdkg event enable [--ws <alias>]`

Behavior:
- creates `.mdkg/work/events/events.jsonl` if missing
- leaves `.gitignore` unchanged
- automatic command-level events happen when the file exists
- task start/done reminders point here when `events.jsonl` is missing

#### `mdkg event append`

Usage:
- `mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options]`

Flags:
- `--ws <alias>`
- `--artifacts <a,...>`
- `--notes "<text>"`
- `--run-id <id>`
- `--agent <name>`
- `--skill <slug>`
- `--tool <id>`

### `mdkg checkpoint`

Usage:
- `mdkg checkpoint new <title> [--ws <alias>]`
- `        [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]`

### `mdkg index`

Usage:
- `mdkg index [--tolerant]`

### `mdkg guide`

Usage:
- `mdkg guide`

### `mdkg format`

Usage:
- `mdkg format`

### `mdkg doctor`

Usage:
- `mdkg doctor [--json]`

### `mdkg workspace`

Usage:
- `mdkg workspace ls`
- `mdkg workspace add <alias> <path> [--mdkg-dir <dir>]`
- `mdkg workspace rm <alias>`

## Structured output contract

Current structured output surface:
- `--json` only

Current JSON envelopes:
- `list` / `search`
  - `{ command, kind, count, items }`
- `show`
  - `{ command, kind, item }`
- `skill list` / `skill search`
  - `{ command, kind, count, items }`
- `skill show`
  - `{ command, kind, item }`

Kind values in this wave:
- node commands: `node`
- skill commands: `skill`

JSON behavior rules:
- full bodies are returned only by `show` and `skill show` without `--meta`
- list/search summaries never include bodies
- text notes and counts go to `stderr`
- JSON payloads go to `stdout`

## Event logging contract

Explicit commands:
- `mdkg event enable`
- `mdkg event append`

Automatic baseline events append only when `events.jsonl` exists for the workspace.
Current automatic mutation events:
- `NODE_CREATED`
- `SKILL_CREATED`
- `CHECKPOINT_CREATED`
- `TASK_STARTED`
- `TASK_UPDATED`
- `TASK_DONE`

## Deferred follow-up work

Tracked separately:
- XML discovery/show output
- TOON discovery/show output
- Markdown discovery/show output
- additional coverage hardening beyond the current release wave
