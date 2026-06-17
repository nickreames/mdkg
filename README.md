# mdkg

mdkg is a local-first CLI for turning structured Markdown into deterministic project memory.

It is built for:
- human builders who want project truth and task state in git
- AI agents that need deterministic context instead of ad-hoc file reading
- human + agent pairs who want one shared source of truth

mdkg stays deliberately boring:
- repo-native under `.mdkg/`
- TypeScript + Node.js `>=24.15.0`
- zero third-party runtime dependencies
- first-class rebuildable SQLite cache through built-in `node:sqlite`
- no daemon, hosted index, or vector DB

Current package version in source: `0.3.4`

mdkg is still pre-v1 public alpha software. The public package is usable, but graph, cache, bundle, and DAL contracts may continue to change quickly while the project converges on a stable v1 surface.

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
mdkg init --agent
mdkg index
```

This is the canonical AI-agent bootstrap path. It creates `.mdkg/`, `AGENT_START.md`, `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `CLI_COMMAND_MATRIX.md`, strict-node `SOUL.md` / `HUMAN.md`, the three default mdkg usage skills, `events.jsonl`, the skill registry, core pin updates, and mirrored skill folders under `.agents/skills/` and `.claude/skills/`. It also updates `.gitignore` / `.npmignore` by default. Use `--no-update-ignores` to opt out of those ignore-file updates.

Run `mdkg index` after a fresh init before using `mdkg status --json` or
`mdkg doctor --strict --json` as health gates. Init writes source scaffold
files; indexing creates the generated graph, skill, capability, subgraph, and
SQLite caches that strict doctor expects.

For a non-agent markdown graph only, run `mdkg init`.

Preview safe scaffold upgrades in an existing mdkg workspace:

```bash
mdkg upgrade
mdkg upgrade --json
```

Apply only after reviewing the receipt:

```bash
mdkg upgrade --apply
```

Upgrade is intentionally conservative. It creates missing managed startup docs and templates, updates unchanged mdkg seed assets, and preserves customized docs, templates, skills, and core files as reported preserved customizations. Review `safe_to_apply`, `will_write_paths`, and `apply_side_effects` in the JSON receipt before applying. Agent-enabled workspaces can receive safe default skill upgrades and skill mirror refreshes; ignored event logs are skipped with guidance to run `mdkg event enable` if provenance should be restored.

Older workspaces can continue to inspect and validate current graph nodes before applying an upgrade. When local templates are missing for newly introduced built-in mdkg types, mdkg uses the installed package's bundled templates as a read-only schema fallback and warns that `mdkg upgrade --apply` can vendor the missing templates.

Create a task:

```bash
mdkg new task "bootstrap cli" --status todo --priority 1 --tags cli,build
```

Create a recursive goal for long-running agent work:

```bash
mdkg new goal "reach prepublish readiness"
mdkg goal show goal-1 --json
mdkg goal next goal-1
mdkg goal evaluate goal-1 --json
```

Goal nodes capture a measurable end condition, recursive loop state, required skills, required checks, and completion evidence. They guide agent harnesses through repeated graph-backed progress, while tasks, bugs, tests, spikes, and features remain the concrete executable work units. In this release `mdkg goal evaluate` is report-only: it lists required checks and evidence state, but does not execute scripts.

Create a research spike when the next useful work is investigation, planning,
or grounding a future implementation:

```bash
mdkg new spike "research mdkg.dev launch guide" --status todo --priority 1
mdkg task start spike-1
mdkg show spike-1
```

Spikes are task-like work nodes, not autonomous research agents. mdkg does not
perform web search, execute research, create follow-up nodes, or generate
`SKILL.md` files automatically. Record sources, findings, tradeoffs,
recommendations, follow-up node ideas, and skill candidates in the spike body,
then create follow-up work intentionally:

