# AGENT_START

This repository uses mdkg as durable project memory for humans and AI agents.

## Read order

Start here, then read in this order:
1. `.mdkg/core/SOUL.md`
2. `.mdkg/core/HUMAN.md`
3. `.mdkg/README.md`
4. `CLI_COMMAND_MATRIX.md`

If those files disagree, trust the source code and current CLI behavior first, then update the docs.

## Truth hierarchy

Use this order of trust:
- source code and tests
- mdkg rules, design docs, decision records, and work nodes
- `SOUL.md` and `HUMAN.md`
- relevant skills
- prior chat history

## Agent operating prompt

You are working in a repository that uses mdkg for deterministic project memory.

Operating rules:
- Read `AGENT_START.md` first; it points to the pinned core docs, command matrix, and first-step planning skill.
- Prefer `mdkg pack <id>` over ad-hoc file lists when a work item is known.
- Treat mdkg rules, EDDs, DECs, PRDs, and work nodes as more authoritative than chat memory.
- Use `mdkg show <id>` for direct inspection and `mdkg show <id> --meta` for card-only inspection.
- Use `mdkg search "..."` and `mdkg next` to discover current work.
- Use `mdkg new goal "..."` for long-running recursive objectives that need an explicit end condition, active node, required skills, required checks, and completion evidence.
- Use `mdkg goal activate <goal-id>` to make one local root goal active, then `mdkg goal next` to surface one scoped feature, task, bug, test, or spike at a time; normal `mdkg next` remains for non-goal concrete work.
- Use `mdkg goal claim [goal-id] <work-id>` only after accepting the surfaced work item; `mdkg goal next` is read-only.
- Treat goal `required_checks` as report-only guidance from mdkg. Run commands yourself, then record evidence in the goal or active work item.
- Record skill improvement candidates during normal goal execution; edit `SKILL.md` only when the active node is explicit skill-maintenance work.
- Use `mdkg skill list`, `mdkg skill search`, and `mdkg skill show <slug>` for skill discovery.
- Use `mdkg capability list/search/show` for deterministic skills, `MANIFEST.md` / legacy `SPEC.md`, `WORK.md`, core-doc, and design-doc capability discovery.
- Use `mdkg manifest list/show/validate` for focused optional `MANIFEST.md` capability records; `mdkg spec ...` remains a legacy alias for one compatibility release.
- Use `mdkg archive add/list/show/verify/compress` for committed source and artifact sidecars under `.mdkg/archive`.
- Use `mdkg work ...` helpers for semantic mirror contracts, deterministic triggers, work order status, receipt verification, and artifact registration.
- Treat work contracts, orders, and receipts as committed semantic mirrors only; never store raw secrets, credentials, live payment state, ledger mutations, or canonical marketplace state in mdkg.
- Use `artifact://...` for external/runtime-managed artifacts and `archive://...` for committed mdkg archive sidecars.
- Use `mdkg bundle create/list/show/verify` for explicit full `.mdkg` graph snapshot bundles.
- Use `mdkg subgraph add/list/verify/sync/materialize` to register child bundle snapshots as read-only planning context, refresh root-owned child bundle snapshots, and optionally generate ignored inspection trees.
- Use `mdkg capability resolve` to rank local and subgraph capabilities for orchestration planning.
- Use `mdkg subgraph sync --dry-run --json` before refreshing root-owned child bundle snapshots, then `mdkg subgraph sync --json` when the receipt is acceptable.
- Use `mdkg subgraph materialize ... --target .mdkg/subgraphs --gitignore` only for generated read-only inspection trees; never mutate materialized files.
- Use `mdkg pack <id> --visibility public|internal` only when you need a public-safe or internal-safe pack; no flag remains private-capable local behavior.
- Mark archive sidecars public only with explicit `mdkg archive add --visibility public` intent.
- Treat sidecar `.md` plus deterministic `.zip` caches as the commit-eligible archive record; validation and `mdkg archive verify` both check ZIP payload integrity.
- Before committing repos that track archive caches or `.mdkg/bundles/`, run `mdkg archive compress --all`, `mdkg archive verify --json`, `mdkg bundle create --profile private`, and `mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip`.
- Use `mdkg task start/update/done` for structured feature, task, bug, and test lifecycle fields.
- Use `mdkg upgrade` to preview scaffold updates; only run `mdkg upgrade --apply` after reviewing the receipt.
- Keep nuanced summaries, body text, and manual parent closeout edits in markdown.
- Use `mdkg event enable` only if `events.jsonl` is missing and provenance should be restored.
- Use `CLI_COMMAND_MATRIX.md` for the canonical command and flag surface.
- Run `mdkg validate` before marking work done.

## First steps

If the active task is known:
- `mdkg show <id>`
- `mdkg pack <id>`
- `mdkg task start <id>` when durable execution begins
- `mdkg validate` before closeout

If an active goal is known:
- `mdkg goal activate <goal-id>`
- `mdkg goal current`
- `mdkg goal next`
- `mdkg goal claim <work-id>`
- work the selected concrete node to completion
- run required checks and record evidence
- `mdkg goal evaluate <goal-id>`
- repeat until the goal condition is achieved, blocked, paused, or budget-limited

If the active task is not known:
- `mdkg search "..."`
- `mdkg next`
- `mdkg show <id>`
- `mdkg pack <id>`

If this is a fresh import or external docs bundle:
- create a root epic, PRD, or EDD that captures the imported context and source locations
- create follow-on tasks and tests from that root context instead of scattering untracked notes
- run `mdkg validate` after the first ingestion pass

