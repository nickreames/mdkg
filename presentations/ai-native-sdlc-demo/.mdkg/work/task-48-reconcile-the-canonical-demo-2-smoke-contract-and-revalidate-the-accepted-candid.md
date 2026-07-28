---
id: task-48
type: task
title: Reconcile the canonical Demo 2 smoke contract and revalidate the accepted candidate
status: done
priority: 1
epic: epic-5
parent: goal-5
next: task-21
tags: [ai-native-sdlc, presentation-demo, phase-5, step-1, pre-publication, smoke-contract]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/smoke-contract-receipt.json, artifacts/demo-002/candidate-revalidation.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-13, chk-14, chk-15, test-10, test-11]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-4, chk-13, chk-14, chk-15, test-10, test-11]
evidence_refs: [chk-14, chk-15, test-10, test-11]
aliases: [phase-5-step-1, demo-2-smoke-contract]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Replace the obsolete pre-Demo-2 smoke sentinel with a positive contract for
the accepted unlisted/noindexed Demo 2 routes, then revalidate the sealed
candidate before any local integration commit or publication approval.

# Acceptance Criteria

- Reproduce the current `npm run smoke:mdkg-dev` failure that says fixture-only
  Demo 2 must not produce public routes and preserve that receipt.
- Update only the smallest approved smoke/fixture surface needed to recognize
  Demo 2 as a real registered demo while preserving negative reserved-record,
  unknown-ID, missing-output, sitemap, gallery, and static-output coverage.
- Positive assertions prove `/demo/2/` and `/demo/2/output/` build, Demo 2 is
  absent from the public gallery and sitemap, both pages are noindexed, the
  distinct static output component is registered, and no client JavaScript is
  generated or transferred.
- Do not change Demo 2 design, copy, data, output component, canonical route
  behavior, template, CLI, package API, docs, deployment configuration, or
  provider state in this node.
- Rerun the canonical site build and all directly affected smoke families,
  including `smoke:mdkg-dev`, SEO, accessibility, performance, and demo-graph
  coverage. Any weakened assertion or skipped family is a failure.
- Reverify the Goal 4 candidate/fallback hashes and record whether the
  test-only repair changes any accepted candidate identity. Candidate drift
  requires a new Goal 5 revalidation receipt; never overwrite `chk-14`.
- Record exact changed paths, before/after assertion intent, commands, results,
  hashes, warnings, and public-safety review.

# Files Affected

- `scripts/smoke-mdkg-dev.js`
- `scripts/fixtures/demo-registry-fixtures.json` only if the smallest correct
  repair cannot be expressed in the smoke runner alone
- Goal 5 mdkg state and `artifacts/demo-002/` evidence
- No `mdkg-dev/src/**`, deck, docs, package runtime, run implementation, or
  provider surface

# Implementation Notes

- Preserve the distinction between routable-but-unlisted and publicly listed.
- A misleading assertion message is not the only defect; the obsolete
  absence check itself must become the accepted Demo 2 contract.
- The root integration owner holds the shared-source writer lease.

# Test Plan

- The previously failing canonical smoke passes without weakening unrelated
  negative fixtures.
- Direct Demo 1 and Demo 2 static, SEO, accessibility, performance, privacy,
  noindex/unlisted, and zero-JavaScript checks pass.
- `git diff --check`, nested validation, and candidate hash verification pass.

# Links / Artifacts

- `goal-5`
- `chk-14`
- `test-10`
- `test-11`

# Results

- Reproduced the obsolete `fixture-only Demo 2 must not produce public
  routes` failure before changing the smoke runner.
- Replaced that sentinel with positive coverage for the accepted direct-only
  Demo 2 detail and output routes while preserving Demo 3 route absence and
  the existing negative registry, provenance, visibility, and static-component
  fixtures.
- Changed only `scripts/smoke-mdkg-dev.js`; Demo 2 design, copy, data,
  component, routes, template, CLI, docs, and deployment configuration were
  untouched.
- Reran the complete affected smoke family serially. Site, SEO, accessibility,
  performance, graph-fork, program-graph, and child-graph checks passed.
- Reverified every sealed candidate prerequisite, route, reveal, and fallback
  hash. The repair changes test coverage only and does not change the accepted
  candidate identity.

# Evidence

- `artifacts/demo-002/smoke-contract-receipt.json`
- `artifacts/demo-002/candidate-revalidation.json`
- `artifacts/demo-002/candidate-receipt.json`
- `artifacts/demo-002/fallback/manifest.sha256`
