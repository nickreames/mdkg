# CLI Command Matrix

as_of: 2026-06-06
package_version_in_source: 0.3.4
source: live help from `src/cli.ts`, runtime command handlers, and `dec-15`..`dec-18`
status: canonical single-source command and flag reference for mdkg

## Purpose

This file is the one place humans and LLMs should check for the live mdkg command surface.

Verification commands:
- `npm run cli:snapshot`
- `npm run cli:check`

## Teaching model

Primary commands:
- `init`
- `upgrade`
- `new`
- `show`
- `list`
- `search`
- `pack`
- `skill`
- `capability`
- `spec`
- `archive`
- `bundle`
- `subgraph`
- `work`
- `goal`
- `task`
- `next`
- `validate`
- `status`
- `fix`

Advanced / maintenance commands:
- `db`
- `event`
- `checkpoint`
- `index`
- `guide`
- `format`
- `status`
- `fix`
- `doctor`
- `workspace`

Skills are first-class and are accessed only through `mdkg skill ...`.
Generic `list/show/search` do not expose skills.
Capability cache discovery is read-only and accessed through `mdkg capability ...`.
Optional reusable SPEC capability records are accessed through `mdkg spec ...`.
Archive sidecars are accessed through `mdkg archive ...`.
Full graph snapshot bundles are accessed through `mdkg bundle ...`.
Read-only child graph orchestration is accessed through `mdkg subgraph ...`.
Work contract/order/receipt semantic mirrors are accessed through `mdkg work ...`.
Recursive long-running objective contracts are accessed through `mdkg goal ...`.
Fresh init workspaces default to the SQLite access cache backend; existing migrated configs stay on JSON until opted in.
Project application database foundation commands are accessed through `mdkg db ...`; `mdkg index` remains the compatibility shortcut for graph index rebuilds.
Operator health summaries are accessed through read-only `mdkg status ...`; deeper diagnostics remain under `mdkg doctor ...`.
Repair planning is accessed through read-only `mdkg fix plan ...`; duplicate-ID graph repairs can be applied through `mdkg fix apply --family ids ...` or the convenience `mdkg fix ids --apply ...`. Index/cache and graph-reference findings remain plan/manual-review only.

## Global usage

Usage:
- `mdkg <command> [options]`

Global flags:
- `--root`, `-r <path>`
- `--help`, `-h`
- `--version`, `-V`

Hidden but supported runtime flags used by selected commands:
- `--no-cache`
- `--no-reindex`

## Primary commands

### `mdkg init`

When to use:
- bootstrap a repo with mdkg
- add the complete agent bootstrap when coding agents will use the repo

Usage:
- `mdkg init [options]`

Flags:
- `--force`
- `--agent`
- `--no-update-ignores`
- `--update-gitignore`
- `--update-npmignore`
- `--update-dockerignore`

