---
id: chk-539
type: checkpoint
title: goal-73 version-driven docs release supplement verified
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-73, task-793, test-455, task-794, test-456, task-795, task-796, test-457, task-797]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-73]
created: 2026-07-16
updated: 2026-07-16
---
# Summary

The hardcoded v0.5.0 docs supplement was replaced by one evergreen projection
and component driven by `release/public-release.json` plus generated changelog
data. Local automation, responsive Chrome checks, exact-SHA Vercel production
deployment, and canonical Chrome checks all passed for implementation commit
`27005ece67a27bb9fcfb1a2b1ada45dc054ddddd`.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Added `docs/src/data/currentRelease.mjs` and
  `docs/src/components/CurrentReleaseSupplement.astro`.
- Updated the Footer projection, release-note generator, generated release-note
  JSON, route smoke coverage, public-release tests, and root Changelog.
- Replaced release-specific IDs/copy with generated Install, Changelog, and
  Generated CLI Reference variants.
- Updated goal-73 task/test evidence and the mdkg SQLite index.

## Boundaries

- in scope: docs projection/component, generated release notes, tests, non-force
  `main` pushes, automatic production deployments, and read-only Chrome checks.
- out of scope: npm publication, version bump, Git tag, DNS, manual Vercel
  deployment, provider configuration, CLI behavior, and authored mdkg-dev copy.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes; evidence is bounded to command summaries, IDs, URLs, and local artifact
  paths.

# Decisions Captured

- `dec-84`: shared release manifest owns version/state/qualifier; generated
  notes own date/count/sections/highlights.
- `edd-78`: visible release metadata must resolve consistently or fail the
  build; components and dynamic checks remain version-neutral.
- Related release architecture: `edd-57`, `edd-71`, and `task-738`.

# Implementation Summary

`projectCurrentRelease` is a pure, tested projector. Published state requires
exact target/package/latest-release parity and a matching generated release.
Enabled draft preview uses `target_version` plus `Unreleased`; hidden draft
renders nothing. Generated inline-code text is rendered structurally without
raw HTML. The three route supplements remain compact and evergreen.

# Goal Closeout

- Goal condition result: passed for implementation, local validation, exact-SHA
  implementation production deployment, and canonical Chrome proof.
- Scoped nodes closed: `task-792`, `task-793`, `test-455`, `task-794`,
  `test-456`, `task-795`, `task-796`, `test-457`, and `task-797`.
- Remaining deferred work: none. Final graph-only deployment proof is checked
  externally after the closeout push to avoid a recursive evidence commit.

# Verification / Testing

## Command Evidence

- `npm run test:public-release`: 18 passed, 0 failed.
- `npm run docs:release-notes` and `npm run docs:release-notes:check`: passed.
- `npm run docs:check`, `npm --prefix docs run build`, and
  `npm run smoke:mdkg-dev-docs`: passed.
- `npm run test`: 658 compiled tests plus the 18-test public-release/security
  suite passed.
- `node dist/cli.js validate --json` and `--changed-only --json`: zero warnings
  and zero errors.
- `git diff --check`: passed.
- Chrome local and canonical: six docs route/viewport checks each passed at
  `1440x900` and `390x844`; no console errors or horizontal overflow.

## Pass / Fail Status

- status: pass.

## Known Warnings

- warning: none.

# Known Issues / Follow-ups

- No unresolved issue. The final closeout deployment check is an execution
  closeout receipt rather than another graph mutation.

## Follow-up Refs

- task/test/goal refs: none.

# Links / Artifacts

- implementation commit: `27005ece67a27bb9fcfb1a2b1ada45dc054ddddd`.
- mdkg-docs deployment: `dpl_HV13PifDwM6heBwuwC7krCs4TFJt`, `READY`,
  production `main`, exact implementation SHA, canonical
  `https://docs.mdkg.dev/`.
- mdkg-dev deployment: `dpl_LdQHRUtgyJssUxooLMLEvmRe875y`, `READY`,
  production `main`, exact implementation SHA, canonical `https://mdkg.dev/`.
- local receipt: `/private/tmp/mdkg-goal73-current-release/local-dom-receipt.json`.
- live receipt: `/private/tmp/mdkg-goal73-current-release/live-dom-receipt.json`.
- screenshots: six local docs PNGs, six live docs PNGs, and one live mdkg.dev
  PNG in `/private/tmp/mdkg-goal73-current-release/`.

# Raw Content Safety

- Evidence uses refs, commit/deployment identities, canonical URLs, and bounded
  receipts. No raw secret, environment value, credential, prompt, payload, or
  bulky trace is stored.
