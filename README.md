# mdkg

mdkg is a local-first CLI for turning structured Markdown into deterministic project memory.

It is built for:
- human builders who want project truth and task state in git
- AI agents that need deterministic context instead of ad-hoc file reading
- human + agent pairs who want one shared source of truth

mdkg stays deliberately boring:
- repo-native under `.mdkg/`
- TypeScript + Node.js 18+
- zero runtime dependencies
- no sqlite, daemon, hosted index, or vector DB

Current package version in source: `0.0.6`

## The product shape

mdkg has one core job: make repo knowledge cheap to retrieve and safe to reuse.

The primary loop is:
1. initialize the repo
2. create or select work
3. inspect the current truth
4. build a deterministic pack
5. validate before closing the loop

If an agent is involved, the default handoff primitive is `mdkg pack <id>`.
If a repo needs repeatable procedures, author them as first-class skills under `.mdkg/skills/`.

## Install

Once published:

```bash
npm i -g mdkg
# or
pnpm add -g mdkg
# or
bun add -g mdkg
```

## Quickstart

Initialize mdkg in a repo:

```bash
mdkg init --llm
```

This is the generic OSS bootstrap path. It creates `.mdkg/` and updates `.gitignore` / `.npmignore` by default. Use `--no-update-ignores` to opt out of those ignore-file updates.

Optional agent-ready scaffold:

```bash
mdkg init --agent
```

This adds strict-node `SOUL.md` / `HUMAN.md`, seeds the three default mdkg usage skills, creates `events.jsonl`, updates the skill registry, adds core pin updates, and creates mirrored skill folders under `.agents/skills/` and `.claude/skills/`.

Create a task:

```bash
mdkg new task "bootstrap cli" --status todo --priority 1 --tags cli,build
```

Inspect the current truth:

```bash
mdkg search "pack"
mdkg show task-1
mdkg next
```

Build deterministic context:

```bash
mdkg pack task-1
mdkg pack task-1 --profile concise --dry-run --stats
```

Validate before handoff or commit:

```bash
mdkg validate
```

Update structured task state and evidence while keeping body and narrative edits in markdown:

```bash
mdkg task start task-1 --run-id run_local_1
mdkg task update task-1 --add-artifacts tests://unit.txt --add-tags release
mdkg task done task-1 --checkpoint "release readiness milestone"
```

Ensure and append baseline event memory:

```bash
mdkg event enable
mdkg event append --kind RUN_COMPLETED --status ok --refs task-1 --notes "manual closeout"
```

Create a first-class skill:

```bash
mdkg skill new release-readiness "release readiness audit" --description "use when preparing a release"
mdkg skill list
mdkg skill show release-readiness
mdkg skill validate release-readiness
```

## LLM-readable onboarding artifacts

The root docs below are the canonical fast-start set for humans and agents:
- [`AGENT_START.md`](/Users/nicholasreames/Git/mdkg/AGENT_START.md)
- [`llms.txt`](/Users/nicholasreames/Git/mdkg/llms.txt)
- [`AGENT_PROMPT_SNIPPET.md`](/Users/nicholasreames/Git/mdkg/AGENT_PROMPT_SNIPPET.md)
- [`PACK_EXAMPLES.md`](/Users/nicholasreames/Git/mdkg/PACK_EXAMPLES.md)
- [`MANUAL_BEHAVIOR_AUDIT.md`](/Users/nicholasreames/Git/mdkg/MANUAL_BEHAVIOR_AUDIT.md)
- [`CLI_COMMAND_MATRIX.md`](/Users/nicholasreames/Git/mdkg/CLI_COMMAND_MATRIX.md)
- [`COVERAGE_HARDENING_MATRIX.md`](/Users/nicholasreames/Git/mdkg/COVERAGE_HARDENING_MATRIX.md)

## Repository shape

mdkg lives under a hidden root directory:
- `.mdkg/core/` rules and pinned docs
- `.mdkg/design/` product, design, and decision docs
- `.mdkg/work/` tasks, bugs, tests, epics, checkpoints
- `.mdkg/templates/` templates used by `mdkg new`
- `.mdkg/skills/` Agent Skills packages
- `.agents/skills/` Codex/OpenAI-facing mirrored skills
- `.claude/skills/` Claude-facing mirrored skills
- `.mdkg/index/` generated cache files

## Primary commands