Notes:
- `--agent` is the canonical complete AI-agent bootstrap path
- removed flags `--llm`, `--agents`, `--claude`, and `--omni` fail before mutation with guidance to use `mdkg init --agent`
- published bootstrap config is root-only by default
- `--agent` creates `AGENT_START.md`, `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `CLI_COMMAND_MATRIX.md`, strict-node core docs, default mdkg usage skills, `events.jsonl`, registry, and skill mirrors
- run `mdkg index` after fresh init before treating `mdkg doctor --strict --json` as a clean health gate; init writes source scaffold files and index writes generated caches

### `mdkg upgrade`

When to use:
- preview or apply safe mdkg scaffold upgrades in an existing workspace
- refresh managed init docs, templates, and default skills without overwriting local edits

Usage:
- `mdkg upgrade [--dry-run] [--apply] [--json]`

Flags:
- `--dry-run`
- `--apply`
- `--json`

Notes:
- `mdkg upgrade` defaults to dry-run and writes nothing
- `--apply` is the only mutating upgrade path
- JSON receipts include `safe_to_apply`, `will_write_paths`, `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`
- customized docs, templates, skills, and core files are preserved and reported as preserved customizations
- agent-enabled workspaces include safe default skill upgrades and skill mirror sync
- ignored event logs are skipped with guidance to run `mdkg event enable`
- non-agent workspaces do not gain skills, events, or mirrors implicitly

### `mdkg new`

When to use:
- create a new node in the mdkg graph
- optionally emit a baseline event when event logging is enabled

Usage:
- `mdkg new <type> "<title>" [options] [--json]`

Types:
- `rule`
- `prd`
- `edd`
- `dec`
- `prop`
- `goal`
- `epic`
- `feat`
- `task`
- `bug`
- `spike`
- `checkpoint`
- `test`

Agent workflow file types:
- `spec`
- `work`
- `work_order`
- `receipt`
- `feedback`
- `dispute`
- `proposal`

Agent workflow file type creation:
- `mdkg new spec "<title>" [options] [--json]`
- `mdkg new work "<title>" [options] [--json]`
- `mdkg new work_order "<title>" [options] [--json]`
- `mdkg new receipt "<title>" [options] [--json]`
- `mdkg new feedback "<title>" [options] [--json]`
- `mdkg new dispute "<title>" [options] [--json]`
- `mdkg new proposal "<title>" [options] [--json]`

Goal node creation:
- `mdkg new goal "<title>" [options] [--json]`

Spike node creation:
- `mdkg new spike "<research question>" [options] [--json]`
- spikes are actionable research/planning work nodes under `.mdkg/work/`
- use `mdkg task start|update|done <spike-id>` for lifecycle state
- spikes record research, sources, recommendations, follow-up node ideas, and
  skill candidates in Markdown body sections
- spikes do not perform web search, execute research, create follow-up nodes,
  or generate `SKILL.md` files automatically
- no `mdkg spike ...` namespace is exposed in this release

Primary flags:
- `--id <portable-id>` agent workflow file types only
- `--ws <alias>`
- `--status <status>`
- `--priority <0..9>`
- `--epic <id>`
- `--tags <tag,tag,...>`
- `--skills <slug,slug,...>`
- `--template <set>`
- `--run-id <id>`
- `--json`

Advanced metadata flags:
- `--parent <id>`
- `--prev <id>`
- `--next <id>`
- `--relates <id,id,...>`
- `--blocked-by <id,id,...>`
- `--blocks <id,id,...>`
- `--links <value,value,...>`
- `--artifacts <value,value,...>`
- `--refs <value,value,...>`
- `--aliases <value,value,...>`
- `--owners <value,value,...>`
- `--cases <value,value,...>`
- `--supersedes <id,id,...>`

JSON receipt:
- `{ action: "created", node: { workspace, id, qid, path, type, title, status, priority } }`
- `status` and `priority` are included only when present on the created node.

Notes:
- `--id` lets agent workflow files use semantic portable ids such as `agent.image-worker`, `work.generate-image`, or `proposal.review-loop-1`.
- `goal` nodes capture recursive objective state and required checks, but normal `mdkg next` does not select them.
- `spec` and `work` scaffold as validation-clean standalone docs. `work_order`, `receipt`, `feedback`, `dispute`, and `proposal` templates contain editable placeholder refs and need real graph or `skill.<slug>` refs before strict validation passes.

### `mdkg show`

When to use:
- inspect one mdkg node exactly
- use `mdkg skill show <slug>` for skills

Usage:
- `mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]`

Flags:
- `--ws <alias>`
- `--meta`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- default behavior prints full body content
- `--meta` omits the body
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `show` envelope shape

Removed surface:
- `mdkg show skill:<slug>`

### `mdkg list`

When to use:
- list mdkg nodes with deterministic filters
- use `mdkg skill list` for skills

Usage:
- `mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]`
- `           [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--type <type>`
- `--status <status>`
- `--ws <alias>`
- `--epic <id>`
- `--priority <n>`
- `--blocked`
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `list` envelope shape

Removed surface:
- `mdkg list --type skill`

### `mdkg search`

When to use:
- search node metadata and linked identifiers
- use `mdkg skill search` for skills

Usage:
- `mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]`
- `               [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--type <type>`
- `--status <status>`
- `--ws <alias>`
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- search returns nodes only
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `search` envelope shape

Removed surfaces:
- `mdkg search --type skill`
- generic `mdkg search` returning skills

### `mdkg pack`

When to use:
- build the deterministic handoff context for humans and agents

Usage:
- `mdkg pack <id-or-qid> [options]`
- `mdkg pack --list-profiles`

Primary flags:
- `--ws <alias>` / `-w`
- `--verbose` / `-v`
- `--format <fmt>` / `-f`
- `--out <path>` / `-o`
- `--profile <name>`
- `--visibility public|internal|private`
- `--skills <mode>`
- `--skills-depth <mode>`
- `--dry-run`
- `--stats`
- `--list-profiles`

Advanced flags:
- `--depth <n>`
- `--edges <edge,edge,...>`
- `--strip-code`
- `--max-code-lines <n>`
- `--max-chars <n>`
- `--max-lines <n>`
- `--max-tokens <n>`
- `--truncation-report <path>`
- `--stats-out <path>`

Allowed formats:
- `md`
- `json`
- `toon`
- `xml`

Profiles:
- `standard`
- `concise`
- `headers`

Compatibility alias still supported:
- `--pack-profile`

Visibility:
- no visibility flag preserves existing private-capable local pack behavior
- `--visibility public` includes only public mdkg records and fails when included records reference internal/private graph, archive, or imported records
- `--visibility internal` includes public/internal records and fails when included records reference private records
- `--visibility private` records explicit private intent and may include all records
- visibility filtering does not inspect or redact arbitrary Markdown body text

### `mdkg skill`

When to use:
- create, discover, inspect, and validate skills
- orchestrators should use this namespace for stage-tagged skill lookup

#### `mdkg skill new`

Usage:
- `mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]`

Flags:
- `--description <text>`
- `--tags <tag,tag,...>`
- `--authors <name,name,...>`
- `--links <url,url,...>`
- `--run-id <id>`
- `--json`
- `--with-scripts`
- `--force`

JSON receipt:
- `{ action: "created", skill: { workspace, id, qid, slug, name, path, with_scripts } }`

#### `mdkg skill sync`

Usage:
- `mdkg skill sync [--force] [--json]`

Flags:
- `--force`
- `--json`

JSON receipt:
- `{ action: "synced", sync: { synced, pruned, targets } }`

Notes:
- syncs canonical `.mdkg/skills/` into `.agents/skills/` and `.claude/skills/`
- preserves unrelated existing folders
- same-slug collisions fail unless forced

Scaffold behavior:
- writes `.mdkg/skills/<slug>/SKILL.md`
- creates `references/`
- creates `assets/`
- creates `scripts/` only with `--with-scripts`
- updates `.mdkg/skills/registry.md`

#### `mdkg skill list`

Usage:
- `mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `list` envelope shape
- preferred orchestrator lookup pattern: `mdkg skill list --tags stage:plan --json`

