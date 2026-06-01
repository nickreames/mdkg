# Changelog

All notable changes to mdkg are documented here.

This project follows a pragmatic changelog style inspired by Keep a Changelog. Versions use npm package versions.

mdkg is pre-v1 public alpha software. Command, graph, cache, bundle, and DAL contracts may change quickly while the project converges on a stable v1 surface.

## 0.1.6 - 2026-06-01

### Fixed

- Treat `feat` nodes as task-like for `mdkg task start/update/done`, closing the selected-goal loop when `mdkg goal next` returns a feature as the next scoped work item.

## 0.1.5 - 2026-06-01

### Added

- Added first-class `goal` nodes for recursive long-running objectives with `goal_state`, `goal_condition`, `active_node`, required skills, required checks, iteration limits, stop conditions, and completion evidence.
- Added `mdkg new goal "<title>"` and the `mdkg goal show/select/current/clear/next/claim/evaluate/pause/resume/done` command family.
- Added a bundled `goal.md` template so init, upgrade, and template fallback can support goal nodes.
- Added `scope_refs` for explicit goal ownership roots and recursive goal traversal through epics and features.
- Added the `pursue-mdkg-goal` skill for skill-guided recursive pursuit with evidence and controlled skill-improvement proposals.
- Added goal parser, creation, selected-goal, recursive next-selection, claim, pack, and report-only evaluation tests.

### Changed

- Normal `mdkg next` continues to select concrete task, bug, test, and feature work; goal-scoped selection lives under `mdkg goal next`.
- `mdkg goal next` is read-only and may omit the goal id when a selected local goal exists; `mdkg goal claim` is the explicit mutating path for `active_node`.
- Goal required checks are report-only guidance in this release. Agents run commands themselves and record evidence back into mdkg.
- Skill self-improvement during goal execution is recorded as candidates or proposal work unless the active node is explicit skill-maintenance.

## 0.1.4 - 2026-06-01

### Added

- Added `mdkg subgraph add/list/show/rm/enable/disable/verify/refresh` as the public read-only child graph orchestration command family.
- Added `subgraphs` config with multi-source bundle transport, advisory visibility, read permissions, source metadata, and a default 60 minute freshness policy.
- Added `.mdkg/index/subgraphs.json` as the derived subgraph projection and health cache.
- Added `mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]` for deterministic local plus subgraph capability ranking.
- Added packed-package `smoke:subgraph` coverage for root, child, and grandchild orchestration flows.

### Changed

- Replaced the public `mdkg bundle import ...` surface with `mdkg subgraph ...`; legacy calls now exit with migration guidance.
- `mdkg upgrade --apply` migrates legacy `bundle_imports` config into `subgraphs`.
- Read commands, `pack`, and capability discovery now project enabled child bundles as read-only subgraph qids such as `child_repo:work.example`.
- `mdkg index`, SQLite cache rebuilds, `doctor`, and `validate` now use subgraph naming and metadata instead of bundle-import naming.
- Stale subgraphs remain usable for planning reads with warnings, fail `mdkg subgraph verify`, and are excluded from `capability resolve --fresh-only`.
- Public/internal subgraphs require public bundle profiles and public bundle creation fails closed on private/internal subgraph references.

### Fixed

- Mutation commands now reject subgraph qids with explicit guidance to update the source workspace for the owning subgraph.
- Seeded init docs, command matrix, and release skills now teach `subgraph` and `capability resolve` instead of onboarding users through `bundle import`.

## 0.1.3 - 2026-05-20

### Added

- Added first-class SQLite access cache support using Node's built-in `node:sqlite`; no third-party SQLite package is introduced.
- Added `.mdkg/index/mdkg.sqlite` as a rebuildable derived cache for nodes, edges, skills, capabilities, archives, bundle imports, source hashes, and schema metadata when `index.backend` is `sqlite`.
- Added fresh init defaults for `index.backend: sqlite`, `index.sqlite_path`, `index.sqlite_commit_warning_bytes`, and `index.lock_timeout_ms`.
- Added a shared mutation lock plus atomic writes for mdkg mutations and index writes.
- Added SQLite transactional id reservation for numeric node/checkpoint ids in SQLite mode.
- Added `npm run smoke:sqlite` and `npm run smoke:parallel` packed/temp-repo coverage.

