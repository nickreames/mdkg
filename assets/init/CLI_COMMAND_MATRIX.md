# CLI Command Matrix

This file is the canonical command reference for mdkg in this repository.

Verify live help with:
- `mdkg --help`
- `mdkg help <command>`

Optional reusable SPEC capability records are accessed through `mdkg spec ...`.
Repos without SPEC files remain valid.

Primary commands:
- `mdkg init`
- `mdkg upgrade [--dry-run] [--apply] [--json]`
- `mdkg new`
- `mdkg show`
- `mdkg list`
- `mdkg search`
- `mdkg pack`
- `mdkg skill`
- `mdkg capability`
- `mdkg spec`
- `mdkg archive`
- `mdkg bundle`
- `mdkg work`
- `mdkg goal`
- `mdkg task`
- `mdkg validate`
- `mdkg status [--json]`
- `mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--json]`

Operator health:
- `mdkg status [--json]` is a read-only summary for scripts and agents
- reports mdkg version/config, git state, graph/index freshness, selected-goal state, project DB verification summary, and generated cache status
- does not rebuild indexes, run migrations, repair files, mutate graph nodes, or change selected-goal state
- `mdkg fix plan ...` is dry-run repair planning only; it writes nothing and `fix apply` is not exposed
- `fix plan --json` returns a receipt-shaped plan with selected families, risk counts, paths, reason codes, and `apply_supported: false`

Index backend:
- fresh mdkg workspaces default to `index.backend: sqlite`
- `.mdkg/index/mdkg.sqlite` is rebuildable and commit-eligible when intentionally tracked
- JSON compatibility caches remain generated and ignored by default
- `mdkg db index rebuild` writes the same derived caches as `mdkg index`
- `mdkg db index status` reports graph cache health without mutating files
- `mdkg db index verify` fails on missing, stale, corrupt, schema-mismatched, or SQLite source-fingerprint-mismatched cache state

Project database commands:
- `mdkg db index rebuild [--tolerant] [--json]`
- `mdkg db index status [--json]`
- `mdkg db index verify [--json]`
- `mdkg db init [--json]`
- `mdkg db migrate [--json]`
- `mdkg db verify [--json]`
- `mdkg db stats [--json]`
- `mdkg db queue create|pause|resume|enqueue|claim|ack|fail|dead-letter|release-expired|stats|list|show ... [--json]`
- `mdkg db snapshot seal [--queue-policy drain|paused] [--json]`
- `mdkg db snapshot verify [--json]`
- `mdkg db snapshot status [--json]`
- `mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]`
- `mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]`
- `.mdkg/db` is project application state, separate from `.mdkg/index`
- `mdkg db init` creates the generic `.mdkg/db` scaffold, writes
  `.mdkg/db/project-db.json`, enables `db.enabled`, and does not create an
  active runtime SQLite database
- `mdkg db migrate` creates or updates the configured active runtime SQLite
  database and applies mdkg-owned foundation plus internal local node:sqlite
  queue, event/receipt/reducer, and writer lease/CAS foundation migrations
- `mdkg db migrate` records migration order, checksums, and applied timestamps
  in the configured migration table
- `mdkg db queue ...` exposes durable local delivery operations backed by
  node:sqlite; queue rows are delivery state, not canonical event history
- paused queues reject enqueue and claim, but ack/fail/dead-letter and
  release-expired remain available so leased work can settle
- event tables are durable local history for project DB state transitions;
  receipts, typed reducers, writer leases, and materializers remain internal
  helper surfaces in this release, with no public `mdkg db event`,
  `mdkg db reducer`, `mdkg db lease`, or `mdkg db materializer` CLI yet
- `mdkg db verify` checks config, layout, runtime SQLite integrity, migration
  metadata, receipt directory policy, and transient runtime files
- `mdkg db stats` reports table counts, database size, migration state,
  transient runtime files, receipt-file count, and state snapshot presence
- `mdkg db snapshot seal` writes an opt-in sealed checkpoint and manifest under
  `.mdkg/db/state`; default `--queue-policy drain` requires no ready or leased
  messages, while `--queue-policy paused` allows ready messages only in paused
  queues. `snapshot verify/status/dump/diff` inspect and review that checkpoint
  without treating raw binary diffs as human-readable truth
- active `.mdkg/db/runtime/` files and `.mdkg/db` WAL/SHM/journal/lock/temp files are ignored by default

Validation commands:
- `mdkg validate [--out <path>] [--quiet] [--json]`

