# mdkg Workspace Guide

This repository is initialized for mdkg.

mdkg is pre-v1 public alpha software. Graph, cache, bundle, and DAL contracts may change quickly before v1.

## Layout

- `core/`: rules, operating guide, and pinned docs
- `design/`: product/engineering decision records
- `work/`: epics, tasks, bugs, tests, checkpoints
- `templates/`: default node templates
- `archive/`: sidecar metadata and deterministic compressed source/artifact caches
- `bundles/`: optional committed full graph snapshot bundles
- `index/`: generated JSON caches plus optional commit-eligible `mdkg.sqlite`
- `pack/`: generated context packs (do not commit)

## Next Commands

```bash
mdkg upgrade
mdkg new task "..." --status todo --priority 1
mdkg search "..."
mdkg show <id>
mdkg pack <id>
mdkg capability search "..."
mdkg archive list
mdkg bundle create --profile private
mdkg bundle import list --json
mdkg validate
```

This repo is already initialized. Use `mdkg upgrade` to preview safe scaffold updates, `mdkg new` to create work, `mdkg search`/`mdkg show` to inspect graph state, `mdkg capability ...` to inspect cached skill/spec/work/core/design capabilities, `mdkg archive ...` to register source/artifact sidecars, `mdkg work ...` to create work contract/order/receipt semantic mirrors, `mdkg bundle ...` to create full graph snapshot bundles and read-only child graph imports, `mdkg pack <id>` to build deterministic context, and `mdkg validate` before closeout.

Agent workflow docs can use semantic ids:

```bash
mdkg new spec "image worker" --id agent.image-worker
mdkg new work "generate image" --id work.generate-image
```

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
- `.mdkg/pack/`
- `.mdkg/archive/**/source/`

Fresh mdkg workspaces default to `index.backend: sqlite`; `.mdkg/index/mdkg.sqlite` is a rebuildable cache and may be committed when the repo intentionally tracks it and it stays reasonably small.

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

Use this as a pre-commit recommendation only when the repo tracks archive caches or `.mdkg/bundles/`. Private bundles are local graph transport artifacts and may be tracked in private repos when configured. Public bundles require selected workspaces with `visibility: public` and fail closed when public records reference private graph, archive, or imported records.

Register child bundle snapshots as read-only imports with:

```bash
mdkg bundle import add child_repo child-repo/.mdkg/bundles/private/all.mdkg.zip --source-path child-repo
mdkg bundle import verify child_repo --json
```

Imported nodes use the import alias as their qid prefix and can be inspected or packed, but mutations must happen in the owning child repo.

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
mdkg work order new "example request" --id order.example-1 --work-id work.example --requester user://example
mdkg work receipt new "example receipt" --id receipt.example-1 --work-order-id order.example-1 --outcome success
```

Receipt statuses are `recorded`, `verified`, `rejected`, and `superseded`.
Update and artifact commands accept local ids or local qids; imported bundle qids are read-only and must be changed in their source workspace.

Production orders, receipts, feedback, disputes, payments, ledgers, marketplace inventory, fulfillment records, and execution state remain canonical outside mdkg. mdkg stores committed semantic mirrors and reviewable evidence. Do not store raw secrets, credentials, live payment state, ledger mutations, canonical marketplace state, or bulky raw payloads in these mirrors.

Use `artifact://...` for external or runtime-managed artifact identities. Use `archive://...` only for committed mdkg archive sidecars.
