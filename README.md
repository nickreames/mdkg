# mdkg — Markdown Knowledge Graph

mdkg is a **local-first CLI** that turns structured Markdown into a **searchable, linkable knowledge graph** for engineering work.

It’s designed for:
- humans who want lightweight project documentation + task tracking **in git**
- AI coding agents/LLMs that need **deterministic context bundles** for code generation

mdkg is intentionally boring and portable:
- **Node.js 18+**
- written in **TypeScript**
- **zero runtime dependencies** (no sqlite, no external indexers)
- **dev dependencies only**: TypeScript (build-time) and Node 18+ (runtime)
- works with npm / pnpm / bun

---

## Core idea

You store project knowledge as Markdown nodes with strict frontmatter (a small, stable schema). mdkg:

1) indexes those nodes into a local JSON cache (`.mdkg/index/global.json`)
2) provides fast search/list/show tools
3) generates deterministic **context packs** for agents (Markdown/JSON/TOON/XML exports)

Everything stays in your repo. No servers. No surprises.

---

## Repository structure

mdkg lives in a hidden directory at the repo root:

- `.mdkg/core/` — rules + “pinned” docs
- `.mdkg/design/` — decisions + architecture
- `.mdkg/work/` — epics/tasks/bugs/tests/checkpoints
- `.mdkg/templates/` — document templates used by `mdkg new`
- `.mdkg/index/` — generated cache (gitignored)

mdkg is root-only: you run commands from the repository root and mdkg indexes all registered workspaces without “discovering” nested repos.

---

## Install

Pre-release note: this project is being actively developed and dogfooded.

Once published:
- `npm i -g mdkg`
- `pnpm add -g mdkg`
- `bun add -g mdkg`

---

## Quickstart

1) Initialize mdkg in your repo:

```bash
mdkg init
```

This creates `.mdkg/` (rules, templates, work folders) and updates ignore rules so caches are not committed.

2) Index your repo (cache is default behavior):

```bash
mdkg index
```

3) Create a task from a template:

```bash
mdkg new task "bootstrap cli" --status todo --priority 1 --tags cli,build
```

4) Search and list:

```bash
mdkg search "pack"
mdkg list --type task --status todo
mdkg show task-1
```

5) Generate a deterministic context bundle for an agent:

```bash
mdkg pack task-1 --format md --verbose
```

---

## Why this exists

LLMs are great at writing code, but they need **high-quality, structured context**.

mdkg makes that context:
- easy to author
- easy to query
- easy to hand to an agent
- reproducible across runs and contributors

This is also intended to be a compatible building block for “life git”-style productivity systems (which may later add richer databases like SQLite/Postgres). mdkg stays minimal and local.

---

## Concepts

### Nodes

A node is a Markdown file with strict YAML-like frontmatter fenced by `---`.

Each node must include:
- `id` (unique per workspace; global uniqueness via qualified IDs)
- `type` (rule, prd, edd, dec, prop, epic, feat, task, bug, checkpoint, test)
- `title`
- `created` / `updated` (`YYYY-MM-DD`)

Work items also typically include:
- `status` (backlog, blocked, todo, progress, review, done)
- `priority` (0..9, where 0 is most urgent)

### Graph links

mdkg treats these frontmatter fields as explicit graph structure:
- `epic`, `parent`
- `relates: [...]`
- `blocked_by: [...]`, `blocks: [...]`
- `prev`, `next` (chain navigation)

### Searchable metadata

If you want something searchable, put it in frontmatter:
- `links: [ref, ref]` (URLs or any searchable reference string)
- `artifacts: [ref, ref]` (build outputs, PRs, commits, releases, tarballs, etc.)
- `refs: [id, id]` (non-edge references)
- `aliases: [text, text]`

---

## CLI commands (v1)

### Project setup

- `mdkg init`
  - create `.mdkg/` structure
  - add ignore rules for caches

### Indexing

- `mdkg index`
  - builds `.mdkg/index/global.json`
  - cache is the default; mdkg will reindex automatically if stale

### Query

- `mdkg show <id-or-qid>`
- `mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>] [--priority <n>]`
- `mdkg search "<query>"`

### Packs (agent context)

- `mdkg pack <id> [--format md|json|toon|xml] [--verbose] [--depth <n>] [--edges <keys>]`

`--verbose` includes pinned core docs listed in `.mdkg/core/core.md`.
If `--out` is omitted, packs are written to `.mdkg/pack/pack_<kind>_<id>_<timestamp>.<ext>`.

### Quickstart (CLI only)

```bash
mdkg init --llm
mdkg index
mdkg new task "..." --status todo --priority 1
mdkg list --status todo
mdkg pack <id> --verbose
mdkg validate
```

### Workflow helpers

- `mdkg next [<id>] [--ws <alias>]`
  - follows `next` chain if present; otherwise picks highest priority work item

- `mdkg checkpoint new "<title>"`
  - creates a checkpoint node (a compression summary)

### Quality gates

- `mdkg validate`
  - strict frontmatter validation
  - missing required fields, invalid enums, dangling edges, cycles, duplicates
  - supports `--out <path>` and `--quiet` for CI workflows

- `mdkg format`
  - conservative frontmatter normalizer (idempotent)

---

## Safety

mdkg is designed to avoid accidental leaks:
- cache files live under `.mdkg/index/` and must be gitignored
- publishing should use a strict `package.json.files` whitelist
- `.mdkg/` content should never ship to production builds

---

## Contributing

This repo dogfoods mdkg. The source of truth for behavior is:
- `.mdkg/core/rule-*.md`
- `.mdkg/core/guide.md`
- `.mdkg/core/rule-2-context-pack-rules.md`

Suggested workflow:
1) create or update a task in `.mdkg/work/`
2) run `mdkg validate`
3) generate a pack for the task and use it as agent context

---

## License

MIT (recommended). Add a `LICENSE` file to confirm.
