---
id: task-730
type: task
title: Add the shared dormant release manifest and strict projection helpers
status: done
priority: 1
epic: epic-236
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: []
blocks: [task-731, task-732, test-401]
refs: [test-401, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, goal-64, epic-236, dec-74, prop-8]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Create the single release-state source of truth used by both Astro sites. The
implementation must let Goal 63 preview the release locally while making it
impossible for a draft production build to expose v0.5.0 content. The complete
handoff is anchored by
`.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png`, eyebrow
`New in v0.5.0 · Pre-v1 public alpha`, headline
`Reusable loops for work that spans more than one goal.`, body
`Fork a read-only audit template, answer readiness questions, route the next
authorized work, and keep decisions and evidence in your mdkg graph. mdkg
preserves the process; your coding-agent harness executes agents and tools.`,
CTA `Run a security audit loop` -> `/loops/security-audit/`, link
`Learn how loops work` -> `/loops/`, supporting routes
`/loops/templates-and-forks/` and
`/loops/readiness-routing-evidence-closeout/`, and the shared
`release/public-release.json` contract in `dec-74` / `prop-8`.

# Acceptance Criteria

- Add `release/public-release.json` with exactly the accepted schema and
  `state: draft` from `prop-8`.
- Accept only schema version 1 and states `draft` or `published`; reject missing,
  malformed, unknown, or contradictory values with actionable errors.
- Provide one shared projection for `published`, `preview_visible`, `visible`,
  and `indexable` that both sites consume.
- Permit `PUBLIC_MDKG_RELEASE_PREVIEW=1` only outside Vercel production; fail a
  production build when the override attempts to expose a draft release.
- Fail a published build when root `package.json.version` differs from
  `target_version`.
- Keep the manifest byte-for-byte unchanged across every build and test.
- Keep root package version 0.4.2 and manifest state `draft` throughout Goal 63.

# Files Affected

- `release/public-release.json`
- Shared release projection/validation helper consumed by `mdkg-dev/` and
  `docs/`
- Focused unit or smoke fixtures

# Implementation Notes

- Inspect existing Astro environment and package-version helpers before choosing
  module ownership; do not duplicate projection logic between sites.
- Local preview may identify the target release but must remain noindex and may
  not claim npm availability.
- This is a narrow v0.5.0 contract, not a general release framework.

# Test Plan

Run `test-401`; cover valid draft, valid preview, valid published/version-match,
invalid schema/state, package mismatch, production override, and manifest hash
before/after builds.

# Results / Evidence

- Added canonical `release/public-release.json` in `draft` state with target
  version `0.5.0` while root package truth remains `0.4.2`.
- Added one side-effect-free `release/public-release.mjs` loader, validator, and
  projection for both Astro sites.
- The projection exposes `published`, `preview_visible`, `visible`, `indexable`,
  and `site_noindex`, preserves existing deployment-preview noindex behavior,
  and rejects unsafe release-preview production overrides.
- `npm run test:public-release`: 8 tests passed, 0 failed.
- Canonical and malformed-fixture hash/content checks prove the loader does not
  write its inputs.

# Links / Artifacts

- `dec-74`
- `prop-8`
- `test-401`
