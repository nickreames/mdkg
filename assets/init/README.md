# mdkg Workspace Guide

This repository is initialized for mdkg.

mdkg is pre-v1 public alpha software. Graph, cache, bundle, and DAL contracts may change quickly before v1.

## Layout

- `core/`: rules, operating guide, and pinned docs
- `design/`: product/engineering decision records
- `work/`: epics, tasks, bugs, tests, spikes, checkpoints
- `templates/`: default node templates
- `archive/`: sidecar metadata and deterministic compressed source/artifact caches
- `bundles/`: optional committed full graph snapshot bundles
- `index/`: generated JSON caches plus optional commit-eligible `mdkg.sqlite`
- `db/`: future project application database layout and receipts
- `pack/`: generated context packs (do not commit)

## Next Commands

```bash
mdkg upgrade
mdkg index
mdkg new task "..." --status todo --priority 1
mdkg search "..."
mdkg show <id>
mdkg pack <id>
mdkg handoff create <id-or-qid> --json
mdkg capability search "..."
mdkg spec list --json
mdkg archive list
mdkg bundle create --profile private
mdkg graph clone .mdkg/bundles/private/all.mdkg.zip --target demos/demo-1 --json
mdkg subgraph list --json
mdkg status --json
mdkg fix plan --json
mdkg validate
```

This repo is already initialized. Use `mdkg upgrade` to preview safe scaffold updates, `mdkg index` to create or refresh generated graph/skill/capability/subgraph and SQLite caches after init, `mdkg new` to create work, `mdkg new goal "..."` plus `mdkg goal activate/current/next/claim/evaluate` for recursive long-running objectives, `mdkg search`/`mdkg show` to inspect graph state, `mdkg capability ...` to inspect cached skill/spec/work/core/design capabilities, `mdkg spec ...` for focused optional SPEC records, `mdkg capability resolve ...` to rank local and subgraph capabilities, `mdkg archive ...` to register source/artifact sidecars, `mdkg work ...` to create work contract/order/receipt semantic mirrors and deterministic trigger/verification records, `mdkg bundle ...` to create full graph snapshot bundles, `mdkg graph ...` to clone/fork/import authored graph templates, `mdkg subgraph ...` to register read-only child graph planning views, `mdkg pack <id>` to build deterministic context, `mdkg handoff create <id-or-qid> --json` to create a sanitized copy-ready agent handoff prompt, and `mdkg validate` before closeout.

`mdkg handoff create` summarizes goal/work state, included pack nodes, latest
checkpoint, boundaries, required checks, next actions, and raw-content marker
warnings without copying raw node bodies into the prompt. Use `--out` to write
the handoff artifact inside the repo root.

For large historical graphs, `mdkg validate --changed-only --json` keeps warning review focused on changed `.mdkg` files while full graph errors still run. `mdkg format --headings --dry-run --json` previews missing recommended heading additions before `--apply`.

Use `mdkg status --json` for a read-only operator summary of Git, graph,
selected-goal, project DB, and generated-cache health before mutating work. Use
`mdkg doctor --strict --json` for typed diagnostic checks in CI or agent
orchestration. These commands inspect state; they do not apply repairs. After a
fresh init, run `mdkg index` first so strict doctor can load generated caches.

Use `mdkg fix plan --json` for dry-run repair guidance. It reports generated
index/cache repair hints, missing graph references, and duplicate local ids as
receipt-shaped planned changes with risk levels and per-change
`apply_supported` metadata. Duplicate-ID graph repairs can be applied with
`mdkg fix apply --family ids --json` or `mdkg fix ids --apply --json`; use
`--base-ref main` when mainline IDs should win. Index/cache and graph-reference
findings remain review-only. For unresolved Git add/add conflicts, `fix ids`
keeps stage 2 at the conflicted path, rewrites stage 3 to the next unused
canonical ID/path, and records a receipt.

Use research spikes for investigation and planning work that should produce a
reviewable recommendation before implementation:

```bash
mdkg new spike "research docs launch workflow" --status todo --priority 1
mdkg task start spike-1
mdkg show spike-1
```

Spikes use the existing task lifecycle and goal routing. They do not perform web
search, execute research, create follow-up nodes, or generate `SKILL.md` files
automatically. Record sources, findings, recommendations, follow-up node ideas,
and skill candidates in the spike body, then create follow-up tasks or tests
intentionally with `mdkg new task ...` or `mdkg new test ...`.

Agent workflow docs can use semantic ids:

```bash
mdkg new spec "image worker" --id agent.image-worker
mdkg new work "generate image" --id work.generate-image
```

`SPEC.md` is optional. Repos without SPEC files still validate. When present,
SPEC records describe reusable capability surfaces rather than general planning
notes. `mdkg spec list/show/validate` is the focused SPEC command family, while
`mdkg capability ...` remains the broader read-only discovery surface for
skills, SPECs, WORK contracts, core docs, and design docs.

