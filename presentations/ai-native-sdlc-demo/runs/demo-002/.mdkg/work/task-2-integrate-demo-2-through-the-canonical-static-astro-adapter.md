---
id: task-2
type: task
title: Integrate Demo 2 through the canonical static Astro adapter
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: test-1
next: test-2
tags: [demo, demo-002, integration, astro, canonical-adapter]
owners: [demo-002-agent]
links: []
artifacts: [artifacts/integration-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, test-1, prd-2, edd-1, dec-1, dec-2]
context_refs: [goal-1, test-1, prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Map the accepted Demo 2 source, specialized goal, work, and evidence into Goal
2's generalized per-demo record and compile-time output-component registry.

# Acceptance Criteria

- Add `demo-2.ts` with `listed: false`, `noindex: true`, and
  `outputComponent: "demo-2"`.
- Add a distinct static `Demo2Output.astro` using the accepted navigation-chart
  creative direction.
- Register the record and component through existing generic registries.
- Do not add a Demo 2-only route, client directive, script, remote font,
  tracker, form, or third-party runtime dependency.
- Mirror the owning program's accepted integration receipt into this run.
- Do not stage, commit, push, inspect providers, or claim public availability.

# Files Affected

- `mdkg-dev/src/data/demos/demo-2.ts`
- `mdkg-dev/src/data/demos/index.ts`
- `mdkg-dev/src/components/demos/Demo2Output.astro`
- `mdkg-dev/src/components/demos/outputRegistry.ts`
- `artifacts/integration-receipt.json`

# Implementation Notes

- Consume only evidence already accepted by `test-1`.
- Keep source and specialized goal hashes distinct and public-safe.
- Leave the publication task untouched.

# Test Plan

- `test-2`
- canonical Astro build
- `/demo/2/` and `/demo/2/output/` local route checks
- sitemap, gallery, noindex, zero-JavaScript, claims, and budget scans

# Links / Artifacts

- `goal-1`
- `prd-2`
- `test-1`
- `test-2`
