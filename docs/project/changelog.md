# Changelog

The package changelog in the repository root remains canonical:

```text
CHANGELOG.md
```

This page gives a product-level summary of the public-alpha release line. Use the root changelog for exact dates and patch-level details.

Recent release cards:

- `0.5.1` latest public alpha, 2026-07-14: local-workspace archive compression
  ownership, exact qid targeting, full-set preflight, and transparent
  selected/excluded workspace receipts for graphs with read-only imports.
- `0.5.0` public alpha, 2026-07-11: first-class reusable loops, seven
  bundled read-only or planning templates, identity-bound readiness and
  evidence, observational fork dry-runs, provenance, and blocker continuation.
- `0.4.2` public alpha, 2026-07-05: low-level `mdkg git`
  clone/fetch/inspect/closeout/push-readiness/push primitives, sanitized Git
  descriptors, static closeout receipts, and external-auth safety boundaries.
- `0.4.1` public alpha, 2026-07-04: generic contract-profile metadata,
  profile validation, scaffold/helper flags, and runtime-boundary docs for
  agent workflow mirrors.
- `0.4.0` public alpha, 2026-06-27: public launch readiness for
  mdkg.dev and docs.mdkg.dev, source-backed release metadata, npm gates, Vercel
  currentness, and Chrome live-validation blockers.

## 0.5.1 details

`0.5.1` makes archive compression ownership explicit for repositories whose
merged graph contains both writable local workspaces and read-only imported
subgraphs.

### Changed

- `archive compress --all` selects archives owned by enabled local workspaces;
  `--ws <local-alias>` limits that writable selection.
- Direct compression accepts exact workspace-qualified archive qids, and JSON
  and text receipts identify selected workspaces and excluded read-only
  projections.

### Fixed

- Imported ZIP-fragment projection paths are rejected before filesystem path
  construction, and the complete local selection passes ownership, containment,
  symlink, raw-input, sidecar, and destination preflight before the first write.

## 0.5.0 details

`0.5.0` adds one first-class `loop` node type for reusable processes that can
coordinate goals, work nodes, decisions, checkpoints, receipts, evidence, and
repeated attempts while preserving durable process state in the graph.

### Added

- `mdkg loop list`, `show`, `fork`, `plan`, `next`, and `runs`, plus guided raw
  creation with `mdkg new loop`.
- Identity-bound readiness questions, action approvals, evidence lanes, and
  typed decision/approval waivers.
- Stable fork provenance, stale-template warnings, default child
  materialization, and planning-only forks.
- Seven bundled read-only or planning templates and the `pursue-mdkg-loop`
  execution skill.

### Changed

- Loops participate in validation, discovery, JSON and SQLite indexes,
  deterministic packs, init, upgrade, help, and generated command contracts.
- Fork dry-runs do not consume IDs or mutate graph, event, index, or filesystem
  state.
- `loop next` continues other authorized lanes before reporting the whole loop
  blocked.
- Coding-agent harnesses execute agents and tools; mdkg preserves the process,
  readiness, provenance, and evidence graph.

### Security

- Graph target writes reject symlink containment escapes before mutation.
- Bundle and subgraph ZIP inflation enforces bounded entry and output budgets.

## 0.4.2 details

`0.4.2` adds direct Git lifecycle primitives for repos where an agent run needs
to clone or fetch source, close out mdkg state, prove push readiness, and push a
checkpoint after explicit approval.

### Added

- `mdkg git inspect`, `clone`, `fetch`, `closeout`, `push-ready`, and `push`.
- Sanitized Git source descriptors and accepted-revision receipts with branch,
  commit SHA, tree hash, and external-auth metadata.
- Static JSON/Markdown closeout receipts, plus sealed SQLite snapshot and
  deterministic dump evidence when project DB state participated.

### Changed

- Push readiness requires explicit remote and branch, clean worktree, passing
  mdkg validation, credential-free remote config, and valid DB snapshot evidence
  when DB state participated.
- Git authentication is external to mdkg through system Git, credential
  helpers, SSH, `gh`, CI/runtime environment, or shell state.
- Project-memory semantic query UX is deferred to a later CocoIndex-grounded
  design lane.

### Security

- Repository refs and push remotes with embedded URL credentials are rejected,
  and inspected remote URLs are redacted before they reach receipts.

## 0.4.1 details

`0.4.1` adds generic contract-profile metadata for agent workflow mirrors while
keeping runtime execution and final receipt authority outside mdkg.