Read `AGENT_START.md` first when this repo includes it.

## Pack Profiles

- `--pack-profile standard`: full body (current default behavior)
- `--pack-profile concise`: summary body with code stripped by default
- `--pack-profile headers`: metadata-only body (`none`)

`--max-tokens` is a heuristic limit based on `chars / 4`.

## Safety

Ensure ignore files include:

- `.mdkg/index/*.json`
- `.mdkg/index/*.tmp`
- `.mdkg/index/write.lock/`
- `.mdkg/index/*.sqlite-wal`
- `.mdkg/index/*.sqlite-shm`
- `.mdkg/index/*.sqlite-journal`
- `.mdkg/db/runtime/`
- `.mdkg/db/**/*.sqlite-wal`
- `.mdkg/db/**/*.sqlite-shm`
- `.mdkg/db/**/*.sqlite-journal`
- `.mdkg/db/**/*.lock`
- `.mdkg/db/**/*.tmp`
- `.mdkg/pack/`
- `.mdkg/archive/**/source/`

Fresh mdkg workspaces default to `index.backend: sqlite`; `.mdkg/index/mdkg.sqlite` is a rebuildable cache and may be committed when the repo intentionally tracks it and it stays reasonably small.

`.mdkg/db` is reserved for project application database state, separate from
`.mdkg/index`. Run `mdkg db init` to create the generic scaffold, write
`.mdkg/db/project-db.json`, and enable `db.enabled`; it does not create an
active runtime SQLite database. Run `mdkg db migrate` after init to create or
update the active runtime SQLite database with mdkg-owned foundation plus public
local node:sqlite queue delivery, internal event/receipt/reducer, writer
lease/CAS, and queue control migrations. Queue state is delivery
infrastructure, not canonical event history; use `mdkg db queue ...` to create,
pause, enqueue, claim, settle, inspect, and drain local queues. Event rows are
durable local project DB history; receipts, reducers, writer leases, and
materializers are internal local helper surfaces, with no public `mdkg db event`,
`mdkg db reducer`, `mdkg db lease`, or `mdkg db materializer` CLI yet.
`mdkg db queue contract --json` returns the read-only public adapter contract
for canonical payload hashing, dedupe keys, oldest-ready claim order,
lease-owner checked settlement, retry/dead-letter behavior, release-expired,
pause/resume, snapshot queue policy, and stats. Use `mdkg db verify` for non-mutating health checks and
`mdkg db stats` for table counts, DB size, migration state, and receipt-file
counts. Use `mdkg db snapshot seal` to create an opt-in sealed checkpoint under
`.mdkg/db/state`; the default queue policy is drain, and
`--queue-policy paused` is only for intentionally paused queues. Then use
`mdkg db snapshot verify/status` for integrity and freshness checks. Use `mdkg db snapshot dump/diff` as deterministic review aids
for SQLite snapshots. Keep active runtime DB files and transient
WAL/SHM/journal, lock, and temp files ignored. Commit schema files, manifests,
receipts, and sealed state snapshots only by explicit repo policy.

Recommended:

```bash
mdkg init --update-gitignore --update-npmignore
```

## Upgrade

`mdkg upgrade` previews safe scaffold updates for existing workspaces and writes nothing by default.

Use `mdkg upgrade --apply` only after reviewing `safe_to_apply`, `will_write_paths`, and `apply_side_effects` in the receipt. Local customizations are preserved and reported instead of overwritten. Missing built-in templates can be loaded from the installed package as a read-only fallback until you vendor them with upgrade.

## Snapshot Bundles

Create explicit full `.mdkg` graph snapshots with:

```bash
mdkg archive compress --all
mdkg archive verify --json
mdkg bundle create --profile private
mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip
```

Use this as a pre-commit recommendation only when the repo tracks archive caches or `.mdkg/bundles/`. Private bundles are local graph transport artifacts and may be tracked in private repos when configured. Public bundles require selected workspaces with `visibility: public` and fail closed when public records reference private graph, archive, or subgraph records.

Clone or fork an authored graph into a separate repo/workspace while preserving IDs:

```bash
mdkg graph clone .mdkg/bundles/private/all.mdkg.zip --target demos/demo-1 --json
mdkg graph fork templates/website-template-mdkg --target demos/live-build --start-goal goal-1 --json
```

Import a template graph into the current repo with deterministic ID and link rewrites:

```bash
mdkg graph import-template templates/website-template-mdkg --start-goal goal-1 --select-goal --dry-run --json
mdkg graph import-template templates/website-template-mdkg --start-goal goal-1 --select-goal --apply --json
```