```bash
mdkg new task "write mdkg.dev quickstart guide" --parent spike-1 --status todo --priority 1
mdkg new test "validate mdkg.dev docs examples" --parent spike-1 --status todo --priority 1
mdkg new task "author mdkg.dev launch planning skill" --parent spike-1 --status todo --priority 2
```

Create an agent workflow document with a semantic portable id:

```bash
mdkg new spec "image worker" --id agent.image-worker
mdkg new work "generate image" --id work.generate-image
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
mdkg pack task-1 --visibility public --dry-run
```

Create a full `.mdkg` graph snapshot bundle for root or child orchestration:

```bash
mdkg archive compress --all
mdkg archive verify --json
mdkg bundle create --profile private
mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip
mdkg bundle list --json
```

Bundles are explicit graph transport artifacts, separate from task context packs. Before a commit in repos that track archives or bundles, refresh compressed archive caches first, then create the private bundle so the committed graph state is self-consistent. Private bundles are the default and may be committed in private repos when configured. Public bundles require at least one selected workspace with `visibility: public` and include only public workspace content and public archive sidecars; bundle creation fails if public content points at private graph, archive, or subgraph records.

Register a child repo bundle as a read-only subgraph planning view:

```bash
mdkg subgraph add child_repo .mdkg/bundles/private/subgraphs/child_repo.mdkg.zip --source-path projects/child_repo
mdkg subgraph list --json
mdkg search "child capability"
mdkg show child_repo:work.example
mdkg pack child_repo:work.example --dry-run --stats
mdkg capability resolve "child capability" --json
mdkg subgraph verify child_repo --json
mdkg subgraph audit child_repo --target .mdkg/subgraphs --json
mdkg subgraph upgrade-plan child_repo --json
```

When the child repo is available under a configured root-relative `source_path`, refresh the root-owned bundle snapshot explicitly:

```bash
mdkg subgraph sync child_repo --dry-run --json
mdkg subgraph sync child_repo --json
```

`audit` is read-only and reports source-path Git state, dirty tracked child files, bundle validity/freshness, root-owned bundle-path safety, optional materialized-target marker safety, and count-only capability summaries. `upgrade-plan` is also read-only, returns `apply_supported: false`, and proposes safe sync/verify/materialize next steps without writing bundles or child files.

`sync` inspects the child Git repo, refuses dirty tracked changes by default, builds the configured private/public bundle into the root-owned source path, verifies it, and records `<branch>@<sha>` in `source_repo`. It never commits, pulls, pushes, checks out, resets, or mutates child mdkg Markdown. Use `--allow-dirty` only when the dirty state is intentional and must be recorded in the receipt.

Generate a local read-only inspection tree when humans need to browse extracted child graph files:

```bash
mdkg subgraph materialize child_repo --target .mdkg/subgraphs --clean --gitignore --json
```

Materialized trees are generated local state, ignored by graph indexing/search/validation/packing/bundles/SQLite hydration, and protected by a `.mdkg-materialized.json` marker before clean replacement.

Subgraph nodes are projected under the subgraph alias, for example `child_repo:task-1`. They are available to `list`, `search`, `show`, `pack`, capability discovery, and `capability resolve`, but remain read-only; mutate the child repo and sync its root-owned bundle snapshot to change subgraph content. Root-authored relationship and reference fields can point at configured subgraph qids such as `child_repo:work.example`; local ownership fields such as `epic`, `parent`, `prev`, and `next` stay local-only. Stale subgraphs warn during planning reads and fail `mdkg subgraph verify`. Public or internal subgraphs must be backed by public bundle profiles; private subgraphs stay private planning context.

Validate before handoff or commit:

```bash
mdkg validate
```

Discover cached capability surfaces:

```bash
mdkg index
mdkg capability list --kind skill --json
mdkg capability search "image worker" --kind work --json
mdkg capability show <id-or-qid-or-slug> --json
mdkg spec list --json
mdkg spec show <id-or-qid-or-alias> --json
```

