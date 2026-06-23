---
id: chk-200
type: checkpoint
title: goal-26 pre-release gate blocked by already published package version
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: [mdkg-dev, prepublish, dry-run, blocked]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-06-22
updated: 2026-06-22
---
# Summary

Goal-26 final release-gate execution reached the registry-aware `npm publish --dry-run` step with all local checks and package scripts green. The only blocking result is npm registry immutability: the current source version is `0.3.7`, and `mdkg@0.3.7` is already published on npm, so npm refuses the dry-run publish with the same version.

This is a release metadata constraint, not a Browser E2E, mdkg-dev, graph, build, test, smoke, pack, or publish-readiness defect.

# Scope Covered

- goal-26
- task-462
- test-211

## Changed Surfaces

- No additional source or site changes were made by this checkpoint.
- This checkpoint records the final gate status after Browser E2E, screenshot archive, mdkg-dev remediation, and release gate execution.

## Boundaries

- in scope: local Browser E2E proof, local build/test/smoke/package gates, dry-run package/publish proof.
- out of scope: real npm publish, deploy, DNS, Vercel production promotion, GitBook production sync, tag, push, global install, or external child-repo mutation.
- sensitive private content and bulky execution traces excluded from this checkpoint.

# Decisions Captured

- Treat the registry-aware dry-run failure as a blocker requiring either a version bump or an explicit revised acceptance rule for already-published versions.
- Do not close goal-26 while the exact required `npm publish --dry-run` acceptance item is not green.

# Implementation Summary

- Browser-discovered local defects were already fixed and re-tested in task-460.
- Browser receipt and selected screenshots were archived in archive `archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22`.
- The archive sidecar remains verifiable; routing-sensitive archive edges were removed so `goal next goal-26 --json` remains warning-free.

# Test Proof

- Test target: goal-26 final release gates and no-public-side-effect contract.
- Browser fixture: `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26`.
- Archive: `archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22`.
- Coverage gap: `npm publish --dry-run` cannot pass for source version `0.3.7` while npm registry already contains `mdkg@0.3.7`.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
  result: passed.
- command: `npm run smoke:mdkg-dev`
  result: passed.
- command: `npm run smoke:mdkg-dev-docs`
  result: passed.
- command: `npm run smoke:mdkg-dev-seo`
  result: passed.
- command: `npm run smoke:demo-graph`
  result: passed.
- command: `npm run build`
  result: passed.
- command: `npm run test`
  result: passed with 507 tests, 0 failures.
- command: `npm run cli:check`
  result: passed.
- command: `npm run cli:contract`
  result: passed with command contract hash `bb6d15e23a09b9a013aed406eac42e4e90f8ef6cb799759198a7777b3527ca74`.
- command: `npm run prepublishOnly`
  result: passed.
- command: `node scripts/assert-publish-ready.js`
  result: passed.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  result: passed for `mdkg@0.3.7`.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
  result: package scripts and smokes passed, then sandboxed run was interrupted after hanging at registry simulation.
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` with registry/network access
  result: package scripts and smokes passed, then npm failed with `You cannot publish over the previously published versions: 0.3.7.`
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm view mdkg@0.3.7 version --prefer-online`
  result: `0.3.7`.

## Pass / Fail Status

- status: blocked on published-version registry immutability.
- local gates: passed.
- Browser E2E: passed.
- archive verification: passed.
- package dry-run: passed.
- publish dry-run: blocked because the package version already exists.

## Known Warnings

- `node dist/cli.js doctor --strict --json` reports one accepted local-only project DB runtime warning when the runtime SQLite file exists and `mdkg db verify --json` passes.

# Known Issues / Follow-ups

- Decide whether goal-26 should require a version bump for dry-run publish, or whether an already-published-version dry-run failure after successful scripts should be accepted for non-release verification goals.
- Do not close test-211 or goal-26 until that decision is made and encoded in the graph.

## Follow-up Refs

- task-462
- test-211
- goal-26

# Links / Artifacts

- archive://archive.mdkg-dev-browser-e2e-goal26-2026-06-22
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`

# Raw Content Safety

- Evidence is summarized with command names, status, hashes, and archive references. Sensitive private content and bulky execution traces are not stored here.