#### `mdkg skill show`

Usage:
- `mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]`

Flags:
- `--meta`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- default behavior prints full skill body
- `--meta` omits the body
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `show` envelope shape

#### `mdkg skill search`

Usage:
- `mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]`

Flags:
- `--tags <tag,tag,...>`
- `--tags-mode any|all`
- `--json`
- `--xml`
- `--toon`
- `--md`

Notes:
- text mode prints cards on stdout and `count:` / `note:` on stderr
- structured outputs are mutually exclusive
- `--json`, `--xml`, `--toon`, and `--md` all return the same `search` envelope shape
- preferred orchestrator lookup pattern: `mdkg skill search "checkpoint" --tags stage:review --json`

#### `mdkg skill validate`

Usage:
- `mdkg skill validate [<slug>] [--json]`

Flags:
- `--json`

JSON receipt:
- `{ action: "validated", ok, checked_count, warning_count, error_count, warnings, errors, target }`
- `target` is included only when a slug is passed.

Notes:
- validates all skills when no slug is passed
- validates one skill when a slug is passed
- reuses the repo skill validation rules

### `mdkg capability`

When to use:
- discover deterministic capability surfaces across enabled workspaces
- query skills, `SPEC.md`, `WORK.md`, core docs, and design docs without loading the whole graph body set

Usage:
- `mdkg capability list [--kind <kind>] [--visibility <level>] [--json]`
- `mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]`
- `mdkg capability show <id-or-qid-or-slug> [--json]`
- `mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]`

Kinds:
- `skill`
- `spec`
- `work`
- `core`
- `design`

Visibility levels:
- `private`
- `internal`
- `public`

Notes:
- capability records are derived cache projections from Markdown
- `capability resolve` ranks local and subgraph capabilities deterministically for orchestration planning
- stale subgraphs remain visible with degraded ranking unless `--fresh-only` is supplied
- records include deterministic source metadata such as workspace, visibility, kind, id/qid/slug, path, headings, refs, source hash, and `indexed_at`
- SPEC and WORK capability records include read-only `linkage` arrays for related SPECs, work contracts, work orders, and receipts when those graph mirrors exist
- `.mdkg/index/capabilities.json` is rebuilt by `mdkg index` and by capability commands when stale
- normal task, epic, feat, bug, test, spike, and checkpoint nodes are intentionally excluded
- visibility is mdkg export metadata used by capability filters, `pack --visibility`, public bundle checks, validation, and doctor diagnostics; it is not secret scanning or body redaction

### `mdkg spec`

When to use:
- list optional `SPEC.md` reusable capability surfaces
- show one SPEC capability record by id, qid, path, or alias
- validate the graph while ensuring a named SPEC capability exists

Usage:
- `mdkg spec list [--json]`
- `mdkg spec show <id-or-qid-or-alias> [--json]`
- `mdkg spec validate [<id-or-qid-or-alias>] [--json]`

Flags:
- `--json`

Notes:
- `SPEC.md` is optional; repos with no SPEC files remain valid
- SPEC records are reusable-capability oriented, not documentation-only planning notes
- `mdkg spec validate` with no ref validates the graph and all optional SPEC records
- `mdkg spec validate <ref>` also checks that the target SPEC reference exists
- use `mdkg capability ...` for broader skill, SPEC, WORK, core-doc, and design-doc capability discovery

### `mdkg archive`

When to use:
- register source documents and produced artifacts as mdkg sidecars
- verify deterministic compressed cache integrity
- keep raw local archive source copies out of git while committing sidecar metadata and ZIP caches

Usage:
- `mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]`
- `mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]`
- `mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--json]`
- `mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]`
- `mdkg archive show <id-or-archive-uri> [--json]`
- `mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]`
- `mdkg archive verify [id-or-archive-uri] [--json]`
- `mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]`
- `mdkg archive compress <id-or-archive-uri|--all> [--json]`
- `mdkg archive compress <id-or-archive-uri> [--ws <alias>] [--json]`
- `mdkg archive compress --all [--json]`

Fields:
- archive sidecars use `type: archive`
- ids are portable archive ids such as `archive.key-input-doc`
- refs use `archive://archive.key-input-doc`
- sidecars record `archive_kind`, `source_path`, `stored_path`, `compressed_path`, MIME, byte size, SHA-256 hashes, visibility, provenance, and ingest status

Notes:
- `archive add` copies the source, writes a sidecar, and writes a deterministic zip cache
- in-repo `source_path` values are repo-relative; outside-repo source paths are redacted as `external:<basename>`
- archive visibility defaults to `private`
- `archive://<archive.id>` refs are validated against local archive sidecars
- `archive verify` and `validate` both check the ZIP hash, ZIP readability, payload SHA-256, and payload byte size
- `archive verify` passes when the raw local source file is missing but the committed sidecar and ZIP cache are valid
- generated raw source copies live under `.mdkg/archive/**/source/` and are ignored by default
- `doctor` warns when archive ZIP caches exceed `archive.large_cache_warning_bytes` (default `26214400`; `0` disables)

