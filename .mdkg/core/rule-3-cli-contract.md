---
id: rule-3
type: rule
title: mdkg cli contract (root-only, commands, flags, exit codes)
tags: [cli, contract, mdkg, spec]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-05-17
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
- Imported bundle nodes use the same qualified form with the import alias:
  - `<import-alias>:<id>` (example: `agent_image:work.generate-image`)
  - imported nodes are read-only planning context and MUST NOT be selected by local mutation commands

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
  - `--json`, `--xml`, `--toon`, and `--md` output for supported discovery/show commands
  - when printing node summaries (e.g., `show`/list results), outputs SHOULD surface key searchable frontmatter fields such as `links` and `artifacts`

## Command set (v1 target)

### Initialization
- `mdkg init`
  - creates `.mdkg/` directory structure at root
  - creates `.mdkg/config.json` if missing
  - creates core docs and templates if missing
  - does NOT overwrite existing docs unless `--force`
  - updates `.gitignore` and `.npmignore` by default
  - `--no-update-ignores` disables default ignore writes
  - explicit flags (`--update-gitignore`, `--update-npmignore`, `--update-dockerignore`) force writes even with global opt-out
  - `--agent` is the canonical documented path for complete AI-agent bootstrap
  - `--llm`, `--agents`, `--claude`, and `--omni` fail before mutation with guidance to use `mdkg init --agent`
  - `--agent` adds startup docs, strict-node bootstrap docs, and scaffolding:
    - `AGENT_START.md`
    - `AGENTS.md`
    - `CLAUDE.md`
    - `llms.txt`
    - `CLI_COMMAND_MATRIX.md`
    - `.mdkg/core/SOUL.md` (`id: rule-soul`)
    - `.mdkg/core/HUMAN.md` (`id: rule-human`)
    - seeded canonical skills:
      - `.mdkg/skills/select-work-and-ground-context/SKILL.md`
      - `.mdkg/skills/build-pack-and-execute-task/SKILL.md`
      - `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
    - `.mdkg/skills/registry.md`
    - `.mdkg/work/events/events.jsonl`
    - `.agents/skills/`
    - `.claude/skills/`
    - deterministic `core.md` pin insertion (`rule-soul`, then `rule-human`)
    - ignore policy for `.mdkg/index/`, `.mdkg/pack/`, and raw archive source copies under `.mdkg/archive/**/source/`
  - mirrored skills are append-focused outputs:
    - `.mdkg/skills/` remains canonical
    - unrelated existing folders under `.agents/skills/` and `.claude/skills/` are preserved
    - same-slug collisions fail by default unless explicitly forced through `mdkg skill sync --force`

### Guide
- `mdkg guide`
  - prints `.mdkg/core/guide.md` to stdout

### Workspace management (registered, no discovery)
- `mdkg workspace ls`
- `mdkg workspace add <alias> <path>`
- `mdkg workspace rm <alias>`
- workspace entries may include advisory `visibility: private|internal|public` metadata for capability-cache filtering

### Indexing
- `mdkg index`
  - rebuild global cache `.mdkg/index/global.json`
  - rebuild skills cache `.mdkg/index/skills.json` from `.mdkg/skills/<slug>/SKILL.md`
  - rebuild capability cache `.mdkg/index/capabilities.json` from skills, `SPEC.md`, `WORK.md`, core docs, and design docs
  - rebuild bundle import projection cache `.mdkg/index/imports.json` when bundle imports are configured
  - tolerate `.mdkg/skills/<slug>/SKILLS.md` on read with warning
  - fail validation if both `SKILL.md` and `SKILLS.md` exist in one skill directory
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
- `--skills <slug,slug,...>` (work items)
- `--template <set>` (default from config)

### Read/search
- `mdkg show <id-or-qid> [--meta] [--json|--xml|--toon|--md]`
  - default behavior shows the full node body
  - `--meta` is the compact card-only view
- `mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>] [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`
  - search SHOULD match on IDs, titles, tags, path tokens, and searchable frontmatter lists (`links`, `artifacts`, `refs`, `aliases`)
- `mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>] [--blocked] [--priority <n>] [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`
- enabled bundle imports are included in `show`, `search`, `list`, `pack`, and `capability` reads by default:
  - imported nodes surface `source.imported: true` in JSON output
  - human output labels imported nodes as read-only and stale when applicable
  - stale imports warn during planning reads but remain usable
- skills are first-class under `mdkg skill ...` only:
  - `mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`
  - `mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]`
  - `mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`
  - `mdkg skill validate [<slug>]`
  - `mdkg skill sync [--force]`
- capabilities are cached Markdown projections under `mdkg capability ...`:
  - `mdkg capability list [--kind <skill|spec|work|core|design>] [--visibility <private|internal|public>] [--json]`
  - `mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]`
  - `mdkg capability show <id-or-qid-or-slug> [--json]`
  - capability records are read-only derived cache entries, not source of truth
  - normal task, epic, feat, bug, test, and checkpoint nodes are not capability records
- archives are first-class sidecar nodes under `mdkg archive ...`:
  - `mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]`
  - `mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]`
  - `mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]`
  - `mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]`
  - `mdkg archive compress <id-or-archive-uri|--all> [--json]`
  - `archive://<archive.id>` refs resolve against local archive sidecars
  - archive visibility defaults to `private`
  - in-repo source paths are recorded repo-relative; outside-repo source paths are redacted as `external:<basename>`
  - `mdkg validate` and `mdkg archive verify` both check ZIP cache hash, ZIP readability, payload hash, and payload byte size
  - raw copied sources live under `.mdkg/archive/**/source/`; sidecar `.md` and deterministic `.zip` caches remain commit-eligible