### Changed

- Raised the required Node runtime to `>=24.15.0`.
- Existing workspaces that are migrated from older configs remain on `index.backend: json` until they explicitly opt in to SQLite.
- Init ignore policy now keeps JSON indexes, temp files, lock directories, WAL, SHM, and journal files ignored while allowing `.mdkg/index/mdkg.sqlite` to be committed by intentional repo policy.
- `mdkg index` continues to write JSON compatibility indexes and also rebuilds SQLite when enabled.
- `mdkg doctor` and `mdkg validate` now report SQLite cache health when SQLite mode is enabled.
- README and seeded docs now state that mdkg is pre-v1 public alpha software and cache/DAL contracts may churn before v1.

### Fixed

- Removed the accidental self-dependency on `mdkg` from package metadata.
- Hardened parallel `mdkg new`, checkpoint, task, work, archive, bundle import config, and index writes against naming conflicts and partial cache writes.

## 0.1.2 - 2026-05-19

### Added

- Added `.mdkg/index/capabilities.json` as a derived JSON cache for skills, `SPEC.md`, `WORK.md`, core docs, and design docs.
- Added read-only `mdkg capability list/search/show` commands with JSON output, kind filters, and advisory visibility filters.
- Added workspace `visibility` metadata for capability cache filtering, defaulting to `private`.
- Added capability cache health reporting to `mdkg doctor`.
- Added capability-cache smoke coverage for root plus child workspace aggregation and cache auto-rebuild.
- Added packed-package init smoke coverage for fresh base init, fresh `mdkg init --agent`, removed flag failures, repeated init idempotency, doctor/validate, upgrade dry-run parity, task creation, and pack generation.
- Added init preflight checks for seed config parseability and unmanaged skill mirror collisions.
- Added first-class archive sidecars under `.mdkg/archive` with `mdkg archive add/list/show/verify/compress`.
- Added deterministic single-file ZIP cache generation for archived source and artifact files.
- Added `type: archive` graph nodes and `archive://<archive.id>` reference validation.
- Added `mdkg work contract/order/receipt/artifact` lifecycle helpers for semantic mirror work contracts, work orders, receipts, and artifact registration.
- Added archive/work packed-package smoke coverage for fresh temp repositories.
- Added `mdkg bundle create/list/show/verify` for deterministic full `.mdkg` graph snapshot bundles.
- Added private and public bundle profiles with fail-closed public filtering for private graph and archive refs.
- Added bundle-local generated indexes (`global.json`, `skills.json`, `capabilities.json`) inside snapshot ZIPs.
- Added bundle unit and CLI coverage plus packed-package bundle smoke coverage.
- Added `mdkg bundle import add/list/rm/enable/disable/verify` for read-only child graph snapshot imports.
- Added `bundle_imports` config with explicit alias, bundle path, visibility, expected profile, source metadata, and optional staleness policy.
- Added `.mdkg/index/imports.json` as a derived import projection and health cache.
- Added packed-package bundle import smoke coverage.
- Added shared visibility policy enforcement for workspace nodes, archive sidecars, and imported bundle nodes.
- Added `mdkg pack --visibility public|internal|private` for explicit public-safe and internal-safe packs.
- Added `mdkg archive add --visibility private|internal|public` and `mdkg archive list --visibility ...`.
- Added packed-package visibility smoke coverage.
- Added `receipt_status: superseded` support for committed receipt mirrors.
- Added `mdkg work receipt new|update --receipt-status superseded` CLI parity with graph validation.
- Added runtime-style work/order/receipt fixture coverage with input refs, requested outputs, proof refs, artifacts, and hashes.
- Added local qid support for `mdkg work order update`, `mdkg work receipt update`, and `mdkg work artifact add`.
- Added `archive.large_cache_warning_bytes` config and `mdkg doctor` warnings for large committed archive ZIP caches.

### Changed

