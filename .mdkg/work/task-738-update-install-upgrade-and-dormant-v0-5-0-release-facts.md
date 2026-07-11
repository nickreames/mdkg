---
id: task-738
type: task
title: Update install upgrade and dormant v0.5.0 release facts
status: done
priority: 1
epic: epic-239
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-732]
blocks: [task-739, test-406]
refs: [test-406, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, goal-64, epic-239, dec-74, prop-8, task-732]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prepare the existing install, upgrade, changelog, and release-note surfaces for
v0.5.0 while the public build remains dormant and package truth remains 0.4.2.

# Acceptance Criteria

- Add source-backed loop upgrade guidance to the existing install/upgrade
  surfaces; do not create a second installation flow in the announcement.
- Add v0.5.0 release content through the existing changelog/release-note pattern,
  gated so draft public output does not advertise version availability.
- Active preview may label v0.5.0 as the target release and `Pre-v1 public
  alpha`, but must not say it is available from npm.
- Keep root and public package-version facts at 0.4.2 throughout Goal 63.
- Preserve MANIFEST canonical and SPEC legacy compatibility wording and all
  existing install/runtime prerequisites.
- Leave final changelog/version mutation, npm publish, and availability claims to
  Goal 64.

# Files Affected

- Existing install/upgrade pages under `docs/`
- Existing changelog/release-note sources
- Release-state content fixtures/tests

# Implementation Notes

- Use source-backed loop facts from `task-710`; do not copy internal dogfood
  evidence.
- Keep exact commands in generated reference and link to it from prose.
- Ensure dormant page titles, descriptions, feeds, sitemap, search, and LLM files
  cannot leak release facts.

# Test Plan

Run `test-406`; compare package/version sources, draft and active-preview built
output, install/upgrade links, changelog gating, and prohibited availability
language.

# Results / Evidence

- Added one release-state-aware Starlight supplement shared by the existing
  Install, Changelog, and generated CLI Reference routes.
- Active preview now shows upgrade guidance, source-backed v0.5.0 loop release
  highlights, and the loop command family while explicitly stating that the
  preview does not claim npm availability.
- Draft builds render no supplement markup or target-version facts on those
  routes; the shared release manifest remains byte-for-byte unchanged.
- Root `package.json`, generated release notes, and public structured package
  truth remain at 0.4.2. MANIFEST canonical and SPEC legacy compatibility text
  remains unchanged.
- `node scripts/smoke-mdkg-dev-docs.js` passed across draft/preview routes,
  release supplements, sitemap, Pagefind, noindex, and manifest immutability.

# Links / Artifacts

- `goal-64`
- `prop-8`
- `test-406`