JSON receipts:
- `add`: `{ action: "created", archive: { workspace, id, qid, path, archive_uri, stored_path, compressed_path, sha256, compressed_sha256, visibility } }`
- `list`: `{ kind: "archive", count, items }`
- `show`: `{ kind: "archive", item, attributes }`
- `verify`: `{ ok, count, results }`
- `compress`: `{ action: "compressed", count, archives }`

### `mdkg bundle`

When to use:
- create deterministic compressed read-only `.mdkg` graph snapshots
- give root orchestrators a low-I/O graph transport artifact for child repos
- verify committed private/public bundle freshness before handoff

Usage:
- `mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]`
- `mdkg bundle verify [bundle-path] [--json]`
- `mdkg bundle show <bundle-path> [--json]`
- `mdkg bundle list [--json]`

Flags:
- `--profile private|public`
- `--ws <alias|all>`
- `--output <path>`
- `--json`

Notes:
- default output is `.mdkg/bundles/<profile>/<workspace-or-all>.mdkg.zip`
- bundle refresh is explicit; `mdkg index` does not rewrite bundles
- recommended pre-commit order for repos that track archive caches or bundles is `mdkg archive compress --all`, `mdkg archive verify --json`, `mdkg bundle create --profile private`, then `mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip`
- private bundles include selected authored `.mdkg` content, archive sidecars, archive ZIP caches, and generated bundle-local indexes
- public bundles include only public workspace content and public archive sidecars
- public bundles require at least one selected workspace with `visibility: public`
- public bundle creation fails if public records reference private graph nodes, private archive refs, or private/internal subgraph qids
- bundles exclude `.mdkg/pack/`, `.mdkg/bundles/`, existing `.mdkg/index/`, and raw `.mdkg/archive/**/source/` files

JSON receipts:
- `create`: `{ action: "created", path, profile, selected_workspaces, file_count, source_tree_hash, bundle_hash, zip_sha256, source }`
- `verify`: `{ action: "verified", ok, path, profile, selected_workspaces, file_count, stale, errors, stale_paths, bundle_hash, zip_sha256 }`
- `show`: `{ action: "show", bundle, manifest }`
- `list`: `{ action: "list", count, items }`

### `mdkg subgraph`

When to use:
- register child graph snapshot bundles as read-only planning context
- inspect, verify, enable, disable, refresh, audit, upgrade-plan, sync, and materialize configured subgraphs
- keep root orchestration graph state separate from child repo mutations

Usage:
- `mdkg subgraph add/list/show/rm/enable/disable/verify/refresh/audit/upgrade-plan/sync/materialize ...`
- `mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]`
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

Flags:
- `--visibility private|internal|public`
- `--profile private|public`
- `--source-path <path>`
- `--source-repo <ref>`
- `--max-stale-seconds <seconds>`
- `--target <path>` for audit materialize-target safety checks and materialize output
- `--dry-run`
- `--allow-dirty`
- `--clean`
- `--gitignore`
- `--json`

Notes:
- subgraph config lives in `.mdkg/config.json` under `subgraphs`
- each subgraph defaults to `enabled: true`, `visibility: private`, `permissions: ["read"]`, and `max_stale_seconds: 3600`
- each subgraph may contain multiple configured sources, but CLI add creates one initial source in this release
- `mdkg subgraph refresh` reloads configured bundle sources only; it never builds or mutates child repos
- `mdkg subgraph audit` is read-only and reports typed checks for source_path Git state, bundle validity/freshness, root-owned bundle paths, dirty tracked child files, and optional materialize target marker safety
- `mdkg subgraph upgrade-plan` is read-only and returns `apply_supported: false`; it proposes safe sync/verify/materialize next steps and blocks on dirty child repos, invalid bundles, unsafe bundle paths, or unusable source paths
- `mdkg subgraph sync` uses configured `source_path`, requires a contained root-relative clean child Git repo by default, builds the configured root-owned bundle path, verifies it, and records `source_repo` as `<branch>@<sha>`
- `mdkg subgraph sync --dry-run` writes no bundles, config, or indexes; `--allow-dirty` permits dirty tracked child changes and records them visibly
- `mdkg subgraph materialize` extracts bundles into generated read-only inspection trees under `<target>/<alias>` and protects clean replacement with `.mdkg-materialized.json`
- `.mdkg/subgraphs/` materialized views are ignored by local graph indexing, search, validation, packing, bundle creation, and SQLite hydration
- root-authored `refs`, `relates`, blockers, `scope_refs`, and workflow/archive refs may point at configured subgraph qids such as `child_repo:work.example`; ownership fields such as `epic`, `parent`, `prev`, and `next` remain local-only
- subgraphs are read-only graph views projected under subgraph-alias qids such as `child_repo:task-1`
- enabled subgraphs are visible to `list`, `search`, `show`, `pack`, `capability`, and `capability resolve`
- public/internal subgraphs require public bundle profiles; private bundle profiles cannot be promoted to public/internal visibility
- stale subgraphs warn during planning reads; `mdkg subgraph verify` exits nonzero for stale or invalid subgraphs
- mutating commands reject subgraph qids with a read-only subgraph error
- `mdkg index` writes `.mdkg/index/subgraphs.json` in addition to local indexes
- legacy `mdkg bundle import ...` exits with guidance to run `mdkg upgrade --apply` and use `mdkg subgraph ...`

