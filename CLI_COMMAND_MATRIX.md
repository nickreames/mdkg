# CLI Command Matrix

as_of: 2026-03-11
package_version_in_source: 0.0.9
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
- `mdkg new <type> "<title>" [options] [--json]`

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

Agent workflow file types:
- `spec`
- `work`
- `work_order`
- `receipt`
- `feedback`
- `dispute`
- `proposal`

Agent workflow file type creation:
- `mdkg new spec "<title>" [options] [--json]`
- `mdkg new work "<title>" [options] [--json]`
- `mdkg new work_order "<title>" [options] [--json]`
- `mdkg new receipt "<title>" [options] [--json]`
- `mdkg new feedback "<title>" [options] [--json]`
- `mdkg new dispute "<title>" [options] [--json]`
- `mdkg new proposal "<title>" [options] [--json]`

Primary flags:
- `--id <portable-id>` agent workflow file types only
- `--ws <alias>`
- `--status <status>`
- `--priority <0..9>`
- `--epic <id>`
- `--tags <tag,tag,...>`
- `--skills <slug,slug,...>`
- `--template <set>`
- `--run-id <id>`
- `--json`

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

JSON receipt:
- `{ action: "created", node: { workspace, id, qid, path, type, title, status, priority } }`
- `status` and `priority` are included only when present on the created node.

Notes:
- `--id` lets agent workflow files use semantic portable ids such as `agent.image-worker`, `work.generate-image`, or `proposal.review-loop-1`.
- `spec` and `work` scaffold as validation-clean standalone docs. `work_order`, `receipt`, `feedback`, `dispute`, and `proposal` templates contain editable placeholder refs and need real graph or `skill.<slug>` refs before strict validation passes.

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
- `mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]`

Flags:
- `--description <text>`
- `--tags <tag,tag,...>`
- `--authors <name,name,...>`
- `--links <url,url,...>`
- `--run-id <id>`
- `--json`
- `--with-scripts`
- `--force`

JSON receipt:
- `{ action: "created", skill: { workspace, id, qid, slug, name, path, with_scripts } }`

#### `mdkg skill sync`

Usage:
- `mdkg skill sync [--force] [--json]`

Flags:
- `--force`
- `--json`

JSON receipt:
- `{ action: "synced", sync: { synced, pruned, targets } }`

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
- `mdkg skill validate [<slug>] [--json]`

Flags:
- `--json`

JSON receipt:
- `{ action: "validated", ok, checked_count, warning_count, error_count, warnings, errors, target }`
- `target` is included only when a slug is passed.

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
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]`
- `mdkg task update <id-or-qid> [options] [--json]`
- `mdkg task done <id-or-qid> [--checkpoint "<title>"] [options] [--json]`

#### `mdkg task start`

Usage:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]`

Behavior:
- supports `task`, `bug`, and `test` only
- sets `status: progress`
- if `events.jsonl` is missing for the workspace, prints a short `stderr` reminder about `mdkg event enable`

JSON receipt:
- `{ action: "started", task: { workspace, id, qid, path, type, status, priority } }`

#### `mdkg task update`

Usage:
- `mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]`
- `                   [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]`
- `                   [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]`
- `                   [--clear-blocked-by] [--run-id <id>] [--note "<text>"] [--json]`

Behavior:
- supports `task`, `bug`, and `test` only
- list mutations are additive and unique
- scalar fields replace existing values
- `--clear-blocked-by` clears blockers before optional re-add

JSON receipt:
- `{ action: "updated", task: { workspace, id, qid, path, type, status, priority } }`

#### `mdkg task done`

Usage:
- `mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]`
- `                 [--add-refs <id,...>] [--checkpoint "<title>"] [--run-id <id>] [--note "<text>"] [--json]`

Behavior:
- supports `task`, `bug`, and `test` only
- sets `status: done`
- `--checkpoint` creates a related checkpoint
- if `events.jsonl` is missing for the workspace, prints a short `stderr` reminder about `mdkg event enable`

JSON receipt:
- without checkpoint: `{ action: "done", task: { workspace, id, qid, path, type, status, priority } }`
- with checkpoint: `{ action: "done", task: { workspace, id, qid, path, type, status, priority }, checkpoint: { workspace, id, qid, path } }`

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
- `mdkg validate [--out <path>] [--quiet] [--json]`

Flags:
- `--out <path>`
- `--quiet`
- `--json`

JSON receipt:
- `{ action: "validated", ok, warning_count, error_count, warnings, errors, report_path }`
- `report_path` is included only when `--out` is used.

Notes:
- validates nodes, graph integrity, skills, and event log contracts

## Advanced / maintenance commands

### `mdkg event`

When to use:
- ensure or append append-only episodic logs
- keep a durable provenance trail for mutating workflows

#### `mdkg event enable`

Usage:
- `mdkg event enable [--ws <alias>] [--json]`

Behavior:
- creates `.mdkg/work/events/events.jsonl` if missing
- leaves `.gitignore` unchanged
- automatic command-level events happen when the file exists
- task start/done reminders point here when `events.jsonl` is missing

JSON receipt:
- `{ action: "enabled", workspace, created }`

#### `mdkg event append`

Usage:
- `mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]`

Flags:
- `--ws <alias>`
- `--artifacts <a,...>`
- `--notes "<text>"`
- `--run-id <id>`
- `--agent <name>`
- `--skill <slug>`
- `--tool <id>`
- `--json`

JSON receipt:
- `{ action: "appended", event }`

### `mdkg checkpoint`

Usage:
- `mdkg checkpoint new <title> [--ws <alias>] [--json]`
- `        [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]`

JSON receipt:
- `{ action: "created", checkpoint: { workspace, id, qid, path } }`

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
- `mdkg workspace ls [--json]`
- `mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--json]`
- `mdkg workspace rm <alias> [--json]`
- `mdkg workspace enable <alias> [--json]`
- `mdkg workspace disable <alias> [--json]`

JSON mutation receipts:
- `add`: `{ action: "added", workspace: { alias, path, enabled, mdkg_dir } }`
- `rm`: `{ action: "removed", workspace: { alias, path, enabled, mdkg_dir } }`
- `enable`: `{ action: "enabled", workspace: { alias, path, enabled, mdkg_dir } }`
- `disable`: `{ action: "disabled", workspace: { alias, path, enabled, mdkg_dir } }`

## Structured output contract

Current structured output surface:
- `--json`
- `--xml`
- `--toon`
- `--md`

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
- skill summaries include generic `extensions`; `ochatr_*` metadata is exposed as `extensions.ochatr` and retained as top-level `ochatr` compatibility data in 0.0.9
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