Node creation commands:
- `mdkg new <type> "<title>" [options] [--json]`
- `mdkg new goal "<title>" [options] [--json]`

Agent workflow file type creation:
- `mdkg new spec "<title>" [options] [--json]`
- `mdkg new work "<title>" [options] [--json]`
- `mdkg new work_order "<title>" [options] [--json]`
- `mdkg new receipt "<title>" [options] [--json]`
- `mdkg new feedback "<title>" [options] [--json]`
- `mdkg new dispute "<title>" [options] [--json]`
- `mdkg new proposal "<title>" [options] [--json]`
- `mdkg new spec "image worker" --id agent.image-worker`
- `mdkg new work "generate image" --id work.generate-image`

Agent workflow notes:
- `--id <portable-id>` is only for agent workflow file types.
- `spec` and `work` scaffold as validation-clean standalone docs.
- `work_order`, `receipt`, `feedback`, `dispute`, and `proposal` need real refs before strict `mdkg validate` passes.
- `goal` nodes capture recursive objective state and required checks, but normal `mdkg next` does not select them.

Workspace registry commands:
- `mdkg workspace ls [--json]`
- `mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]`
- `mdkg workspace rm <alias> [--json]`
- `mdkg workspace enable <alias> [--json]`
- `mdkg workspace disable <alias> [--json]`

Event log commands:
- `mdkg event enable [--ws <alias>] [--json]`
- `mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]`

Task mutation commands:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]`
- `mdkg task update <id-or-qid> [options] [--json]`
- `mdkg task done <id-or-qid> [--checkpoint "<title>"] [options] [--json]`

Checkpoint commands:
- `mdkg checkpoint new <title> [--ws <alias>] [--json]`

Agent bootstrap:
- `mdkg init --agent`
- published bootstrap config is root-only by default
- `mdkg init --agent` creates the complete startup docs, wrapper docs, default mdkg skills, event log, registry, and skill mirrors
- removed flags `--llm`, `--agents`, `--claude`, and `--omni` fail before mutation with guidance to use `mdkg init --agent`

Upgrade:
- `mdkg upgrade` previews safe scaffold updates and writes nothing by default
- `mdkg upgrade --apply` updates only managed or unchanged init assets
- JSON receipts include `safe_to_apply`, `will_write_paths`, `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`
- customized docs, templates, skills, and core files are preserved and reported
- ignored event logs are skipped with guidance to run `mdkg event enable`

Skill discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill search "<query>" --json`
- `mdkg skill show <slug> --json`
- `mdkg skill validate [<slug>] [--json]`
- `mdkg skill sync [--force] [--json]`

Capability discovery:
- `mdkg capability list [--kind <skill|spec|work|core|design>] [--visibility <private|internal|public>] [--json]`
- `mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]`
- `mdkg capability show <id-or-qid-or-slug> [--json]`
- `mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]`
- capability records are deterministic cache projections from Markdown
- records include source hash, headings, refs, and `indexed_at`
- SPEC and WORK capability records include read-only `linkage` arrays for related SPECs, work contracts, work orders, and receipts when those graph mirrors exist
- normal task, epic, feat, bug, test, and checkpoint nodes are intentionally excluded

Spec capability records:
- `mdkg spec list [--json]`
- `mdkg spec show <id-or-qid-or-alias> [--json]`
- `mdkg spec validate [<id-or-qid-or-alias>] [--json]`
- `SPEC.md` is optional; repos with no SPEC files still validate
- SPEC records describe reusable capability surfaces, not general planning notes
- `mdkg spec validate` with no ref validates the graph and all optional SPEC records
- `mdkg spec validate <ref>` also checks that the target SPEC reference exists
- `mdkg spec ...` is the focused SPEC command family; `mdkg capability ...` remains broader skill/spec/work/core/design discovery

Archive sidecars:
- `mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]`
- `mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]`
- `mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]`
- `mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]`
- `mdkg archive compress <id-or-archive-uri|--all> [--json]`
- archive sidecars are `type: archive` nodes under `.mdkg/archive`
- archive visibility defaults to `private`
- `mdkg validate` and `mdkg archive verify` both check ZIP hash, ZIP readability, payload SHA-256, and payload byte size
- outside-repo archive sources are recorded as `external:<basename>` instead of absolute local paths
- `mdkg doctor` warns about ZIP caches larger than `archive.large_cache_warning_bytes`; `0` disables the warning
- committed sidecar `.md` files and ZIP caches are source-of-truth evidence; raw source copies under `.mdkg/archive/**/source/` are ignored by default