JSON receipts:
- `add/enable/disable/refresh`: `{ action, subgraph: { alias, enabled, visibility, permissions, sources, stale, warnings, errors } }`
- `list`: `{ action: "list", count, subgraphs }`
- `show`: `{ action: "show", subgraph }`
- `rm`: `{ action: "removed", subgraph: { alias } }`
- `verify`: `{ action: "verified", ok, count, subgraphs }`
- `audit`: `{ action: "audited", ok, count, target?, errors, warnings, subgraphs: [{ alias, capability_summary, checks, dirty_tracked, source_repo_current, ok }] }`
- `upgrade-plan`: `{ action: "upgrade_plan", ok, count, apply_supported: false, mutation_policy: "read_only_plan", blockers, subgraphs: [{ alias, capability_summary, actions, blockers }] }`
- `sync`: `{ action: "sync_dry_run"|"synced", ok, count, updated, skipped, errors, warnings, subgraphs }`
- `materialize`: `{ action: "materialized", ok, count, target, results, errors, warnings }`

### `mdkg work`

When to use:
- create and update `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md` semantic mirror files
- attach archived source/artifact sidecars to orders and receipts

Usage:
- `mdkg work contract new ...`
- `mdkg work trigger <work-or-capability-ref> ...`
- `mdkg work order new|status|update ...`
- `mdkg work receipt new|verify|update ...`
- `mdkg work artifact add ...`
- `mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]`
- `mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]`
- `mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]`
- `mdkg work order status <id-or-qid> [--json]`
- `mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]`
- `mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]`
- `mdkg work receipt verify <id-or-qid> [--json]`
- `mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]`
- `mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]`

Notes:
- work commands mutate semantic mirror files only
- production order, receipt, feedback, dispute, payment, ledger, marketplace inventory, fulfillment, and execution state remains canonical outside mdkg
- do not store raw secrets, credentials, live payment state, ledger mutations, or canonical marketplace state in work mirrors
- `artifact://...` refs identify external/runtime-managed artifacts; `archive://...` refs identify committed mdkg archive sidecars
- `work trigger` accepts a `WORK.md` ref directly or a `SPEC.md` capability ref with exactly one resolvable work contract; it creates a submitted order mirror and never executes work
- example: `mdkg work trigger work.example --id order.example-1 --requester user://example --json`
- `work trigger --enqueue <queue>` requires a valid project DB plus an explicitly created active queue, creates a submitted order mirror, and enqueues a local delivery message without executing work
- `work order new` accepts URI-style requester/request/trigger refs, archive input refs, optional queue refs, and stable payload hashes
- `work order status` is read-only and reports deterministic order state plus linked receipts
- `work receipt new` accepts URI-style cost/proof/attestation refs, explicit redaction policy, and SHA-256 evidence/input/output hash refs
- `work receipt verify` is read-only and reports linkage, evidence, archive ref, hash, outcome, and redaction-policy checks; invalid receipts print JSON before exiting nonzero
- `work artifact add` calls `mdkg archive add`, then attaches the resulting `archive://...` ref to the target order or receipt
- `work order update`, `work receipt update`, and `work artifact add` accept local ids or local qids; subgraph qids are read-only and must be changed in their source workspace

JSON receipts:
- `contract new`, `order new`, `order update`, `receipt new`, and `receipt update`: `{ action, node }`
- `trigger`: `{ action: "triggered", node, trigger: { target_ref, source_qid?, work_qid, payload_hash, executed, enqueue, event_appended } }`
- `order status`: `{ kind: "work_order_status", order, receipt_count, receipts }`
- `receipt verify`: `{ kind: "work_receipt_verify", ok, receipt, work_order?, checks, errors, warnings }`
- `artifact add`: `{ action: "artifact_registered", target, archive }`

### `mdkg goal`

When to use:
- inspect and guide a recursive long-running objective
- select the next concrete local work item inside a goal
- update goal state after human or agent review

Usage:
- `mdkg goal show <goal-id-or-qid> [--json]`
- `mdkg goal select <goal-id-or-qid> [--json]`
- `mdkg goal activate <goal-id-or-qid> [--json]`
- `mdkg goal current [--json]`
- `mdkg goal clear [--json]`
- `mdkg goal next [goal-id-or-qid] [--json]`
- `mdkg goal claim [goal-id-or-qid] <work-id-or-qid> [--json]`
- `mdkg goal evaluate <goal-id-or-qid> [--json]`
- `mdkg goal pause|resume|done|archive <goal-id-or-qid> [--json]`
- `mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal current [--ws <alias>] [--json]`
- `mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]`
- `mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal claim <goal-id-or-qid> <work-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]`
- `mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]`

Behavior:
- `goal show` reports goal condition, goal state, scope refs, active node, required skills, required checks, and source path.
- `goal select` writes local ignored selected-goal state so `goal next` can omit the goal id.
- `goal activate` makes one local root goal active, pauses competing local active goals in the same workspace, and writes selected-goal state.
- `goal current` shows the selected goal or unique active goal fallback.
- `goal clear` removes local selected-goal state.
- `goal next` is read-only and selects feature, task, bug, test, or spike work inside explicit `scope_refs`; epics are recursive containers, not executable returns.
- `goal claim` mutates only `active_node` after the work item is confirmed inside the goal scope.
- `goal evaluate` is report-only and never runs commands from `required_checks`.
- `goal pause`, `goal resume`, and `goal done` update `goal_state`, compatible work status, and `updated`.
- `goal archive` marks a superseded historical goal as `status: archived` and `goal_state: archived`; archived goals remain show/search/list readable but are excluded from active routing.
- subgraph goal qids are read-only; update the source workspace instead.