### Added

- `contract_profile` for MANIFEST, WORK, WORK_ORDER, and RECEIPT semantic
  mirrors.
- `validation_policy_ref` and `evidence_policy_ref` for MANIFEST, WORK_ORDER,
  and RECEIPT.
- RECEIPT-only `receipt_kind` and `redaction_class`.
- Explicit profile validation with `mdkg validate --profile omni-room` and
  `mdkg work validate --profile omni-room`.
- Scaffold/helper flags for `mdkg new manifest|work|work_order|receipt` and
  `mdkg work contract|order|receipt new`.

### Changed

- Default templates, init assets, seeded skills, and generated command
  references demonstrate generic profile metadata without adding runtime-only
  queue, provider, billing, ledger, or final-receipt state.
- Public docs distinguish `contract_profile`, MANIFEST `resource_profile`, WORK
  `kind`, WORK_ORDER `artifact_policy`, RECEIPT `redaction_policy`,
  `receipt_kind`, `redaction_class`, and pack/bundle `--profile` flags.
- Omni Room remains responsible for runtime policy, queue execution, final
  receipt normalization, and downstream adoption.

## 0.4.0 details

`0.4.0` turns the website/docs launch track into a release-ready surface with
package metadata, generated docs, npm gates, Vercel proof, and Chrome live
validation wired into the mdkg graph.

### Added

- `0.4.0` public launch-readiness blockers for source metadata, changelog,
  generated docs, npm prepublish gates, npm postpublish validation, Vercel
  production currentness, and Chrome live validation.
- Public release-note and docs coverage for the launch surface, including
  per-release cards and source-backed currentness requirements.
- Vercel and Chrome evidence requirements before the production site/docs can
  claim the `0.4.0` launch is live.

### Changed

- mdkg.dev and docs.mdkg.dev source copy now present the `0.4.0` release target
  while keeping publish/deploy approval boundaries explicit.
- Public docs examples use `mdkg pack --profile concise`.
- Source-visible package references and generated docs align with `0.4.0`.

### Fixed

- mdkg.dev primary CTA buttons use an overscanned clipped gradient layer for
  smoother rounded corners.

## 0.3.9 details

`0.3.9` made mdkg easier to adapt for teams without turning local customization
into a fork of the CLI kernel.

### Added

- `.mdkg/config.json` customization overlays for organization standards, custom
  core docs, and configured skill mirror target paths while keeping the mdkg CLI
  kernel upgradable through `mdkg upgrade --apply`.
- Configurable skill mirror support so repos can mirror canonical
  `.mdkg/skills` into arbitrary contained agent-local skill roots.
- `COLLABORATION.md` as the canonical collaboration/operator profile core doc,
  with `HUMAN.md` kept as a one-release legacy alias.
- Deterministic release-notes data generation from `CHANGELOG.md`.

### Changed

- `mdkg init --agent` and `mdkg upgrade --apply` now seed and preserve
  customization overlays, configurable mirrors, `COLLABORATION.md`, legacy
  `HUMAN.md`, and accurate managed init-manifest hashes.
- First-party mdkg skills and default init seed skills now cover current CLI
  usage, MANIFEST authoring, configured mirror targets, pre-publish gates, and
  explicit no-publish/no-tag/no-push approval boundaries.
- `npm run docs:check` and `prepublishOnly` now verify generated CLI docs,
  generated release-note data, and public command examples before publish.

Earlier public-alpha milestones:

- `0.3.8`: MANIFEST naming, SPEC compatibility warnings, warning-scale
  validation summaries, and multi-repo closeout guidance.
- `0.3.7`: completed-goal `last_active_node`, semantic refs, checkpoint kinds,
  workflow validation, queue adapter contract, and handoff creation.
- `0.3.6`: graph import selected-goal hardening and read-only local MCP server.
- `0.3.5`: graph clone, fork, and template import workflows.
- `0.3.4`: branch-safe id repair planning and apply flows.
- `0.3.3`: single-active-goal lifecycle and archived goals.
- `0.3.2`: first-class research spike work nodes.
- `0.3.1`: operator status, strict doctor checks, fix planning, subgraph safety, branch safety, and generated command contract groundwork.
- `0.3.0`: SPEC and work invocation surfaces for agent-readable work contracts.

For exact dates and patch notes, read the root `CHANGELOG.md`.
