---
id: task-803
type: task
title: reuse one package artifact and bound profile-specific build execution
status: backlog
priority: 1
parent: goal-77
prev: test-468
next: test-463
tags: [audit-followup, release, prepublish, build]
owners: []
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

# Links / Artifacts

- `root:loop-7`
- `root:test-461`
- `root:goal-77`
- `root:dec-87`
- `root:test-468`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/test-command-inventory.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json`