JSON receipts:
- `show`: `{ action: "showed", goal }`
- `select`: `{ action: "selected_goal", goal, selection }`
- `activate`: `{ action: "activated", goal, activated_goal, paused_goals, selection, warnings }`
- `current`: `{ action: "current", goal, source, warnings }`
- `clear`: `{ action: "cleared_goal", path, cleared }`
- `next`: `{ action: "selected", goal, goal_source, node, warnings }`
- `claim`: `{ action: "claimed", goal, node }`
- `evaluate`: `{ action: "evaluated", goal, report_only, runs_scripts, checks, completion_evidence_present }`
- `pause|resume|done|archive`: `{ action, goal }`

### `mdkg task`

When to use:
- mutate structured task-like fields and capture routine lifecycle evidence
- keep narrative/body edits and manual parent summaries in markdown
- optionally append baseline task events when event logging is enabled

Usage:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]`
- `mdkg task update <id-or-qid> [options] [--json]`
- `mdkg task done <id-or-qid> [--checkpoint "<title>"] [options] [--json]`

#### `mdkg task start`

Usage:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]`

Behavior:
- supports task-like `feat`, `task`, `bug`, `test`, and `spike` nodes
- sets `status: progress`
- if `events.jsonl` is missing for the workspace, prints a short `stderr` reminder about `mdkg event enable`

JSON receipt:
- `{ action: "started", task: { workspace, id, qid, path, type, status, priority } }`

#### `mdkg task update`

Usage:
- `mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]`
- `                   [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]`
- `                   [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]`
- `                   [--clear-blocked-by] [--run-id <id>] [--note "<text>"] [--json]`

Behavior:
- supports task-like `feat`, `task`, `bug`, `test`, and `spike` nodes
- list mutations are additive and unique
- scalar fields replace existing values
- `--clear-blocked-by` clears blockers before optional re-add

JSON receipt:
- `{ action: "updated", task: { workspace, id, qid, path, type, status, priority } }`

#### `mdkg task done`

Usage:
- `mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]`
- `                 [--add-refs <id,...>] [--checkpoint "<title>"] [--run-id <id>] [--note "<text>"] [--json]`

Behavior:
- supports task-like `feat`, `task`, `bug`, `test`, and `spike` nodes
- sets `status: done`
- `--checkpoint` creates a related checkpoint
- if `events.jsonl` is missing for the workspace, prints a short `stderr` reminder about `mdkg event enable`

JSON receipt:
- without checkpoint: `{ action: "done", task: { workspace, id, qid, path, type, status, priority } }`
- with checkpoint: `{ action: "done", task: { workspace, id, qid, path, type, status, priority }, checkpoint: { workspace, id, qid, path } }`

Closeout guidance:
- use `--checkpoint` for milestone compression and parent closeout summaries
- do not create a checkpoint for every routine task completion
- feat/epic status edits remain manual; use checkpoints as the durable narrative layer

### `mdkg next`

When to use:
- ask mdkg for the next work item to pull forward

Usage:
- `mdkg next [<id-or-qid>] [--ws <alias>]`

Flags:
- `--ws <alias>`

### `mdkg validate`

When to use:
- run the repo trust gate before calling work done

Usage:
- `mdkg validate [--out <path>] [--quiet] [--json]`

Flags:
- `--out <path>`
- `--quiet`
- `--json`

JSON receipt:
- `{ action: "validated", ok, warning_count, error_count, warnings, errors, report_path }`
- `report_path` is included only when `--out` is used.

Notes:
- validates nodes, graph integrity, skills, and event log contracts

## Advanced / maintenance commands

### `mdkg event`

When to use:
- ensure or append append-only episodic logs
- keep a durable provenance trail for mutating workflows

#### `mdkg event enable`

Usage:
- `mdkg event enable [--ws <alias>] [--json]`

Behavior:
- creates `.mdkg/work/events/events.jsonl` if missing
- leaves `.gitignore` unchanged
- automatic command-level events happen when the file exists
- task start/done reminders point here when `events.jsonl` is missing

JSON receipt:
- `{ action: "enabled", workspace, created }`

#### `mdkg event append`

Usage:
- `mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]`

Flags:
- `--ws <alias>`
- `--artifacts <a,...>`
- `--notes "<text>"`
- `--run-id <id>`
- `--agent <name>`
- `--skill <slug>`
- `--tool <id>`
- `--json`

JSON receipt:
- `{ action: "appended", event }`

### `mdkg checkpoint`

Usage:
- `mdkg checkpoint new <title> [--ws <alias>] [--json]`
- `        [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]`

JSON receipt:
- `{ action: "created", checkpoint: { workspace, id, qid, path } }`

### `mdkg index`

Usage:
- `mdkg index [--tolerant]`

Notes:
- writes `.mdkg/index/global.json`
- writes `.mdkg/index/skills.json`
- writes `.mdkg/index/capabilities.json`
- writes `.mdkg/index/subgraphs.json`
- writes `.mdkg/index/mdkg.sqlite` when `index.backend` is `sqlite`