`graph clone` and `graph fork` preserve IDs because the target is a separate graph namespace. `graph import-template` rewrites canonical numeric IDs for same-repo imports and requires `--id-prefix` for colliding semantic IDs. With `--select-goal --apply`, import-template activates the rewritten imported start goal, pauses competing active root goals, validates the graph, and then writes selected-goal state. Subgraphs remain read-only planning views; use `mdkg graph ...` when authored graph state should be created.

Register child bundle snapshots as read-only subgraphs with:

```bash
mdkg subgraph add child_repo child-repo/.mdkg/bundles/private/all.mdkg.zip --source-path child-repo
mdkg capability resolve "child capability" --json
mdkg subgraph verify child_repo --json
mdkg subgraph audit child_repo --target .mdkg/subgraphs --json
mdkg subgraph upgrade-plan child_repo --json
```

Use `mdkg subgraph audit child_repo --target .mdkg/subgraphs --json` to inspect source-path Git state, dirty tracked child files, bundle validity/freshness, root-owned bundle-path safety, optional materialized-target marker safety, and count-only capability summaries. Use `mdkg subgraph upgrade-plan child_repo --json` for a read-only downstream plan; it returns `apply_supported: false`.

Use `mdkg subgraph sync child_repo --dry-run --json` before writing a refreshed root-owned child bundle snapshot, then `mdkg subgraph sync child_repo --json` when the receipt is acceptable. `sync` inspects the configured child Git repo `source_path`, refuses dirty tracked changes by default, verifies the new bundle, and records `source_repo` as `<branch>@<sha>` without committing, pulling, pushing, checking out, resetting, or mutating child mdkg Markdown.

Use `mdkg subgraph materialize child_repo --target .mdkg/subgraphs --gitignore --json` only when you need a generated read-only inspection tree. Materialized views are local generated state and are not root graph nodes.

Subgraph nodes use the subgraph alias as their qid prefix and can be inspected or packed, but mutations must happen in the owning child repo.

Launch a local read-only MCP server when an MCP-capable agent should inspect this graph without receiving mutation tools:

```bash
mdkg mcp serve --stdio --root /path/to/repo
```

The MCP server is stdio-only in this release. It exposes read-only tools for status, workspace/subgraph listing, search, show, in-memory pack generation, goal current/next, and validation. It does not expose task updates, goal activation, graph import, queue, event, archive, format, SQL, shell, arbitrary file reads, filesystem mutation, environment variables, or secret access. Future mutation allowlists remain design work.

## Archive and Work Mirrors

Archive source/artifact files with:

```bash
mdkg archive add <file> --id archive.example --kind source --visibility private
mdkg archive verify archive://archive.example
```

`mdkg validate` and `mdkg archive verify` both check the archive sidecar contract and deterministic ZIP payload integrity. Raw local archive source copies under `.mdkg/archive/**/source/` are ignored by default; sidecar `.md` files and ZIP caches are the commit-eligible evidence. Outside-repo sources are recorded as `external:<basename>`, and `mdkg doctor` warns about large ZIP caches using `archive.large_cache_warning_bytes` from `.mdkg/config.json`.

Use work lifecycle helpers for semantic mirrors only:

```bash
mdkg work contract new "example capability" --id work.example --agent-id agent.example --kind example --inputs prompt:text:required --outputs result:text:required
mdkg work trigger work.example --id order.example-1 --requester user://example
mdkg work order status order.example-1 --json
mdkg work receipt new "example receipt" --id receipt.example-1 --work-order-id order.example-1 --outcome success
mdkg work receipt verify receipt.example-1 --json
```

Create a manual order instead of a trigger-created order when you need to supply
input refs at order creation time:

```bash
mdkg work order new "example request" --id order.example-manual --work-id work.example --requester user://example --input-refs archive://archive.example
```

Receipt statuses are `recorded`, `verified`, `rejected`, and `superseded`.
Update and artifact commands accept local ids or local qids; subgraph qids are read-only and must be changed in their source workspace.

`mdkg work trigger` creates a deterministic submitted `WORK_ORDER.md` from a
WORK contract or a SPEC with exactly one resolvable work contract. `mdkg work
order status` and `mdkg work receipt verify` are read-only review helpers.
`mdkg work validate [<id-or-qid>] [--type spec|work|work_order|receipt|feedback|dispute|proposal] --json`
is a read-only focused validator for agent workflow mirrors with typed diagnostics
and raw secret, prompt, token, or payload marker warnings.
`mdkg work trigger --enqueue <queue>` optionally writes a local project DB queue
delivery message after the queue has been explicitly created and is active; it
still does not execute work.

Production orders, receipts, feedback, disputes, payments, ledgers, marketplace inventory, fulfillment records, and execution state remain canonical outside mdkg. mdkg stores committed semantic mirrors and reviewable evidence. Do not store raw secrets, credentials, live payment state, ledger mutations, canonical marketplace state, or bulky raw payloads in these mirrors.

Use `artifact://...` for external or runtime-managed artifact identities. Use `archive://...` only for committed mdkg archive sidecars.
