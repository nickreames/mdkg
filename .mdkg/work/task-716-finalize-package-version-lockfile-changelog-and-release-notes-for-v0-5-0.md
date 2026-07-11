---
id: task-716
type: task
title: Finalize package version lockfile changelog and release notes for v0.5.0
status: done
priority: 1
epic: epic-232
next: task-717
tags: [release, version, changelog, package]
owners: []
links: []
artifacts: []
relates: [goal-64, test-388]
blocked_by: []
blocks: [task-717]
refs: [test-388]
context_refs: [goal-61, goal-63, goal-64, epic-232, edd-72, dec-69]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Own the exact `0.5.0` version bump and convert verified hardening and release
experience work into complete, source-backed release metadata.

# Acceptance Criteria

- Package and lockfile agree on `0.5.0`.
- `CHANGELOG.md` has a finalized 0.5.0 section; Unreleased contains only later work.
- Every publish-bound change maps to changelog/release notes or an explicit
  non-user-facing classification.
- Generated docs, website structured metadata, install/upgrade references, and
  dormant release data agree without activating promotion.

# Files Affected

List files/directories expected to change.

- `package.json`, `package-lock.json`, `CHANGELOG.md`
- Generated release/reference outputs and version-bearing site/docs data

# Implementation Notes

- Preserve the source-controlled release activation flag as dormant.
- Do not create a Git tag.

# Test Plan

Run the version/changelog drift scan in `test-388`, generated checks, and inspect
the full publish-bound diff.

# Results / Evidence

- Bumped `package.json`, the root lockfile package, README source-version fact,
  CLI matrix header, generated CLI reference, and generated release-note data
  to `0.5.0` without creating a tag.
- Finalized the 2026-07-11 `0.5.0` changelog with 18 source-backed Added,
  Changed, Fixed, and Security notes covering first-class loops, all seven
  templates, readiness/provenance/routing behavior, packaged validation, public
  release surfaces, graph target containment, and bounded ZIP parsing.
- Kept `Unreleased` empty. Git materialization and linked-upgrade graph planning
  from `626e0b61` is classified as non-user-facing future planning and is not
  presented as shipped `0.5.0` functionality.
- Preserved `release/public-release.json` as `draft`. Draft mdkg.dev JSON-LD now
  omits `softwareVersion` so the first dormant push cannot advertise 0.5.0
  before npm proof; the version is projected only after state becomes
  `published`.
- Updated release-note generation to accept the gated v0.5.0 supplement as the
  draft public summary while still requiring the normal public changelog page
  to mention 0.5.0 after activation.
- `npm run test:public-release`, `npm run docs:check`, `npm run cli:check`,
  `npm run cli:contract`, `npm run smoke:mdkg-dev`,
  `npm run smoke:mdkg-dev-docs`, `npm run smoke:mdkg-dev-seo`,
  `node scripts/assert-publish-ready.js`, and `git diff --check` passed.
- Generated command-contract hash:
  `e9bd2d82d340887bc58d518c7e67541996f4b7744b2d1981763060575265aa29`.

# Links / Artifacts

- `edd-72`
- `dec-69`