- full graph snapshot bundles live under `mdkg bundle ...`:
  - `mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]`
  - `mdkg bundle verify [bundle-path] [--json]`
  - `mdkg bundle show <bundle-path> [--json]`
  - `mdkg bundle list [--json]`
  - `mdkg bundle import add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]`
  - `mdkg bundle import list [--json]`
  - `mdkg bundle import rm <alias> [--json]`
  - `mdkg bundle import enable <alias> [--json]`
  - `mdkg bundle import disable <alias> [--json]`
  - `mdkg bundle import verify [alias|--all] [--json]`
  - bundles are explicit transport artifacts and are not rewritten by `mdkg index`
  - default output is `.mdkg/bundles/<profile>/<workspace-or-all>.mdkg.zip`
  - public bundles must fail closed when public records reference private graph or archive records
  - public bundles must fail closed when public records reference private/internal imported graph records
  - bundle imports are read-only projected graph views; child repos remain owners of real mutations and commits
  - `bundle import verify` exits nonzero for stale, missing, corrupt, profile-mismatched, or duplicate-id imports
  - public bundle creation must not re-export imported child graph content and must fail if public local nodes reference private/internal imports
  - public/internal imports require `expected_profile: public`; private bundle profiles cannot be promoted through import visibility
  - `mdkg pack --visibility public|internal|private` records explicit pack visibility and filters public/internal packs through the same fail-closed policy
- work lifecycle helpers live under `mdkg work ...`:
  - `mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]`
  - `mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--input-refs <...>] [--requested-outputs <...>] [--json]`
  - `mdkg work order update <id> [--status <status>] [--add-input-refs <...>] [--add-artifacts <...>] [--json]`
  - `mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected] [--json]`
  - `mdkg work receipt update <id> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--json]`
  - `mdkg work artifact add <order-or-receipt-id> <file> [--id <archive.id>] [--kind source|artifact] [--json]`
  - these commands mutate mdkg semantic mirror files only; production order, receipt, payment, ledger, and marketplace state remains canonical outside mdkg
- discovery/show output flags are mutually exclusive; text mode remains the default when none are supplied

### Task lifecycle mutation
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"]`
  - supports `task`, `bug`, and `test` nodes only
  - sets `status: progress`
- `mdkg task update <id-or-qid> [...]`
  - supports additive list mutation for `artifacts`, `links`, `refs`, `skills`, `tags`, and `blocked_by`
  - supports scalar replacement for `status` and `priority`
  - `--clear-blocked-by` resets blockers before optional re-add
  - imported bundle qids fail with an explicit read-only import error
- `mdkg task done <id-or-qid> [--checkpoint "<title>"] [...]`
  - supports `task`, `bug`, and `test` nodes only
  - sets `status: done`
  - optional checkpoint creation is explicit only

### Packs (core feature)
- `mdkg pack <id-or-qid> [--profile <name>] [--verbose] [--format md|json|toon|xml] [--out <path>] [--ws <alias>]`
  - optional skill inclusion flags:
    - `--skills none|auto|<slug,slug,...>`
    - `--skills-depth meta|full`
  - advanced shaping/debug flags remain supported but de-emphasized:
    - `--depth <n>`
    - `--edges <keys>`
    - `--strip-code`
    - `--max-code-lines <n>`
    - `--max-chars <n>`
    - `--max-lines <n>`
    - `--max-tokens <n>`
    - `--truncation-report <path>`
    - `--stats-out <path>`
  - `--edges` adds to the default edge set
  - `--out` writes to a file (create parent dirs; overwrite if exists)
  - if `--out` is omitted, write to `.mdkg/pack/pack_<kind>_<id>_<timestamp>.<ext>`
  - short flags supported: `-o`, `-f`, `-v`, `-d`, `-e`, `-w`, `-r`
  - `--profile` is the primary documented alias for `--pack-profile`
  - pack selection includes latest checkpoint by pack-time resolver; index hint `latest_checkpoint_qid` is optimization-only

### Next priority
- `mdkg next [<id-or-qid>] [--ws <alias>]`
  - If `<id>` provided: follow `next` if present; otherwise fall back to priority-based selection.
  - If no `<id>` provided: use priority-based selection (and optionally an epic filter in future).

### Checkpoints
- `mdkg checkpoint new "<title>" [--ws <alias>] [--relates <id,...>] [--scope <id,...>]`
  - creates a `chk-*` node from template
  - designed as a phase summary / compression node

### Events
- `mdkg event enable [--ws <alias>]`
  - creates `.mdkg/work/events/events.jsonl` if missing
  - leaves `.gitignore` unchanged
- `mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [...]`
  - appends one JSONL provenance record
- automatic command-level events append only when event logging is enabled for the target workspace
- current automatic mutation events:
  - `NODE_CREATED`
  - `SKILL_CREATED`
  - `CHECKPOINT_CREATED`
  - `TASK_STARTED`
  - `TASK_UPDATED`
  - `TASK_DONE`

### Validation and formatting
- `mdkg validate`
  - strict frontmatter + graph integrity checks (exit code 2 on failure)
  - validates optional node->skill references
  - validates configured bundle imports and fails on missing/corrupt enabled bundles, malformed import config, duplicate projected ids, and invalid import refs
  - warns, but does not fail, on stale imports
  - validates optional `.mdkg/work/events/events.jsonl` record shape when file exists
  - warns when `.agents/skills/` or `.claude/skills/` drift from canonical `.mdkg/skills/`
- `mdkg format`
  - normalize frontmatter formatting and casing
  - avoid destructive body edits
