---
title: Changelog
description: Public-alpha release highlights.
---

The package changelog in the repository root remains canonical:

```text
CHANGELOG.md
```

This page gives a product-level summary of the public-alpha release line. Use the root changelog for exact dates and patch-level details.

Recent release cards cover `0.3.9`, `0.3.8`, and `0.3.7`; earlier milestones
remain listed below for continuity.

<div class="release-grid" aria-label="Recent mdkg release cards">
  <article class="release-card current">
    <p class="release-meta">Latest public alpha - 2026-06-27 - 7 notes</p>
    <h2>0.3.9</h2>
    <p>Config overlays, configurable skill mirrors, <code>COLLABORATION.md</code>, refreshed first-party skills, and release-note automation.</p>
    <ul>
      <li>Customize <code>.mdkg/config.json</code> for organization standards, custom core docs, and managed skill mirror targets.</li>
      <li>Mirror canonical <code>.mdkg/skills</code> into arbitrary contained agent-local skill roots while keeping <code>.agents/skills</code> and <code>.claude/skills</code> as defaults.</li>
      <li>Use <code>COLLABORATION.md</code> as the canonical operator profile while <code>HUMAN.md</code> stays as a one-release compatibility alias.</li>
    </ul>
  </article>
  <article class="release-card">
    <p class="release-meta">Public alpha - 2026-06-25 - 7 notes</p>
    <h2>0.3.8</h2>
    <p>MANIFEST naming, SPEC compatibility warnings, warning-scale validation summaries, and multi-repo closeout guidance.</p>
  </article>
  <article class="release-card">
    <p class="release-meta">Public alpha - 2026-06-20 - 19 notes</p>
    <h2>0.3.7</h2>
    <p>Completed-goal <code>last_active_node</code>, semantic refs, checkpoint kinds, workflow validation, queue adapter contract, and handoff creation.</p>
  </article>
</div>

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
