---
id: task-810
type: task
title: Make nested dependency bootstrap explicit and smoke preflight fail closed
status: done
priority: 1
parent: goal-77
prev: test-469
next: test-468
tags: [audit-followup, release, dependencies, prepublish]
owners: [root]
links: []
artifacts: []
relates: [loop-7]
blocked_by: [test-469]
blocks: [test-468]
refs: [goal-77, loop-7, chk-544, chk-545, dec-87, bug-4, test-469]
context_refs: [goal-77, loop-7, chk-544, chk-545, dec-87, bug-4, test-469]
evidence_refs: [chk-548]
aliases: []
skills: [build-pack-and-execute-task, service-boundary-ownership-check]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Make dependency ownership and bootstrap explicit before any release or smoke
execution. Root, docs, and mdkg-dev keep independent lockfiles, while smoke
helpers fail closed instead of installing missing nested dependencies.

# Acceptance Criteria

- A built-in-only preflight checks the root, docs, and mdkg-dev dependency
  trees against their own lockfiles before a smoke or publication ladder runs.
- Missing or extraneous dependencies fail before any smoke begins and identify
  the exact explicit bootstrap command.
- The current hidden `npm ci --prefix mdkg-dev` behavior is removed.
- No smoke helper, pack fixture, or site helper performs dependency bootstrap.
- The explicit bootstrap command covers all three dependency domains and does
  not migrate them to npm workspaces.
- The boundary between optional registry-capable bootstrap and forced-offline
  verification is represented in command help and machine-readable receipts.
- Focused tests prove fail-closed behavior without requiring network access.
- No workflow, skill, public seed, package version, or unrelated generated
  path changes.

# Files Affected

- root preflight/bootstrap scripts and `package.json`
- shared docs/mdkg-dev smoke utilities
- focused infrastructure tests and disposable fixtures
- lockfiles only if the accepted explicit bootstrap proves existing lock
  metadata is inconsistent; any such change requires separate review

# Implementation Notes

- Preserve independent root, docs, and mdkg-dev lockfile ownership under
  `root:dec-87`.
- The preflight itself must not contact a registry or mutate dependencies.
- A registry-capable clean bootstrap is an explicit later test setup action,
  not part of normal smoke execution.
- Emit actionable diagnostics without printing environment secrets or raw npm
  configuration.

# Test Plan

- Run focused positive tests against current dependency trees.
- Use isolated fixtures with missing and extraneous nested dependencies and
  assert the exact owner and bootstrap diagnostic.
- Prove no smoke starts and no child `npm ci` runs on preflight failure.
- Run changed-only graph validation and Git boundary checks.

# Results / Evidence

## Ownership boundary

- Root owns `package.json`, `package-lock.json`, and root `node_modules`.
- Docs owns `docs/package.json`, `docs/package-lock.json`, and
  `docs/node_modules`.
- The marketing site owns `mdkg-dev/package.json`,
  `mdkg-dev/package-lock.json`, and `mdkg-dev/node_modules`.
- Root release and smoke ladders consume all three domains. Site smoke helpers
  are consumers, not dependency owners, and may not bootstrap a missing tree.
- Workflows, skills, public seeds, package versions, and all three lockfiles
  remained outside the changed surface.

## Implementation

- Added the built-in-only `scripts/dependency-boundary.js` preflight and
  explicit bootstrap command.
- `npm run deps:preflight -- --json` reads all three manifests, lockfiles, and
  installed trees without network or mutation. It reports missing, extraneous,
  version-mismatched, and manifest/lockfile-mismatched packages by owner.
- `npm run deps:bootstrap` is the sole repair command and declares three
  registry-capable `npm ci` operations. `--dry-run --json` provides a bounded
  non-mutating receipt.
- Root build, `ci:release`, `prepack`, and `prepublishOnly` fail closed through
  preflight before build or smoke work starts.
- `scripts/mdkg-dev-smoke-utils.js` now preflights and never runs nested
  `npm ci`; the previous hidden install was removed.
- Publish-readiness assertions lock these command and no-hidden-install
  contracts.

## Verification

- Current Node `24.18.0` preflight passed all three domains with zero issues:
  root `3/3`, docs `345` installed against `425` lock entries, and mdkg-dev
  `207` installed against `297` lock entries. Missing optional/platform entries
  remain non-errors.
- Bootstrap dry-run emitted all three exact commands and executed none.
- Focused dependency-boundary fixtures passed `6/6`, including missing-tree,
  extraneous-package, no-hidden-install, dry-run, and help-boundary cases.
- `npm run build` passed with preflight first.
- `node scripts/assert-publish-ready.js` passed.
- All three lockfiles and `.mdkg/init-manifest.json` remained unchanged.
- Registry-capable clean bootstrap was not executed because this lane has no
  external-network authority; `root:test-468` records the bounded limitation
  and network-closed verification evidence.

# Links / Artifacts

- `root:goal-77`
- `root:test-468`
- `root:dec-87`
- `root:loop-7`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/test-command-inventory.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json`
