# CLI Command Matrix

This file is the canonical command reference for mdkg in this repository.

Verify live help with:
- `mdkg --help`
- `mdkg help <command>`

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
- `mdkg archive`
- `mdkg bundle`
- `mdkg work`
- `mdkg task`
- `mdkg validate`

Validation commands:
- `mdkg validate [--out <path>] [--quiet] [--json]`

Node creation commands:
- `mdkg new <type> "<title>" [options] [--json]`

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
- capability records are deterministic cache projections from Markdown
- records include source hash, headings, refs, and `indexed_at`
- normal task, epic, feat, bug, test, and checkpoint nodes are intentionally excluded

Archive sidecars:
- `mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]`
- `mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]`
- `mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]`
- `mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]`
- `mdkg archive compress <id-or-archive-uri|--all> [--json]`
- archive sidecars are `type: archive` nodes under `.mdkg/archive`
- archive visibility defaults to `private`
- committed sidecar `.md` files and ZIP caches are source-of-truth evidence; raw source copies under `.mdkg/archive/**/source/` are ignored by default

Graph snapshot bundles:
- `mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]`
- `mdkg bundle verify [bundle-path] [--json]`
- `mdkg bundle show <bundle-path> [--json]`
- `mdkg bundle list [--json]`
- `mdkg bundle import add/list/rm/enable/disable/verify ...`
- `mdkg bundle import add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--json]`
- `mdkg bundle import verify [alias|--all] [--json]`
- default output is `.mdkg/bundles/<profile>/<workspace-or-all>.mdkg.zip`
- private bundles are explicit local graph transport artifacts
- bundle imports are read-only planning views and use import-alias qids such as `child_repo:task-1`
- repos that track archive caches or bundles should run `mdkg archive compress --all`, `mdkg archive verify --json`, `mdkg bundle create --profile private`, and `mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip` before commit
- public bundles include only public workspace content and public archive sidecars
- public bundle creation fails when public records reference private graph, archive, or imported records
- public/internal imports require public bundle profiles

Work semantic mirrors:
- `mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]`
- `mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--input-refs <...>] [--requested-outputs <...>] [--json]`
- `mdkg work order update <id> [--status <status>] [--add-input-refs <...>] [--add-artifacts <...>] [--json]`
- `mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected] [--json]`
- `mdkg work receipt update <id> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--json]`
- `mdkg work artifact add <order-or-receipt-id> <file> [--id <archive.id>] [--kind source|artifact] [--json]`
- work commands mutate mdkg semantic mirror files only; production order, receipt, payment, ledger, and marketplace state remains canonical outside mdkg

Discovery/show export flags:
- `--json`
- `--xml`
- `--toon`
- `--md`
