---
title: Changelog
description: Public-alpha release highlights.
---

The package changelog in the repository root remains canonical:

```text
CHANGELOG.md
```

This page gives a product-level summary of the public-alpha release line. Use the root changelog for exact dates and patch-level details.

Recent release cards cover `0.5.2`, `0.5.1`, and `0.5.0`; earlier milestones
remain listed below for continuity.

<div class="release-grid" aria-label="Recent mdkg release cards">
  <article class="release-card current">
    <p class="release-meta">Latest public alpha - 2026-07-15 - 4 notes</p>
    <h2>0.5.2</h2>
    <p>Strict generic Git source materialization with accepted-revision verification and bounded redacted receipts.</p>
    <ul>
      <li>Materialize a credential-free repository request with <code>mdkg git materialize --request &lt;file|-&gt; --json</code>.</li>
      <li>Verify the required commit and optional tree before a contained destination is published atomically.</li>
      <li>Disable prompts, hooks, push, recursive submodules, and repository-controlled execution while keeping receipts bounded.</li>
    </ul>
  </article>
  <article class="release-card">
    <p class="release-meta">Public alpha - 2026-07-14 - 3 notes</p>
    <h2>0.5.1</h2>
    <p>Archive compression now has an explicit local-workspace mutation boundary in graphs that include read-only imported subgraphs.</p>
    <ul>
      <li>Use <code>archive compress --all --ws &lt;local-alias&gt;</code> to limit bulk mutation to one enabled local workspace.</li>
      <li>Target exact archive qids while imported qids fail closed with source-workspace guidance.</li>
      <li>Preflight the complete local selection before writing and inspect selected/excluded workspaces in command receipts.</li>
    </ul>
  </article>
  <article class="release-card">
    <p class="release-meta">Public alpha - 2026-07-11 - 18 notes</p>
    <h2>0.5.0</h2>
    <p>First-class reusable loops for durable audit and planning processes that span goals, readiness decisions, evidence lanes, and blocker recovery.</p>
    <ul>
      <li>Create raw loops or fork seven bundled read-only and planning templates with stable provenance.</li>
      <li>Inspect readiness and route authorized work with <code>mdkg loop plan</code>, <code>next</code>, and <code>runs</code>.</li>
      <li>Use observational fork dry-runs across JSON and SQLite without consuming IDs or mutating graph state.</li>
    </ul>
  </article>
</div>

## 0.5.2 details

`0.5.2` adds a generic Git materialization primitive for callers that need to
turn a credential-free repository request into a verified local source tree
without accepting a moved ref, executing repository-controlled behavior, or
leaking operational details into receipts.

### Added

- `mdkg git materialize --request <file|-> --json` accepts the strict
  `mdkg.git.materialize.request.v1` JSON contract and verifies the required
  commit plus an optional tree across SHA-1 and SHA-256 repositories.
- Requests declare bounded auth, depth, submodule, project-memory, destination,
  and accepted-revision policy; successful destinations are published only by
  a same-parent atomic rename after every check passes.
- `mdkg.git.materialize.receipt.v1` records bounded identity, policy, cleanup,
  destination, reason-code, and warning evidence, with installed-tarball
  consumer coverage and a dedicated advanced-alpha guide.

### Security

- Materialization invokes system Git with argv and no shell, disables prompts
  and hooks, prohibits push and recursive submodules, and never indexes or
  executes repository scripts, hooks, skills, or commands.
- Receipts exclude credentials, environment values, helper output, socket
  paths, raw Git output, repository contents, and absolute local paths.

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

`0.5.0` adds one first-class `loop` node type for reusable, inspectable
processes that can coordinate goals, tasks, tests, spikes, decisions,
checkpoints, receipts, evidence, and repeated attempts.

### Added

- `mdkg loop list`, `show`, `fork`, `plan`, `next`, and `runs`, plus guided raw
  creation through `mdkg new loop`.
- Identity-bound readiness questions, action approvals, evidence lanes, and
  paired decision/approval waivers.
- Stable template identity, content hashes, stale-fork warnings, default child
  materialization, and a planning-only fork mode.
- Seven bundled read-only or planning templates, led by the security audit.
- The `pursue-mdkg-loop` skill for exhausting authorized lanes and recording
  grounded blocker recovery before the whole loop blocks.

### Changed

- Loops participate in parsing, validation, search, show/list output, JSON and
  SQLite indexes, deterministic packs, init, upgrade, help, and command
  contracts.
- Fork dry-runs are observational: they do not reserve IDs, append events,
  persist indexes, or write graph files.
- `loop next` continues authorized work around gated lanes while useful work or
  blocker-recovery paths remain.
- mdkg preserves loop process state; the coding-agent harness remains
  responsible for executing agents and tools.

### Security

- Graph target writes reject symlink containment escapes before destination
  mutation.
- Bundle and subgraph ZIP inflation is bounded by entry count, compressed size,
  output size, total output, and expansion ratio.

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

`0.4.0` refreshed the website and docs for the public alpha, with clearer
customization guidance, release cards, generated references, and smoother
mdkg.dev CTA rendering.

### Added

- Public release cards and changelog detail pages for recent public-alpha
  versions.
- Docs coverage for config overlays, custom skill mirrors, `COLLABORATION.md`,
  MANIFEST naming, and public-alpha customization guidance.
- mdkg.dev and docs.mdkg.dev copy updates that keep public claims bounded to
  documented capabilities.

### Changed

- mdkg.dev and docs.mdkg.dev source copy now presents the `0.4.0` public-alpha
  capabilities with reader-facing customization and Plan -> Work -> Evidence
  guidance.
- Public docs examples use `mdkg pack --profile concise`.
- Source-visible package references, generated release-note data, and generated
  CLI docs align with `0.4.0`.

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

## Earlier public-alpha milestones

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

<style>
  .release-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin: 1.5rem 0 2rem;
  }

  .release-card {
    display: grid;
    gap: 0.75rem;
    align-content: start;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    padding: 1rem;
    background: var(--sl-color-bg-nav);
  }

  .release-card.current {
    grid-column: 1 / -1;
    border-color: var(--sl-color-accent);
  }

  .release-card h2,
  .release-card p {
    margin: 0;
  }

  .release-card h2 {
    color: var(--sl-color-white);
  }

  .release-meta {
    color: var(--sl-color-gray-2);
    font-size: 0.85rem;
  }

  @media (max-width: 920px) {
    .release-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