`SPEC.md` is optional. Repos with no SPEC files still validate; when present,
SPEC records describe reusable capability surfaces rather than general planning
notes. `mdkg spec list/show/validate` is the focused SPEC command family, while
`mdkg capability ...` remains the broader read-only discovery surface for
skills, SPECs, WORK contracts, core docs, and design docs.

Register source and artifact files as committed archive sidecars:

```bash
mdkg archive add ./inputs/key_input_doc.pdf --id archive.key-input-doc --kind source --visibility private
mdkg archive verify archive://archive.key-input-doc
mdkg archive list --json
```

Create semantic mirror work contracts, orders, receipts, and artifacts:

```bash
mdkg work contract new "generate image" --id work.generate-image --agent-id agent.image-worker --kind image_generation --inputs prompt:text:required --outputs image_url:url:required
mdkg work trigger work.generate-image --id order.generate-image-1 --requester user://example
mdkg work order status order.generate-image-1 --json
mdkg work receipt new "generate image receipt" --id receipt.generate-image-1 --work-order-id order.generate-image-1 --outcome success --receipt-status recorded
mdkg work receipt verify receipt.generate-image-1 --json
mdkg work artifact add receipt.generate-image-1 ./outputs/image.png --id archive.generated-image --kind artifact
```

Create a manual order instead of a trigger-created order when you need to supply
input refs at order creation time:

```bash
mdkg work order new "generate image request" --id order.generate-image-manual --work-id work.generate-image --requester user://example --input-refs archive://archive.key-input-doc
```

