---
id: epic-28
type: epic
title: pre release audit for unpublished mdkg 0.1.2 package
status: done
priority: 1
tags: [release, audit, prepublish, 0_1_4, npm]
owners: []
links: [npm:mdkg]
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, package.json, package-lock.json]
relates: [epic-19, epic-22, epic-23, epic-24, epic-25, epic-26, epic-27]
blocked_by: []
blocks: [task-157, task-158, task-159, task-160, task-161, task-162, task-163, task-164]
refs: [rule-3, rule-4, rule-5, rule-6, edd-3, edd-8]
aliases: [pre-release-audit-0-1-4, unpublished-release-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Goal

Audit the full unpublished mdkg package surface before publishing the next npm
version. The audit covers the local `0.1.2` package line against the currently
published npm baseline recorded in the audit plan, with special focus on all
changes introduced after the `0.1.1` release.

# Scope

Included release surfaces:
- `0.1.2`: capability cache, init/upgrade parity, archive sidecars, work
  lifecycle helpers, deterministic full `.mdkg` graph snapshot bundles,
  read-only bundle imports, visibility enforcement, stricter archive
  validation, and hardened work/order/receipt mirrors.
- Public CLI, config, templates, docs, seeded init assets, package contents,
  and dry-run publish gates.

# Milestones

- Confirm registry/local version baseline and release scope.
- Audit CLI/docs/help parity for all new command surfaces.
- Prove init, upgrade, archive, work lifecycle, bundle, import, visibility, and
  capability-cache behavior in temp or packaged smoke environments.
- Inspect package contents and run full publish dry-run.
- Record final blockers, residual risks, and publish approval recommendation.

# Out of Scope

- No real `npm publish` until a separate explicit approval.
- No consumer repo edits.
- No source behavior changes unless an audit task finds a release blocker.
- No new feature implementation beyond blocker fixes discovered during audit.

# Risks

- The release combines several large related surfaces, so docs/help/package
  drift is the main risk.
- Public/private visibility and archive ZIP integrity need fail-closed checks
  because mistakes could leak private records or ship invalid evidence caches.
- Bundle imports and capability caches are derived views; stale cache behavior
  must be understandable before publishing.

# Links / Artifacts

- `task-157`
- `task-158`
- `task-159`
- `task-160`
- `task-161`
- `task-162`
- `task-163`
- `task-164`

# Closeout

Read-only pre-release audit completed for the unpublished `mdkg@0.1.2`
package line. The audit covered release baseline, CLI/docs/help parity,
init/upgrade behavior, archive and work lifecycle mirrors, bundle/import and
visibility behavior, capability cache/indexing, package contents, and publish
dry-run readiness.

Result: approved for real npm publish after separate explicit user approval.
No source behavior changes were made in this audit closeout. The only
repository changes in this pass are graph documentation nodes for `epic-28`
and `task-157` through `task-164`.