These are the commands new users and agents should learn first:
- `mdkg init`
- `mdkg new`
- `mdkg search`
- `mdkg show`
- `mdkg next`
- `mdkg pack`
- `mdkg skill`
- `mdkg task`
- `mdkg validate`

Advanced / maintenance commands still exist, but they are not the first-run story:
- `mdkg event`
- `mdkg checkpoint`
- `mdkg index`
- `mdkg guide`
- `mdkg format`
- `mdkg doctor`
- `mdkg workspace`

## Skills

mdkg supports Agent Skills as procedural memory.

Canonical layout:

```text
.mdkg/skills/<slug>/SKILL.md
```

Current source behavior:
- skills are indexed into `.mdkg/index/skills.json`
- `.mdkg/skills/` remains the canonical skill source of truth
- `.agents/skills/` and `.claude/skills/` are materialized mirrors for agent products
- skills have a focused command family:
  - `mdkg skill new <slug> "<name>" --description "..."`
  - `mdkg skill list`
  - `mdkg skill search "<query>"`
  - `mdkg skill show <slug>`
  - `mdkg skill validate [<slug>]`
  - `mdkg skill sync`
- machine-readable skill discovery and inspection is available through:
  - `mdkg skill list --json`
  - `mdkg skill search "<query>" --json`
  - `mdkg skill show <slug> --json`
  - `mdkg skill list --xml|--toon|--md`
  - `mdkg skill search "<query>" --xml|--toon|--md`
  - `mdkg skill show <slug> --xml|--toon|--md`
- work items may reference `skills: [slug,...]`
- packs may include skills with `--skills` and `--skills-depth`
- mdkg indexes and discovers skills but does not execute skill scripts
- `SKILL.md` is canonical
- `SKILLS.md` is tolerated on read for compatibility, but validation warns and canonical docs still use `SKILL.md`
- if both `SKILL.md` and `SKILLS.md` exist in one skill folder, validation fails
- `mdkg skill new` scaffolds `SKILL.md`, `references/`, `assets/`, and `scripts/` only when requested with `--with-scripts`
- `mdkg skill sync` refreshes the product-specific mirrors from canonical `.mdkg/skills/`
- mirrored skill folders are append-focused outputs; preserve unrelated existing folders and fail on same-slug collisions unless explicitly forced

This repo now dogfoods three internal skills:
- `author-mdkg-skill`
- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

## Current direction

This release includes:
- `init --agent`
- default ignore updates with `--no-update-ignores` for `.mdkg/index/` and `.mdkg/pack/`
- root-only published init seed config
- skills indexing and search/show/list support
- optional `skills: [...]` on work items
- pack-time skill inclusion
- latest-checkpoint resolver + index hint
- events JSONL validation
- XML / TOON / Markdown output for node and skill list/search/show
- product-specific skill mirrors for Codex/OpenAI and Claude
- shared `AGENT_START.md` startup guidance

Current direction:
- keep the OSS story generic around `init --llm`
- use `init --agent` for deeper AI-agent bootstrap
- keep `pack <id>` at the center of the human/agent loop
- use `mdkg task ...` for structured state changes and markdown edits for narrative/body content
- make event logging guided instead of purely manual
- dogfood real skills inside the repo
- make skill authoring first-class through `mdkg skill`
- make `CLI_COMMAND_MATRIX.md` the single source of truth for the live CLI surface
- run manual behavior audits before enforcing stronger coverage thresholds

Design and decision records live in the internal graph under `.mdkg/design/`.

## Safety

mdkg is not a secret store.

Use these defaults:
- keep `.mdkg/index/` gitignored
- keep `.mdkg/pack/` gitignored
- event logs are committed by default; ignore or delete them manually if a repo wants local-only provenance
- do not ship `.mdkg/` into production builds or published packages
- if an external orchestrator is writing mdkg state, keep one durable writer per run and batch commits at end-of-run or checkpoint boundaries
- do not commit on every tool call

## Contributing

This repo dogfoods mdkg itself. The behavior source of truth is the combination of:
- source under `src/`
- tests under `tests/`
- internal rules and design docs under `.mdkg/`

Suggested local loop:
1. create or select a work item
2. inspect truth with `search`, `show`, or `next`
3. build context with `pack <id>`
4. mutate task state with `mdkg task ...` when durable state changes
5. ensure event logging exists if the JSONL file was deleted or is missing
6. implement and test
7. run `mdkg validate`

## License

MIT