Receipt statuses are `recorded`, `verified`, `rejected`, and `superseded`.
Update and artifact commands accept local ids or local qids; subgraph qids are read-only and must be changed in their source workspace.

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
- [`AGENT_START.md`](AGENT_START.md)
- [`llms.txt`](llms.txt)
- [`PACK_EXAMPLES.md`](PACK_EXAMPLES.md)
- [`CLI_COMMAND_MATRIX.md`](CLI_COMMAND_MATRIX.md)
- [`COVERAGE_HARDENING_MATRIX.md`](COVERAGE_HARDENING_MATRIX.md)
- [`CHANGELOG.md`](CHANGELOG.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Repository shape

mdkg lives under a hidden root directory:
- `.mdkg/core/` rules and pinned docs
- `.mdkg/design/` product, design, and decision docs
- `.mdkg/work/` tasks, bugs, tests, spikes, epics, checkpoints
- `.mdkg/templates/` templates used by `mdkg new`
- `.mdkg/skills/` Agent Skills packages
- `.mdkg/archive/` sidecar metadata plus deterministic compressed source/artifact caches
- `.mdkg/bundles/` optional committed full graph snapshot bundles
- `.mdkg/index/mdkg.sqlite` optional committed, rebuildable SQLite access cache
- `.mdkg/index/subgraphs.json` generated read-only subgraph projection cache
- `.mdkg/db/` future project application database layout and receipts
- `.mdkg/subgraphs/` generated materialized subgraph inspection trees
- `.agents/skills/` Codex/OpenAI-facing mirrored skills
- `.claude/skills/` Claude-facing mirrored skills
- `.mdkg/index/*.json` generated JSON compatibility cache files

## Primary commands

These are the commands new users and agents should learn first:
- `mdkg init`
- `mdkg upgrade`
- `mdkg new`
- `mdkg search`
- `mdkg show`
- `mdkg next`
- `mdkg pack`
- `mdkg skill`
- `mdkg capability`
- `mdkg spec`
- `mdkg archive`
- `mdkg work`
- `mdkg goal`
- `mdkg task`
- `mdkg validate`
- `mdkg status`
- `mdkg fix`

Advanced / maintenance commands still exist, but they are not the first-run story:
- `mdkg event`
- `mdkg checkpoint`
- `mdkg index`
- `mdkg guide`
- `mdkg format`
- `mdkg doctor --strict --json`
- `mdkg fix plan --json`
- `mdkg workspace`

## Operator health

Use `mdkg status --json` for a read-only operator summary before mutating a
repo. It reports package/release state, Git cleanliness, graph validity,
selected-goal state, project DB verification state, and generated cache
freshness without rebuilding indexes, running migrations, repairing files, or
changing selected-goal state.

Use `mdkg doctor --strict --json` when a CI job or agent needs actionable
typed checks. Strict doctor keeps the existing diagnostic command read-only and
adds stable check fields: `id`, `status`, `severity`, `message`,
`remediation`, and optional `refs`. Strict mode fails on invalid graph state,
stale generated graph/capability cache state, stale or achieved selected-goal
state, and enabled project DB verification failures. Warnings such as dirty
runtime DB files, archive size guidance, and bundle handoff guidance remain
warnings unless their underlying check fails.

Use `mdkg fix plan --json` when you want repair guidance without mutation. It
emits a receipt-shaped plan for generated index/cache repair, missing graph
references, and duplicate local ids. Planned changes include affected paths,
risk, reason codes, command hints, and per-change `apply_supported` metadata.
Duplicate-ID graph repairs can be applied with
`mdkg fix apply --family ids --json` or `mdkg fix ids --apply --json`; use
`--base-ref main` when mainline IDs should win. Index/cache and graph-reference
findings remain review-only. For unresolved Git add/add conflicts, `fix ids`
keeps stage 2 at the conflicted path, rewrites stage 3 to the next unused
canonical ID/path, and records a receipt.

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

Optional skill metadata with prefixes such as `ochatr_*` is treated as vendor extension data. Structured skill output exposes it under `extensions.ochatr` while keeping the top-level `ochatr` field as a compatibility alias introduced in 0.0.9. ochatr.ai is a pioneering adopter of this extension pattern, not the name of the base mdkg standard.

## Capability cache

mdkg maintains `.mdkg/index/capabilities.json` as a derived access cache for deterministic capability surfaces:
- skills from `.mdkg/skills/**/SKILL.md`
- `SPEC.md`
- `WORK.md`
- core docs
- design docs

The capability cache is not the full graph and is not source of truth. Normal tasks, epics, bugs, tests, feats, and checkpoints remain in the standard graph index. Markdown remains authoritative; deleting the cache is recoverable with `mdkg index` or by running a capability command when auto-reindex is enabled.

Capability records aggregate enabled registered workspaces and include deterministic source metadata such as `workspace`, `visibility`, `kind`, `id`, `qid`, `path`, headings, refs, source hash, and `indexed_at`. SPEC and WORK records also expose read-only `linkage` arrays when related work contracts, work orders, and receipts exist, so an orchestrator can discover a capability from reusable surface to invocation evidence without loading the full graph. Workspace `visibility` also feeds mdkg's export safety checks for public/internal packs and public bundles. This is a CLI safety layer, not secret scanning, body redaction, or a replacement for private git hosting.

## Index backends and parallel safety

Fresh `mdkg init` workspaces default to `index.backend: sqlite`, which writes `.mdkg/index/mdkg.sqlite` as a rebuildable access cache using Node's built-in `node:sqlite`. Existing workspaces that are migrated from older configs default to `index.backend: json` until they opt in. Markdown files, archive sidecars, bundle manifests, and config remain source of truth in both modes.

`mdkg index` still writes JSON compatibility caches (`global.json`, `skills.json`, `capabilities.json`, and subgraph projections when configured). In SQLite mode it also rebuilds the SQLite cache with nodes, edges, skills, capabilities, archive metadata, subgraphs, source hashes, and schema metadata. Deleting the SQLite file is recoverable with `mdkg index`.

Mutating commands use a workspace mutation lock plus atomic writes. SQLite mode additionally reserves numeric ids in a SQLite transaction before writing Markdown so parallel `mdkg new` and checkpoint calls avoid naming conflicts. Skipped ids after failed writes are acceptable because Markdown remains canonical.

## Project DB Layout

`.mdkg/db` is reserved for project application database state, separate from
the rebuildable `.mdkg/index` graph cache. Run `mdkg db init` to create the
generic scaffold and explicitly enable `db.enabled` in config. The generic
layout is `.mdkg/db/schema`, `.mdkg/db/runtime`, `.mdkg/db/state`, and
`.mdkg/db/receipts`; `mdkg db init` also writes a deterministic
`.mdkg/db/project-db.json` manifest.

Runtime DB files, WAL, SHM, journal, lock, and temp files are ignored by
default. `mdkg db init` does not create an active runtime SQLite database.
Run `mdkg db migrate` after init to create or update the active runtime
SQLite database at the configured `db.runtime_path`; built-in migrations write
mdkg-owned generic foundation tables, public local node:sqlite queue delivery
tables, internal local event/receipt/reducer tables, writer lease/CAS tables,
and queue control state, then record migration order, checksums, and applied
timestamps. Queue state is durable local delivery infrastructure, not canonical
event history. Use `mdkg db queue create|pause|resume|enqueue|claim|ack|fail|dead-letter|release-expired|stats|list|show`
to operate local project queues. Paused queues reject enqueue/claim while still
allowing ack/fail/dead-letter/release-expired so leased work can settle. Event
rows are durable local project DB history; receipts, reducers, writer leases,
and materializers remain internal helper surfaces in this release, with no
public `mdkg db event`, `mdkg db reducer`, `mdkg db lease`, or
`mdkg db materializer` CLI yet.
`mdkg work trigger --enqueue <queue>` can bridge a submitted work order mirror
into an explicitly created active project DB queue; it writes local delivery
state only and never executes work.
Use `mdkg db verify` for non-mutating health checks over config, layout,
runtime SQLite integrity, migration metadata, and transient runtime files. Use
`mdkg db stats` for deterministic table counts, DB size, migration state,
receipt-file count, and state snapshot presence.
Use `mdkg db snapshot seal` to create an explicit sealed checkpoint at
`.mdkg/db/state/project.sqlite` with `.mdkg/db/state/project.manifest.json`.
The default queue policy is `--queue-policy drain`, which requires no ready or
leased queue messages. Use `--queue-policy paused` only when ready messages are
intentionally preserved in paused queues; leased messages always block sealing.
Use `mdkg db snapshot verify` and `mdkg db snapshot status` for checkpoint
health, and use `mdkg db snapshot dump` / `mdkg db snapshot diff` as
deterministic review aids for SQLite snapshots instead of comparing raw binary
bytes.
Schema files, manifests, receipt artifacts, and opt-in sealed snapshots remain
commit-eligible by explicit repo policy. `mdkg doctor` warns when active runtime
or transient project DB files are present so they are not accidentally committed
as sealed state.

## Goal nodes

Goal nodes are durable recursive objective contracts. Use `mdkg new goal "<objective>"` when a human or agent needs to keep working across multiple concrete nodes until a measurable end condition is achieved.

`goal` is work-like but distinct from `task`: it can have status, priority, graph links, skills, explicit `scope_refs`, and structured goal fields, but normal `mdkg next` does not select goals. Use `mdkg goal activate <goal-id>` to make one local root goal active, pause competing local active goals, and select it for future `goal next` calls. Use `mdkg goal select <goal-id>` only when you want to change the local ignored selected-goal pointer without changing lifecycle state. `mdkg goal next <goal-id>` remains available for explicit selection. Epics organize goal scope recursively but are not returned as executable work.

Use `mdkg goal claim [goal-id] <work-id>` to durably set `active_node` after choosing the next scoped item. `goal next` is read-only. Use `mdkg goal pause|resume|done` to update goal state after review, and `mdkg goal archive` for superseded historical roadmap goals that should remain readable but non-actionable.

Required checks are stored as report-only guidance. Agents should run the checks themselves, record evidence in the goal or active work item, then use `mdkg goal evaluate` to summarize the current evidence state. During normal goal execution, skill improvements should be recorded as improvement candidates or proposal nodes; edit `SKILL.md` files only when the active node is explicit skill-maintenance work.

## Research spikes

Spikes are first-class actionable work nodes for research and planning. Use
`mdkg new spike "<question>"` when the right output is a documented
recommendation, not code. They share the existing task lifecycle:

```bash
mdkg new spike "research queue-backed materializer UX" --status todo --priority 1
mdkg task start spike-1
mdkg task update spike-1 --status review --add-refs task-250
mdkg task done spike-1
```

The default spike template includes sections for research question, context,
search plan, findings, options and tradeoffs, recommendation, follow-up nodes,
skill candidates, data-structure and algorithm notes, UX notes, security notes,
mdkg.dev launch implications, and evidence/sources.

Spikes deliberately do not expose a `mdkg spike ...` namespace in this release,
do not run browser or web-search tools, do not create tasks/tests/goals, and do
not write `SKILL.md` files. They make the research output reviewable so humans
or agents can intentionally create the next nodes with normal mdkg commands.

## Agent workflow files

mdkg recognizes a small set of canonical agent workflow documents:
- `SPEC.md` for agent, package, or runtime specifications
- `WORK.md` for reusable work contracts
- `WORK_ORDER.md` for concrete requests against work contracts
- `RECEIPT.md` for completed work output and artifacts
- `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md` for review loops

Use `mdkg new spec|work|work_order|receipt|feedback|dispute|proposal "<title>"` to scaffold them. `--id <portable-id>` is available for these types when semantic ids such as `agent.image-worker` or `work.generate-image` are preferred.

Relational templates contain editable placeholder refs. `spec` and `work` scaffold as validation-clean standalone docs; `work_order`, `receipt`, `feedback`, `dispute`, and `proposal` need real refs before strict `mdkg validate` passes.

For executable or purchasable capability mirrors, prefer the lifecycle helpers under `mdkg work ...`. They create and update `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md` semantic mirror files only. `mdkg work trigger` creates a deterministic submitted `WORK_ORDER.md` from a WORK contract or a SPEC with exactly one resolvable work contract. `mdkg work order status` and `mdkg work receipt verify` are read-only review helpers for deterministic closeout. `mdkg work trigger --enqueue <queue>` optionally writes a local project DB queue delivery message after the queue has been explicitly created and is active; it still does not execute work. Production order state, receipt state, feedback, disputes, payments, ledgers, marketplace inventory, fulfillment records, and execution state remain canonical outside mdkg, such as in Postgres or another application database. Do not store raw secrets, credentials, live payment state, ledger mutations, canonical marketplace state, or bulky raw payloads in these mirrors.

## Archive sidecars

Archive entries live under `.mdkg/archive/<archive.id>/` and are normal graph nodes with `type: archive`. `mdkg archive add` copies the source into a managed local `source/` directory, writes a frontmatter sidecar `<file>.md`, and writes a deterministic single-file ZIP cache `<file>.zip`. The original source path is left untouched.

Archive sidecars support `archive://archive.example` refs from orders, receipts, artifacts, proof refs, and other workflow metadata. `artifact://...` refs remain external or runtime-managed artifact identities; `archive://...` refs name committed mdkg archive sidecars. `mdkg validate` and `mdkg archive verify` both require the sidecar contract, ZIP cache hash, readable ZIP payload, payload SHA-256, and payload byte size to match. A missing raw local source copy is non-fatal when the committed sidecar and ZIP cache are valid.

When the source passed to `mdkg archive add` is inside the repo, `source_path` is repo-relative. Outside-repo sources are redacted to `external:<basename>` so sidecars do not leak absolute local paths.

Archive sidecar visibility defaults to `private`. Use `mdkg archive add --visibility public` only when the sidecar metadata and ZIP cache are safe for public packs or public bundles.

By default, init/upgrade ignore generated raw archive source copies with `.mdkg/archive/**/source/`; sidecar `.md` files and compressed `.zip` caches remain commit-eligible. `mdkg doctor` warns when a committed archive ZIP cache exceeds `archive.large_cache_warning_bytes` in `.mdkg/config.json` (default `26214400`; set `0` to disable). Large-cache warnings do not block archive add or validation.

## Current direction

This release includes:
- `init --agent`
- default ignore updates with `--no-update-ignores` for generated JSON index/temp/lock files, `.mdkg/pack/`, and raw archive source copies
- root-only published init seed config
- skills indexing and search/show/list support
- JSON capability cache for skills, `SPEC.md`, `WORK.md`, core docs, and design docs
- optional `mdkg spec list/show/validate` for reusable SPEC capability records
- SQLite index backend for fresh workspaces using built-in `node:sqlite`
- mutation locking and atomic writes for parallel mdkg calls
- first-class `goal` nodes and `mdkg goal show/next/evaluate/pause/resume/done`
- optional `skills: [...]` on work items
- pack-time skill inclusion
- latest-checkpoint resolver + index hint
- events JSONL validation
- XML / TOON / Markdown output for node and skill list/search/show
- agent workflow file types and semantic `mdkg new --id` support
- product-specific skill mirrors for Codex/OpenAI and Claude
- shared `AGENT_START.md` startup guidance
- conservative `mdkg upgrade` with mode-aware init manifests
- archive sidecars with deterministic ZIP caches
- semantic mirror helpers under `mdkg work ...`, including trigger/order status/receipt verification
- explicit public/internal/private visibility enforcement for packs, bundles, archives, imports, validation, and doctor diagnostics
- strict archive ZIP payload integrity checks during validation

Current direction:
- keep the OSS story generic around `mdkg init --agent`
- use base `mdkg init` only for repos that do not want agent bootstrap assets
- keep `pack <id>` at the center of the human/agent loop
- use `mdkg task ...` for structured state changes and markdown edits for narrative/body content
- make event logging guided instead of purely manual
- dogfood real skills inside the repo
- make skill authoring first-class through `mdkg skill`
- make `CLI_COMMAND_MATRIX.md` the single source of truth for the live CLI surface
- keep production execution databases canonical while mdkg stores committed semantic mirrors
- run manual behavior audits before enforcing stronger coverage thresholds

Design and decision records live in the internal graph under `.mdkg/design/`.

## Safety

mdkg is not a secret store.

Use these defaults:
- keep generated `.mdkg/index/*.json`, temp, lock, WAL, SHM, and journal files gitignored
- commit `.mdkg/index/mdkg.sqlite` only when the repo intentionally tracks a reasonably sized rebuildable access cache
- keep `.mdkg/db/runtime/` and `.mdkg/db` WAL/SHM/journal/lock/temp files gitignored
- commit `.mdkg/db/schema`, manifests, receipts, and sealed state snapshots only by explicit repo policy
- keep `.mdkg/pack/` gitignored
- keep `.mdkg/archive/**/source/` gitignored unless a repo intentionally commits raw local copies
- commit archive sidecar `.md` metadata and deterministic `.zip` caches when they are needed for reviewable evidence
- event logs are committed by default; ignore or delete them manually if a repo wants local-only provenance
- do not ship `.mdkg/` into production builds or published packages
- if an external orchestrator is writing mdkg state, keep one durable writer per run and batch commits at end-of-run or checkpoint boundaries
- do not commit on every tool call

## Contributing

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md). mdkg prefers Prompt Requests before Pull Requests: contributors can submit intent, workflows, prompts, and acceptance criteria without needing to write code first.

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
