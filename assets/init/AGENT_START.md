# AGENT_START

This repository uses mdkg for deterministic project memory.

mdkg is pre-v1 public alpha software. Treat generated graph, cache, bundle, and DAL contracts as usable but still stabilizing before v1.

Read these files in order:
1. `.mdkg/core/SOUL.md` if it exists
2. `.mdkg/core/HUMAN.md` if it exists
3. `.mdkg/README.md`
4. `CLI_COMMAND_MATRIX.md`

Trust order:
- source code
- mdkg rules, design docs, decisions, and work nodes
- SOUL/HUMAN collaboration anchors
- relevant skills
- chat history

Agent operating prompt:
- You are working in a repository that uses mdkg for deterministic project memory.
- Prefer `mdkg pack <id>` over ad-hoc file lists when a work item is known.
- Treat mdkg rules, EDDs, DECs, PRDs, and work nodes as more authoritative than chat memory.
- Use `mdkg show <id>` for direct inspection and `mdkg show <id> --meta` for card-only inspection.
- Use `mdkg search "..."` and `mdkg next` to discover current work.
- Use `mdkg skill list`, `mdkg skill search`, and `mdkg skill show <slug>` for skill discovery.
- Use `mdkg capability list/search/show` for deterministic skills, `SPEC.md`, `WORK.md`, core-doc, and design-doc capability discovery.
- Use `mdkg index` to refresh JSON compatibility caches and `.mdkg/index/mdkg.sqlite` when SQLite mode is enabled.
- Use `mdkg archive add/list/show/verify/compress` for committed source and artifact sidecars under `.mdkg/archive`.
- Use `mdkg work ...` helpers for semantic mirror contracts, work orders, receipts, and artifact registration.
- Treat work contracts, orders, and receipts as committed semantic mirrors only; never store raw secrets, credentials, live payment state, ledger mutations, or canonical marketplace state in mdkg.
- Use `artifact://...` for external/runtime-managed artifacts and `archive://...` for committed mdkg archive sidecars.
- Use `mdkg bundle create/list/show/verify` for explicit full `.mdkg` graph snapshot bundles.
- Use `mdkg bundle import add/list/verify` to register child bundle snapshots as read-only planning context.
- Use `mdkg pack <id> --visibility public|internal` only when you need a public-safe or internal-safe pack; no flag remains private-capable local behavior.
- Mark archive sidecars public only with explicit `mdkg archive add --visibility public` intent.
- Treat sidecar `.md` plus deterministic `.zip` caches as the commit-eligible archive record; validation and `mdkg archive verify` both check ZIP payload integrity.
- Before committing repos that track archive caches or `.mdkg/bundles/`, run `mdkg archive compress --all`, `mdkg archive verify --json`, `mdkg bundle create --profile private`, and `mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip`.
- Use `mdkg task start/update/done` for structured task, bug, and test lifecycle fields.
- Use `mdkg upgrade` to preview scaffold updates; only run `mdkg upgrade --apply` after reviewing the receipt.
- Keep nuanced summaries, body text, and manual parent closeout edits in markdown.
- Use `mdkg event enable` only if `events.jsonl` is missing and provenance should be restored.
- Use `CLI_COMMAND_MATRIX.md` for the canonical command and flag surface.
- Run `mdkg validate` before marking work done.

If the active task is known:
- `mdkg pack <id>`
- `mdkg task start <id>` when durable work begins
- `mdkg task update <id> ...` as evidence accumulates
- `mdkg task done <id>` when work is complete
- `mdkg validate`

If no task is known:
- `mdkg search "..."`
- `mdkg show <id>`
- `mdkg next`
- then use `mdkg pack <id>`

If this is a fresh import or external docs bundle:
- create a root epic, PRD, or EDD that captures the imported context and source locations
- create follow-on tasks and tests from that root context instead of scattering untracked notes
- run `mdkg validate` after the first ingestion pass

Skill discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill list --tags stage:execute --json`
- `mdkg skill list --tags stage:review --json`
- `mdkg skill show select-work-and-ground-context`

Capability discovery:
- `mdkg capability list --kind skill --json`
- `mdkg capability search "<query>" --kind spec --json`
- `mdkg capability search "<query>" --kind work --json`

Conventions:
- `AGENTS.md` is the Codex/OpenAI-oriented wrapper doc.
- `CLAUDE.md` is the Claude-oriented wrapper doc.
- `.agents/skills/` and `.claude/skills/` mirror canonical skills from `.mdkg/skills/` when agent bootstrap is enabled.
- mdkg does not execute skill scripts; runtimes decide when and whether to do that.
- Prefer packs over ad-hoc file lists.
- Prefer task/event commands for structured work-state changes and use markdown edits for narrative/body updates.
- Use `mdkg task done <id> --checkpoint "<title>"` for milestone compression, not every routine task completion.
- Prefer checkpoints for feat/epic closeout summaries; parent status edits remain manual.
- If `events.jsonl` is missing, `mdkg task start` and `mdkg task done` will remind you how to recreate it.
- Files outside mdkg-managed skill mirrors, such as local tool permission files, are not managed by mdkg unless documented explicitly.

Structured discovery/show exports:
- `--json`
- `--xml`
- `--toon`
- `--md`
