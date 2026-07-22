---
id: task-803
type: task
title: make full prepublish dependency and build execution deterministic
status: backlog
priority: 1
tags: [audit-followup, release, prepublish, build]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: []
blocks: [test-463]
refs: [loop-7, spike-32, test-461, chk-541, chk-542]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Make the complete publication ladder reproducible from explicit lockfile-owned
dependency state and eliminate repeated build/pack lifecycle amplification.
Current evidence shows root `npm ci` does not install docs or mdkg-dev, one
smoke can run hidden nested `npm ci`, and one full ladder expands to an
estimated 87 root, 12 docs, and 17 mdkg-dev builds.

# Acceptance Criteria

- Define one explicit install/bootstrap phase for root, docs, and mdkg-dev;
  smokes never perform a hidden install.
- After that phase, `NPM_CONFIG_OFFLINE=true npm run prepublishOnly` completes
  without registry access.
- Build one reusable package tarball for installed-package smokes instead of
  invoking `npm pack` independently at 34 call sites.
- A full ladder performs at most three root package builds, one docs Astro
  build, and one mdkg-dev Astro build; counters make this bound testable.
- Missing nested dependencies fail before the ladder with an actionable local
  bootstrap message, not mid-smoke.
- The ladder stays within its 60-minute contract on Node 24 and leaves no
  tracked non-mdkg diff.

# Files Affected

- root release/prepublish scripts and `package.json`
- shared smoke utilities and pack-fixture helpers
- docs/mdkg-dev install or workspace configuration and lock metadata only as
  required by the accepted dependency topology
- focused infrastructure tests

# Implementation Notes

- Preserve local tarball consumer semantics and `prepack` safety; do not bypass
  readiness checks for the final reusable artifact.
- Separate the authorized install phase from the network-closed verification
  phase.
- Capture before/after process counts so performance improvement is evidence,
  not an assumption.

# Test Plan

- Use a disposable clean checkout or fixture, run the explicit installs, then
  force offline and execute `npm run prepublishOnly` once.
- Assert no child `npm ci`, no registry request, the exact build-count bounds,
  full 47-alias effective smoke coverage, and no tracked drift.

# Links / Artifacts

- `root:loop-7`
- `root:test-461`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/test-command-inventory.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json`