## First-step skill

Use the canonical planning skill first when context is still being established:
- `mdkg skill show select-work-and-ground-context`

Stage-tagged discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill list --tags stage:execute --json`
- `mdkg skill list --tags stage:review --json`

Capability discovery:
- `mdkg capability list --kind skill --json`
- `mdkg capability search "<query>" --kind spec --json`
- `mdkg capability search "<query>" --kind work --json`
- `mdkg spec list --json`
- `mdkg spec show <id-or-qid-or-alias> --json`
- `mdkg spec validate <id-or-qid-or-alias> --json`
- `mdkg index` refreshes JSON compatibility caches and `.mdkg/index/mdkg.sqlite` when SQLite mode is enabled.
- `.mdkg/db` is project application state; use `mdkg db init` to create the
  generic scaffold and enable `db.enabled` without creating an active runtime
  SQLite database. Use `mdkg db migrate` after init to create or update the
  runtime SQLite database with mdkg-owned foundation plus public local
  node:sqlite queue delivery, internal event/receipt/reducer, writer lease/CAS,
  and queue control migrations. Queue state is delivery infrastructure, not
  canonical event history; use `mdkg db queue ...` to create, pause, enqueue,
  claim, settle, inspect, and drain local queues. Use
  `mdkg db queue contract --json` for the public adapter contract covering
  payload hashing, dedupe, claim order, lease-owner settlement, retry,
  dead-letter, release-expired, pause/resume, snapshot policy, and stats. Event rows are durable local
  project DB history; receipts, reducers, writer leases, and materializers are
  internal local helper surfaces, with no public `mdkg db event`,
  `mdkg db reducer`, `mdkg db lease`, or `mdkg db materializer` CLI yet. Use `mdkg db verify` and `mdkg db stats` for
  non-mutating health and summary receipts. Use `mdkg db snapshot seal` for
  explicit sealed checkpoints; default queue policy is drain, and
  `--queue-policy paused` is only for intentionally paused queues,
  `mdkg db snapshot verify/status` for checkpoint health, and
  `mdkg db snapshot dump/diff` for deterministic review aids. Keep
  `.mdkg/db/runtime/` and WAL/SHM/journal/lock/temp files ignored unless a
  sealed artifact policy explicitly says otherwise.

## Product-specific conventions

Codex / OpenAI:
- `AGENTS.md` is the product-facing wrapper doc
- `.agents/skills/` mirrors canonical skills from `.mdkg/skills/`

Claude:
- `CLAUDE.md` is the product-facing wrapper doc
- `.claude/skills/` mirrors canonical skills from `.mdkg/skills/`

mdkg remains canonical:
- `.mdkg/skills/` is the only source of truth for project skills
- mirrored skill folders are outputs, not edit locations
- mdkg does not execute skill scripts; runtimes decide whether to use them

## Core loop

Use this loop for normal work:
1. identify the work item
2. build a deterministic pack
3. execute with the smallest sufficient context
4. update structured task state with `mdkg task ...` and keep narrative/body edits in markdown
5. rely on the default JSONL event log and use `mdkg event enable` only if the file is missing
6. validate before closing work

## Closeout guidance

- Use `mdkg task done <id> --checkpoint "<title>"` when a task closes at a milestone boundary or needs durable narrative memory.
- Prefer checkpoints for parent closeout summaries:
  - feat closeout should summarize direct child work with `parent: <feat-id>`
  - epic closeout should summarize descendant work with `epic: <epic-id>`
- Parent status edits remain manual; mdkg does not yet provide a dedicated parent closeout command.
- If `events.jsonl` is missing, `mdkg task start` and `mdkg task done` will remind you how to recreate it.

## Editing boundary

- Use `mdkg task ...` for structured field changes such as status, priority, artifacts, refs, tags, blockers, and skills.
- Edit markdown directly for narrative body content, nuanced summaries, and manual parent-node closeout updates.
- Files outside mdkg-managed skill mirrors, such as local tool permission files, are not managed by mdkg unless documented explicitly.

## Repo-specific commands

Build and verification:
- `npm run build`
- `npm run test`
- `npm run cli:snapshot`
- `npm run cli:check`
- `npm run smoke:upgrade`
- `npm run smoke:capabilities`
- `npm run smoke:db`
- `npm run smoke:db-queue`
- `npm run smoke:db-queue-cli`
- `npm run smoke:db-events`
- `npm run smoke:db-materializer`
- `npm run smoke:db-snapshot`
- `npm run smoke:archive-work`
- `npm run smoke:work-invocation`
- `npm run smoke:bundle`
- `npm run smoke:subgraph`
- `npm run smoke:visibility`
- `npm run smoke:sqlite`
- `npm run smoke:parallel`
- `npm run docs:check`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`

When you need a full command reference, use `CLI_COMMAND_MATRIX.md` or `mdkg help <command>`.

mdkg.dev launch-readiness source lives in this repo:
- `mdkg-dev/` is the Astro static-site subproject.
- `docs/` is the Starlight docs subproject and repo-first documentation source plus generated command-reference output.
- `examples/` contains local mdkg demo/template graphs registered as private read-only subgraphs.
- These directories are source/launch assets, not npm package runtime payload.
- Do not deploy, activate analytics, change DNS, promote demo subdomains, publish, tag, or push unless explicitly requested.

Discovery and show commands also support structured exports when an agent needs machine-readable output:
- `--json`
- `--xml`
- `--toon`
- `--md`
