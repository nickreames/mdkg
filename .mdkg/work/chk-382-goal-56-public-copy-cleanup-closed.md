---
id: chk-382
type: checkpoint
title: goal-56 public copy cleanup closed
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md, /private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.json, /private/tmp/mdkg-public-copy-cleanup-20260706/focused-screenshots.json]
relates: [goal-56]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-56, task-663, task-664, task-665, test-342, test-343]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

Goal-56 achieved its local cleanup condition. The audited mdkg.dev and
docs.mdkg.dev public surfaces no longer expose the identified internal
meta/process language, generated release-note data is aligned from
`CHANGELOG.md`, local builds and smokes passed, and fresh Browser/Product
Design evidence shows no remaining weird public meta language in the audited
rendered pages.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Homepage public copy: `mdkg-dev/src/pages/index.astro`
- Changelog/release notes: `CHANGELOG.md`,
  `docs/src/content/docs/project/changelog.md`,
  `docs/_generated/release-notes.json`
- Demo/install copy: `mdkg-dev/src/data/demoSnapshots.ts`,
  `mdkg-dev/src/pages/demo/[id]/output.astro`,
  `mdkg-dev/public/demo-001/ocean-flow-map.svg`,
  `docs/src/content/docs/start-here/install.md`,
  `docs/src/content/docs/advanced-alpha/demo-graphs.md`
- Regression smokes: `scripts/smoke-mdkg-dev.js`,
  `scripts/smoke-mdkg-dev-seo.js`
- mdkg evidence: `task-663`, `task-664`, `task-665`, `test-342`,
  `test-343`, `chk-377` through `chk-382`

## Boundaries

- in scope: local source/docs/site copy, generated release-note data, local
  builds, local smoke checks, and local Browser/Product Design evidence.
- out of scope: live production validation, Vercel deployment, push, tag, npm
  publish, DNS, analytics, provider mutation, package behavior, and runtime
  behavior.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

Public-facing copy now describes stable user value: team customization,
repo-local config overlays, managed skills, core docs, optional preview
readiness, package smoke tests, and shipped 0.4.0 website/docs outcomes. The
cleanup removes the previously identified launch-track, postpublish/postdeploy,
Vercel/Chrome proof, preview approval, provider mutation, raw prompt payload,
and release-validation wording from audited public site/docs surfaces.

# Goal Closeout

- Goal condition result: achieved locally.
- Scoped nodes closed: `task-663`, `task-664`, `task-665`, `test-342`, and
  `test-343` are done.
- Remaining deferred work: live production validation is deferred until a later
  explicit push/deploy request. Non-rendered example-template fixtures still
  contain preview-approval workflow wording and can be cleaned in a separate
  template-copy pass if they become reader-facing documentation.

# Verification / Testing

## Command Evidence

- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: `ok: true`.
- `node dist/cli.js validate --changed-only --json`: `ok: true`.
- `npm run docs:release-notes`: passed.
- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run docs:check`: passed.
- `git diff --check`: passed.
- Public source/build phrase scan: no matches in `mdkg-dev/src`,
  `mdkg-dev/public`, `mdkg-dev/dist`, `docs/src`, `docs/dist`,
  `docs/_generated/release-notes.json`, or `CHANGELOG.md`.
- Browser audit: 18 desktop/mobile page checks, 0 forbidden phrase failures, 0
  console error pages.

## Pass / Fail Status

- status: passed

## Known Warnings

- none

# Known Issues / Follow-ups

- Optional follow-up: clean preview-approval workflow wording from
  `examples/website-demo-template/**` and `examples/demo-runs/demo-001/**`.
  Those files are public repo fixtures but were not part of rendered
  mdkg.dev/docs.mdkg.dev validation.

## Follow-up Refs

- task/test/goal refs:

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.json`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/focused-screenshots.json`
- `chk-377`
- `chk-378`
- `chk-379`
- `chk-380`
- `chk-381`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