### `mdkg db`

Usage:
- `mdkg db index rebuild [--tolerant] [--json]`
- `mdkg db index status [--json]`
- `mdkg db index verify [--json]`
- `mdkg db init [--json]`
- `mdkg db migrate [--json]`
- `mdkg db verify [--json]`
- `mdkg db stats [--json]`
- `mdkg db queue create <queue> [--paused] [--reason <text>] [--json]`
- `mdkg db queue pause <queue> [--reason <text>] [--json]`
- `mdkg db queue resume <queue> [--json]`
- `mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]`
- `mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]`
- `mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]`
- `mdkg db queue ack <queue> <message-id> --lease-owner <owner> [--json]`
- `mdkg db queue fail <queue> <message-id> --lease-owner <owner> --error <text> [--retry-after-ms <ms>] [--json]`
- `mdkg db queue dead-letter <queue> <message-id> --lease-owner <owner> --error <text> [--json]`
- `mdkg db queue ack|fail|dead-letter <queue> <message-id> --lease-owner <owner> [--json]`
- `mdkg db queue release-expired [queue] [--json]`
- `mdkg db queue pause|resume <queue> [--json]`
- `mdkg db queue stats [queue] [--json]`
- `mdkg db queue list <queue> [--status ready|leased|acked|dead_letter|all] [--limit <n>] [--json]`
- `mdkg db queue show <queue> <message-id> [--json]`
- `mdkg db queue stats|list|show ... [--json]`
- `mdkg db snapshot seal [--queue-policy drain|paused] [--json]`
- `mdkg db snapshot verify [--json]`
- `mdkg db snapshot status [--json]`
- `mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]`
- `mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]`

Boundaries:
- `.mdkg/index` is the rebuildable graph access cache
- `.mdkg/db` is project application state
- `mdkg db init` creates the generic `.mdkg/db` scaffold, writes
  `.mdkg/db/project-db.json`, and enables `db.enabled`
- `mdkg db init` does not create an active runtime SQLite database
- `mdkg db migrate` creates or updates the active runtime SQLite database at
  `db.runtime_path` and applies mdkg-owned foundation plus internal local
  node:sqlite queue, event/receipt/reducer, and writer lease/CAS foundation
  migrations
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
- `mdkg db snapshot seal` creates an opt-in sealed checkpoint under
  `.mdkg/db/state` with a deterministic manifest and content hash; default
  `--queue-policy drain` requires no ready or leased messages, while
  `--queue-policy paused` allows ready messages only in paused queues
- `mdkg db snapshot verify` and `mdkg db snapshot status` inspect sealed
  snapshot integrity, manifest drift, runtime freshness, and WAL/transient
  warning state
- `mdkg db snapshot dump` and `mdkg db snapshot diff` provide deterministic
  review aids for SQLite snapshots; they are not a new source of truth
- `mdkg index` remains the compatibility shortcut for index rebuilds
- no raw SQL, hosted queue/event store, profile, public
  event/reducer/lease/materializer command, or publish behavior is exposed here
- active `.mdkg/db/runtime/` files and `.mdkg/db` WAL/SHM/journal/lock/temp
  files are ignored by default; schema, receipts, manifests, and sealed state
  snapshots are commit-eligible only by explicit repo policy

Index behavior:
- `mdkg db index rebuild` writes the same derived caches as `mdkg index`
- `mdkg db index status` reports cache health without mutating files
- `mdkg db index verify` fails on missing, stale, corrupt, schema-mismatched,
  or SQLite source-fingerprint-mismatched cache state

### `mdkg guide`

Usage:
- `mdkg guide`

### `mdkg format`

Usage:
- `mdkg format`

### `mdkg status`

Usage:
- `mdkg status [--json]`

When to use:
- get a read-only operator summary for scripts and agents
- inspect release/package, git, graph, selected-goal, project DB, and generated-cache health before mutating work

Boundaries:
- does not rebuild indexes, repair files, run migrations, write graph nodes, mutate selected-goal state, or change project DB state
- dirty git state and stale generated caches are warnings, not automatic repair instructions
- use `mdkg doctor` for diagnostic detail and future strict typed checks

JSON receipt shape:
- `{ action: "status", ok, level, root, mdkg, git, release, graph, goal, db, generated, summary }`
- `level` is `ok`, `warn`, or `fail`
- `git` includes `inside`, `branch`, `dirty`, `dirty_count`, `untracked_count`, `ahead`, and `behind`
- `graph` includes `ok`, `node_count`, `workspace_count`, `stale`, `warning_count`, and `error_count`
- `goal` includes selected-goal state, existence, achieved-state, active node, goal state, and work status
- `db` reports disabled state or project DB verification summary
- `generated` reports index, skills, capabilities, and subgraph cache existence/staleness
- `summary` includes machine-readable warning and error counts plus messages

### `mdkg fix`

When to use:
- plan reviewable graph/index repairs before applying supported duplicate-ID rewrites
- get a receipt-shaped JSON plan for automation and agent review
- repair branch-merge duplicate IDs while preserving main/base IDs where possible

Usage:
- `mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]`
- `mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]`
- `mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]`

Flags:
- `--family <family>`
- `--target <id-or-qid>`
- `--base-ref <ref>`
- `--apply`
- `--json`

