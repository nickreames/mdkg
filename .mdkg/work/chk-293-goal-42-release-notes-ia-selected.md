---
id: chk-293
type: checkpoint
title: goal-42 release notes IA selected
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [spike-22]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [spike-22]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The goal-42 release-notes and launch IA spike selected docs.mdkg.dev as the
canonical public release-notes surface, with mdkg.dev carrying compact
source-backed 0.3.9 capability messaging. It also fixed the execution sequence:
release-note cards/details first, homepage and docs source updates next, local
Product Design/Browser proof next, and live Browser/Chrome verification only
after explicit push/deploy approval.

# Scope Covered

Scope is `spike-22`: research release notes IA, docs IA, Product Design audit
scope, Browser/Chrome verification plan, and article-support implications for
the `0.4.0` public launch lane.

## Changed Surfaces

- goal-42 execution plan and follow-up node guidance.
- source surfaces inspected: `mdkg-dev/src/pages/index.astro`,
  `docs/src/content/docs/project/changelog.md`, `docs/project/changelog.md`,
  and `docs/_generated/release-notes.json`.

## Boundaries

- in scope: IA, source-grounded planning, live-current gap analysis, and
  verification sequencing.
- out of scope: production deploy, git push, DNS, analytics, real `0.4.0`
  npm publish, git tag, and public launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Public release notes belong under `docs.mdkg.dev/project/changelog/` for this
  pass.
- `CHANGELOG.md` and generated release-note data remain the canonical facts.
- mdkg.dev should derive structured version metadata from package data and only
  summarize current 0.3.9 capabilities.
- Browser handles local desktop/mobile proof; Chrome/Browser live production
  proof waits for approved deploy.

# Implementation Summary

The spike produced the implementation order for `task-601` through `task-606`
and the test gates `test-307` through `test-312`. It also identified the
article support need: claims must map back to changelog/release-note facts,
examples, browser proof, and final package dry-run evidence.

# Audit Findings

- Reviewed surfaces: changelog, generated release notes, docs changelog source,
  mdkg.dev homepage source, live mdkg.dev/docs snapshots, and existing launch
  proof requirements.
- Findings: docs should own detailed release-note history; mdkg.dev needed
  current structured metadata and compact customization copy; live verification
  must remain separate from local source proof.
- Residual risk: production may remain stale until the local commits are pushed
  and Vercel rebuilds from the current source.

# Verification / Testing

## Command Evidence

- command: focused source/live inspection captured in the spike body.
- result: implementation plan accepted into goal-42 follow-up nodes.
- command: sequential focused smokes after implementation:
  `npm run smoke:mdkg-dev`, `npm run smoke:mdkg-dev-docs`, and
  `npm run smoke:mdkg-dev-seo`.
- result: passed; an earlier parallel smoke attempt was rejected as a build
  output race and rerun sequentially.

## Pass / Fail Status

- status: pass for planning/IA selection; production live proof remains open.

## Known Warnings

- warning: deploy, live production verification, `0.4.0` npm publish, git tag,
  DNS, and analytics changes remain explicit approval boundaries.

# Known Issues / Follow-ups

- Execute `task-601` through `task-605` with source-backed claims and local
  proof.
- Close `task-606` only after live currentness, article support, package
  dry-run, and final readiness recommendation evidence exist.

## Follow-up Refs

- `task-601`
- `task-602`
- `task-603`
- `task-604`
- `task-605`
- `task-606`

# Links / Artifacts

- `/private/tmp/mdkg-goal42-mdkg-dev.html`
- `/private/tmp/mdkg-goal42-docs-changelog.html`
- `/private/tmp/mdkg-goal42-docs-home.html`
- `/private/tmp/mdkg-goal42-product-design-audit-20260627`

# Raw Content Safety

- Summarized findings and local artifact paths only; no raw secrets, raw
  prompts, raw payloads, private provider UI, or bulky logs are stored here.
