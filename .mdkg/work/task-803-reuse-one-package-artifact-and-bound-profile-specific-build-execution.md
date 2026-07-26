---
id: task-803
type: task
title: reuse one package artifact and bound profile-specific build execution
status: done
priority: 1
parent: goal-77
prev: test-468
next: test-463
tags: [audit-followup, release, prepublish, build]
owners: [root]
links: []
artifacts: []
relates: [loop-7]
blocked_by: [test-468]
blocks: [test-463]
refs: [goal-77, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, chk-545, dec-87, task-810, test-468]
context_refs: [goal-77, loop-7, chk-544, chk-545, dec-87, task-810, test-468]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, service-boundary-ownership-check]
created: 2026-07-17
updated: 2026-07-25
---
# Overview

After `root:test-468` proves explicit dependency bootstrap, make the complete
local publication ladder reuse one immutable package artifact and one build per
normalized behavior profile. Current evidence shows 47 declared smoke aliases,
46 canonical executions, 34 package-producing call sites, and severe repeated
root/docs/mdkg-dev build amplification.

# Acceptance Criteria

- Add one machine-readable smoke manifest covering every alias, canonical
  execution, subsystem, prerequisite, environment profile, timeout, and future
  CI membership.
- Map all 47 aliases and execute all 46 canonical identities once;
  `smoke:bundle-import` remains an alias of `smoke:subgraph`.
- Build and validate one immutable package tarball, bind it to a SHA-256, and
  reuse it for installed-package smokes.
- Preserve standalone smoke behavior while allowing the full ladder to inject
  the prebuilt artifact.
- Count actual root compiler and site Astro executions.
- A complete ladder performs at most three root builds and at most one docs or
  marketing build per normalized environment profile.
- The manifest binds the exact profile inventory; current conservative maxima
  are four docs and five marketing profiles.
- Generated counters and raw logs stay ignored or under `/private/tmp`.
- No workflow, skill, public-seed, dependency-topology, package-version, or
  unrelated tracked-output change.

# Files Affected

- root release/prepublish scripts and `package.json`
- shared smoke utilities and package-fixture helpers
- source-owned smoke manifest and counter/receipt helpers
- focused infrastructure tests

# Implementation Notes

- Dependency preflight and bootstrap are already owned by
  `root:task-810`/`root:test-468`; do not duplicate them here.
- Preserve local tarball consumer semantics and `prepack` safety.
- Cache site output only when source hash, owner lockfile hash, Node version,
  and normalized environment profile all match.
- Distinct SEO, preview, production, noindex, and release profiles cannot share
  output unless their normalized inputs are actually identical.
- The smoke manifest becomes local execution truth and later CI input; the
  historical Loop 7 artifact remains evidence only.

# Test Plan

- Run focused manifest expansion, alias deduplication, tarball reuse,
  cache-key, and build-counter tests.
- Use a disposable snapshot to prove one artifact hash reaches every
  installed-package consumer and each profile assertion still executes.
- Hand the complete offline 60-minute proof to `root:test-463`.

# Results / Evidence

## Ownership boundary

- `scripts/smoke-manifest.json` owns release-ladder alias, canonical execution,
  prerequisite, profile, timeout, and future-CI membership metadata.
- Package artifact construction remains root-package owned.
- Docs and mdkg-dev retain their own source, lockfile, and Astro output
  ownership. The ladder caches only ignored build output keyed by owner source,
  owner lockfile, Node version, and a declared normalized profile.
- Standalone `smoke:*` package scripts remain unchanged and continue to build
  before their physical entrypoint. Only the integrated runners bypass repeated
  wrapper builds.

## Implementation

- Added a bounded local release runner for `ci` and `prepublish` modes.
- Added built-output variants for test, CLI contract, and docs checks so a
  composed ladder does not recompile unchanged root source.
- The manifest binds all 47 package aliases to 46 canonical executions;
  `smoke:bundle-import` and `smoke:subgraph` share one execution.
- One validated `npm pack` artifact is chmod-bound read-only, SHA-256 recorded,
  and supplied to legacy local-pack call sites through a private npm/npx proxy.
  Each consumer receives a hard link or byte-identical fallback copy and
  records the canonical hash.
- The same proxy caches docs and mdkg-dev `dist` by exact normalized profile.
  Four docs profiles and five mdkg-dev profiles are declared.
- Root compiler and site-build events stay under the selected `/private/tmp`
  receipt directory. Time budgets are enforced inside the runner.
- Publish-readiness assertions validate manifest parity, alias deduplication,
  profile inventory, runner contracts, and artifact-consumer classification.

## Verification

- Focused release-ladder tests passed `4/4`: 47-to-46 expansion, immutable
  artifact reuse, profile cache hit/invalidation, and standalone compatibility.
- Built-only CLI, contract, and docs checks passed.
- `npm run ci:release` passed once under Node `24.18.0`, forced offline mode,
  an empty dedicated cache, and unreachable registry in `123.974s`.
- CI mode performed two root builds, executed the two existing CI smokes once,
  and recorded two uses of one `428170`-byte artifact with SHA-256
  `53e2d7a33398a7cbcaaab8d6468f7ca93e30d25fc7b4edcdaf5ba30fd0ea80d8`.
- The CI receipt is `/private/tmp/mdkg-goal77-ci-v1/receipt.json`; raw logs
  remain beside it.
- No lockfile, workflow, skill, package-version, selected-goal, or tracked
  generated-output change occurred.
- The complete 46-execution, nine-profile, 60-minute proof remains owned by
  `root:test-463`.

# Links / Artifacts

- `root:loop-7`
- `root:test-461`
- `root:goal-77`
- `root:dec-87`
- `root:test-468`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/test-command-inventory.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json`
