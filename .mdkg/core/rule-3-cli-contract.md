---
id: rule-3
type: rule
title: mdkg cli contract (root-only, commands, flags, exit codes)
tags: [mdkg, cli, contract, spec]
created: 2026-01-06
updated: 2026-01-14
---

# mdkg CLI contract

This rule defines the **stable CLI behavior** for mdkg v1. The CLI is designed for humans and AI coding agents to use deterministically.

## Root-only requirement

mdkg commands are intended to run at the **repo root**.

- The repo root is the current working directory containing `./.mdkg/config.json`.
- mdkg MUST NOT walk upward to find config by default.
- If config is not found in the current directory:
  - mdkg MUST exit non-zero and print a helpful error.
  - Users may pass `--root <path>` to run from elsewhere.

### `--root`
`--root <path>` sets the root directory explicitly.

- `<path>` may be the repo root or a path that contains `.mdkg/config.json`.
- When `--root` is set, mdkg behaves as if it was invoked from that root.

## Case normalization

- The CLI MUST accept any case for user inputs (types, IDs, flags values).
- Before processing, mdkg MUST normalize:
  - IDs to lowercase
  - types to lowercase
  - status to lowercase
  - workspace aliases to lowercase
  - template set names to lowercase

## Cache / auto reindex (default)

- Cache is enabled by default.
- Commands that rely on the graph MUST:
  1) load `.mdkg/config.json`
  2) check if the global index is stale
  3) auto-reindex if stale (unless `--no-reindex` or config disables)
  4) proceed using the global index

### Flags
- `--no-cache` (optional): bypass reading the cache (debug only)
- `--no-reindex` (optional): do not auto rebuild when stale (CI/debug)

In v1, `--no-cache` and `--no-reindex` are intended as escape hatches, not the normal workflow.

## Workspace behavior

Workspaces are registered in `.mdkg/config.json`.

- Default behavior is **global** across all registered workspaces.
- Many commands SHOULD support:
  - `--ws <alias>` to filter results to a workspace
  - `--ws all` to force global behavior (optional; may be default)

Qualified IDs may be used as input:
- `<ws>:<id>` (example: `e2e:task-12`)

If a user provides an unqualified ID and it is ambiguous globally:
- mdkg MUST error and suggest qualified IDs.

## Exit codes (v1)

- `0` success
- `1` general error / invalid usage
- `2` validation error (frontmatter/schema/graph integrity)
- `3` not found (node/workspace/template not found)
- `4` index error (index build failure)

## Output conventions

- Human-readable output to stdout.
- Errors to stderr.
- Commands should be script-friendly:
  - concise outputs for single items
  - predictable formatting
  - optional `--json` output later (not required for v1)
  - when printing node summaries (e.g., `show`/list results), outputs SHOULD surface key searchable frontmatter fields such as `links` and `artifacts`

## Command set (v1 target)

### Initialization
- `mdkg init`
  - creates `.mdkg/` directory structure at root
  - creates `.mdkg/config.json` if missing
  - creates core docs and templates if missing
  - does NOT overwrite existing docs unless `--force`

### Workspace management (registered, no discovery)
- `mdkg workspace ls`
- `mdkg workspace add <alias> <path>`
- `mdkg workspace rm <alias>`

### Indexing
- `mdkg index`
  - rebuild global cache `.mdkg/index/global.json`
  - strict by default (fails on invalid frontmatter)
  - optional `--tolerant` to skip invalid nodes (escape hatch)

### Create nodes
- `mdkg new <type> "<title>" [flags]`
  - uses global templates (root-only) via token substitution
  - writes into the appropriate workspace-local `.mdkg/<area>/` folder
  - updates index if necessary

Common flags:
- `--ws <alias>` (default `root`)
- `--status <status>` (work items)
- `--priority <0..9>` (work items)
- `--epic <id>`
- `--parent <id>`
- `--relates <id,id,...>`
- `--blocked-by <id,id,...>`
- `--blocks <id,id,...>`
- `--prev <id>`
- `--next <id>`
- `--links <ref,ref,...>`
- `--artifacts <ref,ref,...>`
- `--refs <id,id,...>`
- `--aliases <text,text,...>`
- `--template <set>` (default from config)

### Read/search
- `mdkg show <id-or-qid>`
- `mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]`
  - search SHOULD match on IDs, titles, tags, path tokens, and searchable frontmatter lists (`links`, `artifacts`, `refs`, `aliases`)
- `mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>] [--blocked] [--priority <n>]`

### Graph views
- `mdkg tree <epic-id-or-qid> [--ws <alias>]`
- `mdkg neighbors <id-or-qid> --depth <n> [--edges <...>]`

### Packs (core feature)
- `mdkg pack <id-or-qid> [--depth <n>] [--verbose] [--edges <keys>] [--format md|json|toon|xml] [--out <path>] [--ws <alias>]`
  - `--edges` adds to the default edge set
  - `--out` writes to a file (create parent dirs; overwrite if exists)
  - if `--out` is omitted, write to `.mdkg/pack/pack_<kind>_<id>_<timestamp>.<ext>`
  - short flags supported: `-o`, `-f`, `-v`, `-d`, `-e`, `-w`, `-r`

### Next priority
- `mdkg next [<id-or-qid>] [--ws <alias>]`
  - If `<id>` provided: follow `next` if present; otherwise fall back to priority-based selection.
  - If no `<id>` provided: use priority-based selection (and optionally an epic filter in future).

### Checkpoints
- `mdkg checkpoint new "<title>" [--ws <alias>] [--relates <id,...>] [--scope <id,...>]`
  - creates a `chk-*` node from template
  - designed as a phase summary / compression node

### Validation and formatting
- `mdkg validate`
  - strict frontmatter + graph integrity checks (exit code 2 on failure)
- `mdkg format`
  - normalize frontmatter formatting and casing
  - avoid destructive body edits
