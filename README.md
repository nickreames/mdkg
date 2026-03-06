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

1) indexes nodes into a local JSON cache (`.mdkg/index/global.json`)
2) indexes skills metadata into `.mdkg/index/skills.json` when `.mdkg/skills/**/SKILL.md` exists
3) provides fast search/list/show tools
4) generates deterministic **context packs** for agents (Markdown/JSON/TOON/XML exports)

Everything stays in your repo. No servers. No surprises.

---

## Repository structure

mdkg lives in a hidden directory at the repo root:

- `.mdkg/core/` — rules + “pinned” docs
- `.mdkg/design/` — decisions + architecture
- `.mdkg/work/` — epics/tasks/bugs/tests/checkpoints
- `.mdkg/templates/` — document templates used by `mdkg new`
- `.mdkg/skills/` — optional Agent Skills packages (`<slug>/SKILL.md`)
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
mdkg init --llm
```

This creates `.mdkg/` (rules, templates, work folders) and updates `.gitignore`/`.npmignore` defaults unless `--no-update-ignores` is set.

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
mdkg list --type skill --tags stage:plan --tags-mode any
mdkg show skill:example-skill --meta
```

5) Generate a deterministic context bundle for an agent:

```bash
mdkg pack task-1 --format md --verbose
mdkg pack task-1 --pack-profile concise --dry-run --stats
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

## Roadmap (v0.4.0 target + current source state)

These are target-state goals and partial implementation tracks for v0.4.0.

Implemented in current source:
- `mdkg init --omni` bootstrap mode (with `--llm` retained for compatibility)
- init-omni scaffold contract: `.mdkg/core/SOUL.md` (`id: rule-soul`), `.mdkg/core/HUMAN.md` (`id: rule-human`), `.mdkg/skills/` scaffold, seeded events JSONL, and ID-only core pin updates
- safer init defaults with global opt-out:
  - default updates for `.gitignore` and `.npmignore`
  - `--no-update-ignores` to disable defaults
- deterministic skills metadata index artifact: `.mdkg/index/skills.json`
- skills query surfaces in existing command family:
  - `mdkg list --type skill`
  - `mdkg show skill:<slug>` (plus `--meta`)
  - `mdkg search` includes skill metadata
- query-time tag filtering flags: `--tags <tag,tag,...>` and `--tags-mode any|all`
- optional work-item `skills: [slug,...]` frontmatter field with validation
- `mdkg new ... --skills <slug,slug,...>` support for work-item creation
- optional pack skill inclusion:
  - `--skills none|auto|<slug,slug,...>`
  - `--skills-depth meta|full`
- hybrid latest-checkpoint behavior:
  - pack-time authoritative selection
  - index hint `latest_checkpoint_qid` (optimization only)
- `mdkg validate` JSONL contract checks for `.mdkg/work/events/events.jsonl` when present

Planned targets:
- skills capability direction locked to existing command families (`list/show/search/pack`) for v0.4 planning
- planned skills query filters include `--tags` and `--tags-mode any|all` with policy-stage conventions (for example `stage:plan`)
- policy-driven memory assembly guidance for external orchestrators (single-writer + batched updates)
- redaction policy-level runtime controls (`safe`/`strict`) beyond current docs/contract validation
- v0.4 decision-log rollup documenting design rationale (`dec-9`)
- gap-closure decision record and contracts stream (`dec-10`, `edd-7`, `edd-8`, `epic-5`)
- mdkg.dev launch plan: Home/Docs/Examples/CLI/Blog IA, docs versioning, and initial SEO pillars
- LLM-readable docs artifacts plan: `llms.txt`, agent prompt snippet, and example pack shapes
- skills integration guide plan: authoring standards, progressive disclosure, and script-risk guidance
- event logs + checkpoints guide plan: two-tier episodic memory, JSONL provenance schema, and checkpoint compression cadence
- `.mdkg/core/SOUL.md` and `.mdkg/core/HUMAN.md` as strict mdkg nodes
- episodic event logs under `.mdkg/work/events/*.jsonl`
- docs-level redaction policy framing (`safe`/`strict`) with runtime behavior deferred
- manual docs alignment audits for v0.4.x (command/help parity + source-gap refresh)

Explicitly deferred in planning:
- exact events command names and final non-breaking flag syntax details

Current behavior remains:
- no dedicated event-log command surface

---

## Concepts

### Nodes

A node is a Markdown file with strict YAML-like frontmatter fenced by `---`.

Each node must include:
- `id` (unique per workspace; global uniqueness via qualified IDs)
- `type` (rule, prd, edd, dec, prop, epic, feat, task, bug, checkpoint, test)
- `title`
- `created` / `updated` (`YYYY-MM-DD`)

Most IDs use `<prefix>-<number>`. Reserved rule IDs are also supported: `rule-guide`, `rule-soul`, `rule-human`.

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
  - updates `.gitignore` and `.npmignore` by default (`--no-update-ignores` to skip)
- `mdkg init --omni`
  - scaffolds `SOUL.md`, `HUMAN.md`, skills registry, events JSONL seed, and core pin updates

### Indexing

- `mdkg index`
  - builds `.mdkg/index/global.json`
  - builds `.mdkg/index/skills.json` from `.mdkg/skills/**/SKILL.md`
  - cache is the default; mdkg will reindex automatically if stale

### Query

- `mdkg show <id-or-qid> [--body]`
- `mdkg show skill:<slug> [--meta]`
- `mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>] [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]`
- `mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>] [--tags <tag,tag,...>] [--tags-mode any|all]`

### Packs (agent context)

- `mdkg pack <id> [--format md|json|toon|xml] [--verbose] [--depth <n>] [--edges <keys>]`
- `mdkg pack <id> [--pack-profile standard|concise|headers] [--max-chars <n>] [--max-lines <n>] [--max-tokens <n>]`
- `mdkg pack <id> [--skills none|auto|<slug,slug,...>] [--skills-depth meta|full]`
- `mdkg pack <id> [--stats] [--stats-out <path>] [--truncation-report <path>]`
- `mdkg pack <id> [--dry-run]`
- `mdkg pack --list-profiles`

`--verbose` includes pinned core docs listed in `.mdkg/core/core.md`.
`--pack-profile concise` uses summary-oriented body shaping and strips code blocks by default.
If `--out` is omitted, packs are written to `.mdkg/pack/pack_<kind>_<id>_<timestamp>.<ext>`.

`--max-tokens` uses a heuristic estimate: `~tokens = chars / 4`.

### Quickstart (CLI only)

```bash
mdkg init --llm
mdkg init --omni
mdkg index
mdkg new task "..." --status todo --priority 1
mdkg list --status todo
mdkg pack <id> --verbose
mdkg pack <id> --pack-profile concise --dry-run --stats
mdkg validate
```

### Workflow helpers

- `mdkg next [<id>] [--ws <alias>]`
  - follows `next` chain if present; otherwise picks highest priority work item

- `mdkg checkpoint new "<title>"`
  - creates a checkpoint node (a compression summary)

- `mdkg doctor`
  - runs consumer diagnostics (node version, config, templates, index)
- `mdkg doctor --json`
  - emits machine-readable diagnostics for scripts/CI

- `mdkg --version`
  - prints installed CLI version

### Quality gates

- `mdkg validate`
  - strict frontmatter validation
  - missing required fields, invalid enums, dangling edges, cycles, duplicates
  - validates optional node->skill references and event-log JSONL record shape
  - supports `--out <path>` and `--quiet` for CI workflows

- `mdkg format`
  - conservative frontmatter normalizer (idempotent)

---

## Safety

mdkg is designed to avoid accidental leaks:
- cache files live under `.mdkg/index/` and must be gitignored
- publishing should use a strict `package.json.files` whitelist
- `.mdkg/` content should never ship to production builds
- `.mdkg/work/events/*.jsonl` should be gitignored when episodic logging is enabled

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
4) run `npm run smoke:consumer` before publishing to verify tarball install + onboarding flow

---

## License

MIT (recommended). Add a `LICENSE` file to confirm.
