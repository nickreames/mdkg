---
id: chk-4
type: checkpoint
title: Goal 2 reusable demo platform accepted
status: done
priority: 9
tags: [ai-native-sdlc, presentation-demo, phase-2, accepted]
owners: [program-orchestrator, root-integration-owner]
links: []
artifacts: [artifacts/demo-platform/interface-contract.json, artifacts/demo-platform/validation-receipt.json, artifacts/demo-platform/fork-bootstrap-pack-receipt.json, artifacts/demo-platform/public-safety-visibility-zero-js-receipt.json, artifacts/demo-platform/static-build-route-a11y-budget-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, spike-2, task-5, task-6, task-7, task-8, task-9, task-10, test-4, test-5, test-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, chk-3]
context_refs: [goal-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, chk-3]
evidence_refs: [chk-3, test-4, test-5, test-6]
aliases: []
skills: []
scope: [epic-2, spike-2, task-5, task-6, task-7, task-8, task-9, task-10, test-4, test-5, test-6]
created: 2026-07-26
updated: 2026-07-26
---
# Summary

Goal 2 is accepted locally. The reusable website-demo platform now starts from
an explicit PRD plus a static Astro and zero-client-JavaScript source graph,
forks deterministically with preserved IDs and materialized operator context,
and integrates through typed per-demo records and compile-time Astro output
components. Demo 1 remains the historical public example; Demo 2 and Demo 3
remain unexecuted fixture-only reservations owned by later goals.

# Scope Covered

- Read-only drift discovery and the exact-path mutation lease.
- Reusable source-template PRD, EDD, decisions, work chain, checkpoint, and
  fresh-agent pack contract.
- Per-demo record, visibility, source-versus-executed evidence, and output
  component interfaces.
- Deterministic graph fork, operator/skill materialization, repeat verification,
  and fail-closed negative cases.
- Rehearsal, event, and normative live-sendoff contracts.
- Integrated route, claims, public-safety, accessibility, asset-budget,
  zero-JavaScript, and responsive-browser proof.

# Decisions Captured

- `dec-1`: separate paused phase goals.
- `dec-2`: AI-native SDLC narrative and evidence-backed claims.
- `dec-3`: static Astro, Ocean Flow constraints, and bounded creative latitude.
- `dec-4`: graph-only writer leases and serialized root integration.
- `dec-5`: exact-SHA publication authority and fallback behavior.
- `dec-6`: public-safe artifact visibility and later adoption policy.

# Implementation Summary

- The canonical source template now routes `goal-1 -> spike-1 -> task-1 ->
  test-1` with `prd-2`, `edd-1`, two accepted decisions, `chk-2`, and three
  required skills in both concise and full-body packs.
- `mdkg-dev` uses independent typed demo records, `listed` and `noindex`
  projections, sanitized source/executed goal evidence, and a compile-time
  output-component registry.
- `bootstrap-website-demo-run.js` accepts an absent repository-contained target,
  preserves graph IDs, materializes an exact 21-entry operator manifest, and
  verifies a 103-file child inventory without retaining smoke runs.
- Demo 2 and Demo 3 contracts preserve a local candidate/publication split and
  the normative live sendoff’s bounded authority.

# Verification / Testing

- `npm run smoke:mdkg-dev`: pass.
- `npm run smoke:mdkg-dev-seo`: pass.
- `npm run smoke:mdkg-dev-a11y`: pass across 22 page configurations.
- `npm run smoke:mdkg-dev-perf`: pass; demo route transfers are 15–40 KiB,
  generated client JavaScript is zero, and no raster assets are emitted.
- `npm run smoke:demo-graph`: pass; absent-target creation, 13-node concise and
  full-body packs, repeat equality, five negative classifications, and cleanup.
- Desktop `1440x900` and mobile `390x844` detail/output checks found no
  horizontal overflow or browser warnings.
- Template, program, and root changed-only graph validation passed with zero
  warnings or errors; `git diff --check` passed.

# Known Issues / Follow-ups

- The source template remains intentionally unexecuted.
- Goal 3 may now activate for presentation research and production.
- Goal 4 owns the first Demo 2 fork and local candidate; Goal 5 owns its
  separately authorized publication.
- The root integration owner must make the approved local commits, refresh the
  private bundle, and verify the read-only projection. Push remains forbidden.

# Links / Artifacts

- `artifacts/demo-platform/interface-contract.json`
- `artifacts/demo-platform/validation-receipt.json`
- `artifacts/demo-platform/static-build-route-a11y-budget-receipt.json`
- `artifacts/demo-platform/public-safety-visibility-zero-js-receipt.json`
- `artifacts/demo-platform/fork-bootstrap-pack-receipt.json`