Graph snapshot bundles:
- `mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]`
- `mdkg bundle verify [bundle-path] [--json]`
- `mdkg bundle show <bundle-path> [--json]`
- `mdkg bundle list [--json]`
- default output is `.mdkg/bundles/<profile>/<workspace-or-all>.mdkg.zip`
- private bundles are explicit local graph transport artifacts
- repos that track archive caches or bundles should run `mdkg archive compress --all`, `mdkg archive verify --json`, `mdkg bundle create --profile private`, and `mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip` before commit
- public bundles include only public workspace content and public archive sidecars
- public bundle creation fails when public records reference private graph, archive, or subgraph records

Subgraph orchestration:
- `mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--json]`
- `mdkg subgraph list [--json]`
- `mdkg subgraph show <alias> [--json]`
- `mdkg subgraph rm <alias> [--json]`
- `mdkg subgraph enable <alias> [--json]`
- `mdkg subgraph disable <alias> [--json]`
- `mdkg subgraph verify [alias|--all] [--json]`
- `mdkg subgraph refresh [alias|--all] [--json]`
- `mdkg subgraph audit [alias|--all] [--target <path>] [--json]`
- `mdkg subgraph upgrade-plan [alias|--all] [--json]`
- `mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]`
- `mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]`
- subgraphs are read-only planning views and use subgraph-alias qids such as `child_repo:task-1`
- subgraph refresh reloads configured bundle sources only and never mutates child repos
- subgraph audit reports read-only source/bundle/materialized-target safety checks
- subgraph upgrade-plan returns a read-only downstream plan with `apply_supported: false`
- subgraph sync builds root-owned bundle snapshots from configured clean child Git repo `source_path` entries
- subgraph materialize extracts generated inspection trees under a target directory; `.mdkg/subgraphs/` is local generated state
- public/internal subgraphs require public bundle profiles

Work semantic mirrors:
- `mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]`
- `mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]`
- `mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--input-refs <...>] [--requested-outputs <...>] [--json]`
- `mdkg work order status <id-or-qid> [--json]`
- `mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-artifacts <...>] [--json]`
- `mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--json]`
- `mdkg work receipt verify <id-or-qid> [--json]`
- `mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--json]`
- `mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]`
- `work trigger` accepts a `WORK.md` ref directly or a `SPEC.md` capability ref with exactly one resolvable work contract; it creates a submitted order mirror and never executes work
- example: `mdkg work trigger work.example --id order.example-1 --requester user://example --json`
- `work trigger --enqueue <queue>` requires a valid project DB plus an explicitly created active queue, creates a submitted order mirror, and enqueues a local delivery message without executing work
- `work order status` is read-only and reports deterministic order state plus linked receipts
- `work receipt verify` is read-only and reports linkage, evidence, archive ref, hash, outcome, and redaction-policy checks
- work commands mutate mdkg semantic mirror files only; production order, receipt, feedback, dispute, payment, ledger, marketplace inventory, fulfillment, and execution state remains canonical outside mdkg
- do not store raw secrets, credentials, live payment state, ledger mutations, or canonical marketplace state in work mirrors
- `artifact://...` refs identify external/runtime-managed artifacts; `archive://...` refs identify committed mdkg archive sidecars
- work update and artifact commands accept local ids or local qids; subgraph qids are read-only and must be changed in their source workspace

Goal nodes:
- `mdkg goal show <goal-id-or-qid> [--json]`
- `mdkg goal select <goal-id-or-qid> [--json]`
- `mdkg goal current [--json]`
- `mdkg goal clear [--json]`
- `mdkg goal next [goal-id-or-qid] [--json]`
- `mdkg goal claim [goal-id-or-qid] <work-id-or-qid> [--json]`
- `mdkg goal evaluate <goal-id-or-qid> [--json]`
- `mdkg goal pause|resume|done <goal-id-or-qid> [--json]`
- `mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal current [--ws <alias>] [--json]`
- `mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]`
- `mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal claim <goal-id-or-qid> <work-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]`
- goals orchestrate recursive progress through explicit `scope_refs`; tasks, bugs, tests, and features remain concrete executable units
- `goal next` is read-only; use `goal claim` to set `active_node`
- `mdkg goal evaluate` is report-only and never runs commands from `required_checks`
- skill improvements discovered during normal goal execution should be recorded as candidates or proposals unless the active node is skill-maintenance

Discovery/show export flags:
- `--json`
- `--xml`
- `--toon`
- `--md`