- `mdkg index` now writes the node index, skill index, and capability cache together.
- Generated bootstrap config now includes the default capability cache path and root workspace visibility.
- Docs and command matrix now teach capability discovery as separate from normal graph node search.
- Made `mdkg init --agent` the single canonical AI-agent bootstrap path.
- `mdkg init --agent` now creates `AGENTS.md` and `CLAUDE.md` alongside `AGENT_START.md`, `llms.txt`, `CLI_COMMAND_MATRIX.md`, default skills, event log, registry, and skill mirrors.
- Init manifests are now mode-aware: base init only claims base assets, while agent init claims the full agent bootstrap.
- Updated generated `.mdkg/README.md` onboarding to guide already-initialized repos toward `upgrade`, `new`, `search`, `pack`, and `validate`.
- Added first-ingestion guidance to `AGENT_START.md` for imported docs bundles.
- Hardened `WORK_ORDER.md` and `RECEIPT.md` templates with input refs, requested outputs, constraint refs, proof refs, attestation refs, and input/output hashes.
- Init ignore updates now ignore raw archive source copies under `.mdkg/archive/**/source/` while leaving sidecar `.md` files and ZIP caches commit-eligible.
- `mdkg doctor` now reports archive storage hygiene warnings for stray uncompressed archive files.
- Added default bundle config under `.mdkg/bundles` without making `mdkg index` rewrite bundles.
- Updated docs, command matrix, and release skills with bundle creation and verification guidance.
- Updated seeded init/upgrade skills so managed workspaces receive pre-commit archive compression and private bundle refresh guidance.
- `list`, `search`, `show`, `pack`, and `capability` now include enabled read-only bundle imports by default.
- Imported nodes use import-alias qids such as `child_repo:task-1` and expose original bundle/source metadata in JSON output.
- Stale imports warn during planning reads while `mdkg bundle import verify` exits nonzero.
- Public bundle creation now fails when public local nodes reference private or internal imported graphs.
- Public/internal bundle imports now require public bundle profiles.
- `mdkg validate` and `mdkg doctor` now report public/internal references to less-visible mdkg records.
- Archive JSON receipts now include sidecar visibility.
- Archive sidecars created from outside-repo files now redact `source_path` to `external:<basename>` instead of storing absolute local paths.
- `mdkg validate` and `mdkg archive verify` now share strict ZIP cache integrity checks for ZIP hash, readability, payload SHA-256, and payload byte size.
- Work mirror docs and templates now state the canonical-system boundary for production order, receipt, feedback, dispute, payment, ledger, marketplace, fulfillment, and execution state.
- Work lifecycle packed-package smoke now proves local qid mutation, order status updates, final superseded receipts, archive verification, indexing, show, and pack.

### Fixed

- Fixed fresh `mdkg init --agent` leaving missing managed wrapper docs that immediately required `mdkg upgrade --apply`.
- Fixed misleading init summaries by reporting manifest, ignore, registry, event log, core pin, and skill mirror actions.
- Fixed late init failure UX by printing a partial-init receipt with recovery guidance.
- Kept bundle output deterministic across repeated creates when only `.mdkg/bundles/` changes.
- Hardened publish readiness and init smoke checks to assert seeded release skills include archive compression and bundle refresh guidance.
- Mutating task and work update flows now reject imported qids with explicit read-only import errors.
- Work lifecycle mutation commands now reject imported order/receipt qids with explicit read-only bundle import guidance.
- Local graph indexing now allows edges to configured import aliases without treating them as missing local workspace nodes.
- Public bundle checks now reuse the same fail-closed policy as public/internal pack checks.
- `mdkg archive verify --json` now emits a verification receipt for corrupt archive ZIP caches instead of being blocked by strict index validation.

### Removed

- Removed `mdkg init --llm`, `mdkg init --agents`, `mdkg init --claude`, and `mdkg init --omni`; each now fails before mutation with guidance to use `mdkg init --agent`.

## 0.1.1 - 2026-05-12

### Added

- Added bundled template schema fallback so older workspaces can keep using graph inspection while missing newly introduced built-in templates.
- Added `safe_to_apply`, `will_write_paths`, `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects` fields to `mdkg upgrade --json`.

### Changed

