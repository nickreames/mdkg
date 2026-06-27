---
id: chk-304
type: checkpoint
title: goal-42 readiness audit found live and 0.4.0 gaps
checkpoint_kind: audit
status: backlog
priority: 9
tags: [0.4.0, audit, browser, product-design, publish-readiness, launch-proof]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-readiness-audit-20260627, /private/tmp/mdkg-goal42-readiness-audit-20260627/browser-evidence.json, /private/tmp/mdkg-goal42-readiness-audit-20260627/product-design-audit.md]
relates: [task-610]
blocked_by: []
blocks: []
refs: [goal-42, test-314, task-605, test-308, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-610, test-314, task-605, test-308, task-606, test-312]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Completed the read-only `goal-42` audit side-lane for recent launch/docs and
`0.4.0` publish-readiness changes.

Verdict: `not ready with exact gaps`.

Local source/build/package evidence is healthy for the current `0.3.9` package
state, but live production is not current with the local site/docs source and
`package.json` remains `0.3.9`. A real `0.4.0` npm publish dry-run was
therefore intentionally not run because it would not prove `0.4.0` readiness.

# Scope Covered

- `goal-42`
- `task-610`
- `test-314`
- `task-605`
- `test-308`
- `task-606`
- `test-312`
- refreshed `origin/main..HEAD`
- local built mdkg.dev and docs outputs
- live read-only `mdkg.dev` and `docs.mdkg.dev/project/changelog/`
- npm registry state for `mdkg` latest and `mdkg@0.4.0`

## Changed Surfaces

- mdkg graph/evidence only: `task-610`, `test-314`, `goal-42`, `chk-304`, and
  regenerated root `.mdkg/index/mdkg.sqlite`.
- local-only audit artifacts under
  `/private/tmp/mdkg-goal42-readiness-audit-20260627`.
- no source, docs, package, website, npm payload, provider, DNS, analytics,
  publish, tag, deploy, or push mutation was performed.

## Boundaries

- in scope: read-only audit, screenshots, Browser DOM checks, Product Design
  classification, local/package gates, registry reads, graph checkpoint.
- out of scope: source/docs/package/site edits, deployment, provider mutation,
  DNS, analytics, git push/tag, npm publish, and `0.4.0` implementation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  summarized command outcomes and local artifact paths are recorded instead.

# Decisions Captured

- `0.4.0` npm publish readiness cannot be confirmed while package metadata is
  still `0.3.9`.
- live-current mdkg.dev/docs gaps remain blocked by explicit push/redeploy/live
  verification approval and stay with `task-605`.
- `goal-42` remains the canonical website/docs launch lane; no duplicate goal
  was created.

# Implementation Summary

- Added and executed `task-610` as a temporary audit side-lane under `goal-42`.
- Added and satisfied `test-314` as the readiness audit contract.
- Captured fresh Product Design and Browser artifacts under
  `/private/tmp/mdkg-goal42-readiness-audit-20260627`.
- Closed the audit as evidence only; `task-605` remains open.

# Audit Findings

- Reviewed surfaces: local built mdkg.dev homepage, local built docs changelog,
  live `mdkg.dev`, live `docs.mdkg.dev/project/changelog/`, local package
  gates, npm registry, git range `origin/main..HEAD`, and generated package
  payload dry-run.
- Findings:
  - local mdkg.dev structured data reports `softwareVersion: "0.3.9"` and
    includes 0.3.9 customization markers: `.mdkg/config.json`,
    `COLLABORATION.md`, `HUMAN.md`, and custom skill mirror copy.
  - local docs changelog exposes 0.3.9 release cards/grid and details for
    config overlays, custom skill mirrors, `COLLABORATION.md`, first-party
    skill refresh, and release-note automation.
  - live `mdkg.dev` still reports structured `softwareVersion: "0.3.7"` and
    lacks the new 0.3.9 customization markers.
  - live docs changelog includes 0.3.9 milestone text but lacks the local
    release-card/grid surface and `.mdkg/config.json` marker.
  - `package.json` remains `0.3.9`; `mdkg@0.4.0` is not published; true
    `0.4.0` publish-readiness is not established.
  - Browser reported zero console warnings/errors for the checked local and
    live pages.
  - high-confidence public-output secret heuristic over `mdkg-dev/dist` and
    `docs/dist` returned no matches.
- Residual risk: Browser evidence is read-only and does not replace a final
  live Browser/Chrome verification after approved redeploy.

# Verification / Testing

## Command Evidence

- `git fetch origin main`: passed.
- `git status --short --branch`: `main...origin/main [ahead 7]` before this
  audit commit, with only mdkg graph/index changes after cleanup.
- `git rev-list --left-right --count origin/main...HEAD`: `0 7`.
- `git log --oneline origin/main..HEAD`: seven local commits, `7050eba`
  through `555c196`.
- `git diff --name-status origin/main..HEAD`: graph/checkpoint changes plus
  the already-reviewed site/docs/script release work.
- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed, with a non-fatal `Entry docs -> 404
  was not found` warning from the docs build.
- `npm run build`: passed.
- `npm run test`: passed, 528 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- `npm run docs:check`: passed, 402 checked examples and 0 failures.
- `node scripts/assert-publish-ready.js`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:demo-graph`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`:
  passed for `mdkg@0.3.9`, package size 341079, unpacked size 1803915,
  entry count 176.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: `0.3.9`.
- `npm view mdkg@0.4.0 version --registry=https://registry.npmjs.org/`:
  expected `E404 No match found for version 0.4.0`.
- `npm publish --dry-run` for `0.4.0`: intentionally not run because
  `package.json` is `0.3.9`.
- `rg` high-confidence secret heuristic over `mdkg-dev/dist docs/dist`: no
  matches.

## Pass / Fail Status

- local build/package/source gates: pass.
- Browser local visual/DOM checks: pass for checked markers and breakpoints.
- live-current website/docs requirement: fail/blocker pending approved deploy.
- `0.4.0` npm publish readiness: fail/gap because package metadata is still
  `0.3.9`.
- overall: `not ready with exact gaps`.

## Known Warnings

- docs build emitted non-fatal `Entry docs -> 404 was not found`.
- `node dist/cli.js validate --json` reports the accepted legacy
  `manifest.compat.spec_legacy` warning for `.mdkg/work/mdkg-cli/SPEC.md`;
  `node dist/cli.js validate --changed-only --json` reports zero warnings.

# Known Issues / Follow-ups

- `task-605`: push/redeploy source website/docs changes only after explicit
  approval, then run live Browser/Chrome verification.
- `task-606` / `test-312`: final recommendation must remain `not ready` until
  live production is current and `package.json` is bumped to `0.4.0` for the
  real dry-run gate.
- Future `0.4.0` publish lane must rerun all package gates, `npm pack`, and
  `npm publish --dry-run` after the version bump and before asking for real
  publish approval.

## Follow-up Refs

- `task-605`
- `test-308`
- `task-606`
- `test-312`

# Links / Artifacts

- `/private/tmp/mdkg-goal42-readiness-audit-20260627/browser-evidence.json`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/product-design-audit.md`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/*-viewport.png`
- `/private/tmp/mdkg-goal42-readiness-audit-20260627/*.png`

# Raw Content Safety

- Evidence is summarized with command outcomes and local artifact paths.
  Screenshots and JSON receipts are local-only under `/private/tmp`.
