---
id: edd-56
type: edd
title: config overlay upgradable kernel and skill mirror target architecture
tags: [0.3.9, architecture, config-overlays, upgrade, skill-mirrors]
owners: []
links: []
artifacts: [.mdkg/config.json, assets/init/config.json, src/core/config.ts, src/commands/init.ts, src/commands/upgrade.ts, src/commands/skill_mirror.ts]
relates: []
refs: [dec-51, dec-52, dec-53]
aliases: []
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Design the `0.3.9` mdkg kernel customization model: config overlays after init,
upgrade-safe mdkg-managed assets, arbitrary skill mirror target paths, and the
`COLLABORATION.md` compatibility bridge.

# Architecture

- `.mdkg/config.json` remains the local customization control plane.
- Overlay-owned values are operator policy and must survive `mdkg upgrade`.
- mdkg-managed kernel assets may be refreshed by upgrade when local changes do
  not conflict or when the operator explicitly applies the receipt.
- Skill mirrors copy from canonical `.mdkg/skills/` into configured local paths.
- `.agents/skills/` and `.claude/skills/` remain default mirror targets.

# Data model

- Config overlay policy: organization standards, seeded assets, custom core docs,
  and mirror target paths.
- Kernel asset receipt: records what upgrade would replace, preserve, migrate,
  or skip.
- Skill mirror target: a normalized repo-relative path with audit/sync/prune
  behavior.
- Collaboration doc bridge: canonical `COLLABORATION.md`, legacy `HUMAN.md`
  alias, and compatibility warnings.

# APIs / interfaces

- `mdkg init --agent` seeds defaults without requiring profile selection.
- `.mdkg/config.json` configures overlays after init.
- `mdkg upgrade` previews overlay-aware changes.
- `mdkg upgrade --apply` updates mdkg-managed assets while preserving overlay
  ownership.
- `mdkg skill sync/audit/prune` operate on configured mirror paths.

# Failure modes

- Local overlay conflicts with a kernel update: report and preserve local
  content unless the operator explicitly applies a migration.
- Custom mirror path is outside the repo or unsafe: fail closed.
- `COLLABORATION.md` and `HUMAN.md` diverge: prefer canonical
  `COLLABORATION.md` and warn about the legacy alias.
- Default mirrors missing from config: preserve backward-compatible defaults.

# Observability

- Upgrade receipts list preserved overlays, updated kernel assets, skipped
  conflicts, and bridge migrations.
- Skill mirror audit reports source, target path, stale files, and prunable
  outputs per configured target.

# Security / privacy

- Config overlays must not store secrets.
- Mirror paths must remain repo-local unless a future explicit trust model is
  designed.
- Upgrade must not overwrite local policy docs silently.

# Testing strategy

- Temp-repo init/upgrade smoke with custom standards and mirror targets.
- Regression coverage for default `.agents` and `.claude` mirrors.
- Compatibility coverage for `COLLABORATION.md`/`HUMAN.md` and
  MANIFEST/SPEC bridge coexistence.

# Rollout plan

Ship in `0.3.9` behind explicit config and upgrade behavior. Public docs should
describe overlays only after the implementation and temp-repo proof pass.