- `mdkg new <built-in-type>` can use the installed package template when the workspace has not yet vendored that local template.
- `mdkg doctor` and `mdkg validate` warn, rather than fail, when packaged fallback schemas cover missing local built-in templates.
- `mdkg upgrade` human output now states whether the receipt is safe to apply and what paths would be written.
- `mdkg upgrade` skips ignored event logs and points users to `mdkg event enable` instead of creating ignored `.mdkg/work/events/events.jsonl` files.

## 0.1.0 - 2026-05-12

### Added

- Added conservative `mdkg upgrade` for existing workspaces.
- Added `.mdkg/init-manifest.json` ownership tracking for managed init assets.
- Added v0.0.9 seed fingerprints so clean older workspaces can safely adopt current init docs, templates, and default skills.
- Added `npm run smoke:upgrade` for packed-package upgrade verification in temporary workspaces.

### Changed

- `mdkg upgrade` defaults to dry-run; `mdkg upgrade --apply` is the only mutating upgrade path.
- Agent-enabled workspaces can receive safe managed default skill upgrades and mirror refreshes during upgrade.
- Publish readiness now checks packaged init manifests and runs upgrade smoke before publish.

## 0.0.9 - 2026-05-12

### Added

- Added generic agent workflow file support for `SPEC.md`, `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md`.
- Added `mdkg new <agent-file-type> ... --id <portable-id>` for semantic ids such as `agent.image-worker` and `work.generate-image`.
- Added validation support for `pricing_model: included`.
- Added validation support for `proposal_kind: skill_update` targeting `skill.<slug>` refs.
- Added generic skill extension output under `extensions`, with `ochatr_*` metadata mapped to `extensions.ochatr`.
- Added a non-mutating npm `postinstall` hint that points users to `mdkg --help` and prints shell PATH guidance only when needed.
- Added `docs/agent-runtime-0.0.9-handoff.md` to document the runtime migration path from implementation-specific naming to generic agent workflow naming.
- Added `npm run smoke:matrix` to pack mdkg, install it into an isolated temporary npm prefix, and exercise the command matrix plus onboarding workflows from the packaged CLI.

### Changed

- Renamed the remaining public Omni file-type surface to generic agent workflow language.
- Kept `mdkg init --omni` only as hidden migration guidance to `mdkg init --agent`.
- Updated README and command matrix version references to `0.0.9`.
- Removed stale prepublish wording and absolute local README links.
- Removed `AGENT_PROMPT_SNIPPET.md` and distilled its startup rules into `AGENT_START.md`, making `AGENT_START.md` the single first-hop agent onboarding doc.
- Treated ochatr.ai metadata as a vendor extension pattern rather than the base mdkg schema name.
- Added npm `prepack` and `prepublishOnly` guards so release commands fail if the built CLI or init assets are missing.
- Included `CHANGELOG.md` and `CONTRIBUTING.md` in the npm package because README links to them.

### Fixed

- Fixed strict validation gaps for room-runtime-style skill proposals and included pricing.
- Fixed docs drift between published `0.0.8`, local source version, and the 0.0.9 release target.

### Verification Status

- Passed: `npm ci` with `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.
- Passed: `npm run build`.
- Passed: `npm run test` with 306 tests.
- Passed: `npm run cli:check`.
- Passed: `node dist/cli.js validate`.
- Passed: `npm run smoke:consumer`.
- Passed: `npm run smoke:matrix`.
- Passed: `npm pack --dry-run --json`; tarball includes `dist/cli.js`, compiled command/core/graph/pack/template/util files, `dist/init/`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `LICENSE`, package metadata, and `scripts/postinstall.js`.
- Passed: `npm publish --dry-run`; `prepublishOnly` and `prepack` both completed successfully.
- Confirmed before publish: npm registry latest remains `mdkg@0.0.8`.

## 0.0.8

- Published npm baseline before the 0.0.9 agent workflow release work.
- Does not include agent workflow file types, mutation JSON receipt expansion, workspace enable/disable, or postinstall guidance.

## 0.0.7 and earlier

- Historical local and published release line for mdkg's initial CLI, graph, pack, skill, and agent-bootstrap work.