Boundaries:
- `fix plan` is dry-run only and writes nothing
- `fix apply` currently supports only IDs-family duplicate-ID graph rewrites
- `fix ids` without `--apply` is equivalent to `fix plan --family ids`
- `fix ids --apply` is equivalent to `fix apply --family ids`
- apply rewrites graph Markdown atomically, rebuilds derived indexes, and emits a receipt
- unresolved Git add/add conflict stages are handled by keeping stage 2 at the conflicted path and writing stage 3 to a new canonical ID/path
- graph-reference and index/cache findings remain review-only guidance
- initial families are index/cache, graph refs, and duplicate ids

JSON receipt:
- `{ action: "fix.plan", ok, schema_version, plan_id, plan_hash, generated_at, root, family, target, dirty, families, risk_counts, proposed_changes, blocked_changes, summary }`
- each proposed change includes family, risk, status, reason, paths, refs, optional before/after values, command hint, and `apply_supported`
- duplicate-ID changes include candidate ID/path details and `apply_kind`
- `{ action: "fix.apply", ok, schema_version, receipt_hash, root, family, target, base_ref, plan_id, plan_hash, applied_changes, touched_paths, ambiguous_reference_rewrites, index, summary }`
- `summary.apply_deferred` remains true when the selected plan includes index/cache, graph-ref, blocked, or otherwise unsupported findings

### `mdkg doctor`

Usage:
- `mdkg doctor [--strict] [--json]`

Checks:
- Node.js version compatibility
- config and template availability
- selected-goal stale, missing, or achieved state
- project DB verification when project DB is enabled
- global node index health
- capability cache health
- SQLite cache health when enabled
- archive sidecar storage hygiene
- archive large-cache warning threshold
- bundle snapshot storage guidance

Flags:
- `--strict`
- `--json`

Strict mode:
- keeps the command read-only
- fails on invalid graph/index load, stale achieved selected goal, enabled
  project DB verification failure, and generated cache failures
- reports dirty/runtime/storage concerns as typed warnings unless their
  underlying check already fails

JSON receipt shape:
- `{ action: "doctor", ok, strict, checks, summary, failure_count }`
- each check keeps compatibility fields `name`, `ok`, `level`, and `detail`
- each check also includes typed fields `id`, `status`, `severity`,
  `message`, `remediation`, and optional `refs`
- `status` is `pass`, `warn`, `fail`, or `info`
- `severity` is `info`, `warning`, or `error`

### `mdkg workspace`

Usage:
- `mdkg workspace ls [--json]`
- `mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]`
- `mdkg workspace rm <alias> [--json]`
- `mdkg workspace enable <alias> [--json]`
- `mdkg workspace disable <alias> [--json]`

JSON mutation receipts:
- `add`: `{ action: "added", workspace: { alias, path, enabled, mdkg_dir, visibility } }`
- `rm`: `{ action: "removed", workspace: { alias, path, enabled, mdkg_dir, visibility } }`
- `enable`: `{ action: "enabled", workspace: { alias, path, enabled, mdkg_dir, visibility } }`
- `disable`: `{ action: "disabled", workspace: { alias, path, enabled, mdkg_dir, visibility } }`

## Structured output contract

Current structured output surface:
- `--json`
- `--xml`
- `--toon`
- `--md`

Current JSON envelopes:
- `list` / `search`
  - `{ command, kind, count, items }`
- `show`
  - `{ command, kind, item }`
- `skill list` / `skill search`
  - `{ command, kind, count, items }`
- `skill show`
  - `{ command, kind, item }`
- `capability list` / `capability search`
  - `{ kind: "capability", query?, count, items }`
- `capability show`
  - `{ kind: "capability", item }`
- `capability resolve`
  - `{ kind: "capability_resolve", query?, requires?, fresh_only, count, items, warnings }`
- `spec list`
  - `{ kind: "spec", count, items }`
- `spec show`
  - `{ kind: "spec", item }`
- `spec validate`
  - `{ action: "validated", ok, warning_count, error_count, warnings, errors, report_path? }`
- `archive add` / `archive list` / `archive show` / `archive verify` / `archive compress`
  - archive-specific JSON receipts documented in the `mdkg archive` section
- `work ...`
  - semantic mirror mutation receipts documented in the `mdkg work` section

Kind values in this wave:
- node commands: `node`
- skill commands: `skill`
- capability commands: `capability`
- spec commands: `spec`
- archive commands: `archive`

JSON behavior rules:
- full bodies are returned only by `show` and `skill show` without `--meta`
- list/search summaries never include bodies
- skill summaries include generic `extensions`; `ochatr_*` metadata is exposed as `extensions.ochatr` and retained as top-level `ochatr` compatibility data in 0.0.9
- text notes and counts go to `stderr`
- JSON payloads go to `stdout`

## Event logging contract

Explicit commands:
- `mdkg event enable`
- `mdkg event append`

Automatic baseline events append only when `events.jsonl` exists for the workspace.
Current automatic mutation events:
- `NODE_CREATED`
- `SKILL_CREATED`
- `CHECKPOINT_CREATED`
- `TASK_STARTED`
- `TASK_UPDATED`
- `TASK_DONE`

## Deferred follow-up work

Tracked separately:
- XML discovery/show output
- TOON discovery/show output
- Markdown discovery/show output
- additional coverage hardening beyond the current release wave
