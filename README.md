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

This is the generic OSS bootstrap path. It creates `.mdkg/` and updates `.gitignore` / `.npmignore` by default. Use `--no-update-ignores` to opt out.

Optional agent-ready scaffold:

```bash
mdkg init --omni
```

This adds strict-node `SOUL.md` / `HUMAN.md`, a skills scaffold, seeded events JSONL, and core pin updates.

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

Create a first-class skill:

```bash
mdkg skill new release-readiness "release readiness audit" --description "use when preparing a release"
mdkg skill list
mdkg skill show release-readiness
mdkg skill validate release-readiness
```

## LLM-readable onboarding artifacts

The root docs below are the canonical fast-start set for humans and agents:
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
- `mdkg validate`

Advanced / maintenance commands still exist, but they are not the first-run story:
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
- skills have a focused command family:
  - `mdkg skill new <slug> "<name>" --description "..."`
  - `mdkg skill list`
  - `mdkg skill search "<query>"`
  - `mdkg skill show <slug>`
  - `mdkg skill validate [<slug>]`
- generic compatibility still works:
  - `mdkg list --type skill`
  - `mdkg search "<query>" --type skill`
  - `mdkg show skill:<slug>`
- work items may reference `skills: [slug,...]`
- packs may include skills with `--skills` and `--skills-depth`
- mdkg indexes and discovers skills but does not execute skill scripts
- `SKILL.md` is canonical
- `SKILLS.md` is tolerated on read for compatibility, but validation warns and canonical docs still use `SKILL.md`
- if both `SKILL.md` and `SKILLS.md` exist in one skill folder, validation fails
- `mdkg skill new` scaffolds `SKILL.md`, `references/`, `assets/`, and `scripts/` only when requested with `--with-scripts`

This repo now dogfoods three internal skills:
- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

## Current direction

Current v0.4 source already includes:
- `init --omni`
- default ignore updates with `--no-update-ignores`
- skills indexing and search/show/list support
- optional `skills: [...]` on work items
- pack-time skill inclusion
- latest-checkpoint resolver + index hint
- events JSONL validation

Current post-v0.4x direction is:
- keep the OSS story generic around `init --llm`
- keep `pack <id>` at the center of the human/agent loop
- simplify visible CLI help before removing deeper compatibility paths
- dogfood real skills inside the repo
- make skill authoring first-class through `mdkg skill`
- run manual behavior audits before enforcing stronger coverage thresholds

Design and decision records live in the internal graph under `.mdkg/design/`.

## Safety

mdkg is not a secret store.

Use these defaults:
- keep `.mdkg/index/` gitignored
- keep `.mdkg/pack/` gitignored
- keep `.mdkg/work/events/*.jsonl` gitignored unless you deliberately opt in
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
4. implement and test
5. run `mdkg validate`

## License

MIT
