---
id: task-793
type: task
title: Implement generated current-release supplement and release-note alignment
status: done
priority: 1
parent: goal-73
prev: task-792
next: test-455
tags: [goal-73, docs, release, implementation, current-release]
owners: []
links: []
artifacts: []
relates: [task-792, test-455, dec-84, edd-78]
blocked_by: [task-792]
blocks: [test-455]
refs: [goal-73, dec-84, edd-78, edd-57]
context_refs: [task-738, edd-57, edd-71]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Replace the v0.5.0-specific release supplement and assertions with the accepted
version-driven projection while retaining all three docs route variants.

# Acceptance Criteria

- Replace `ReleaseV050Supplement.astro` with
  `CurrentReleaseSupplement.astro` and update the Footer import.
- Combine the shared public-release projection with generated release-note data
  under the published, draft-preview, and hidden-draft rules from `edd-78`.
- Published selection requires the exact manifest target release; malformed or
  missing visible data fails the build.
- Install renders evergreen install/upgrade commands and a changelog link;
  Changelog renders date, item count, and at most three generated highlights;
  Reference renders evergreen command-reference and changelog links.
- Use version-neutral identifiers and escaped or structurally rendered text;
  do not use unrestricted raw HTML.
- Remove component/test current-version literals, preserve historical v0.5.0
  changelog and loop pages, add one Unreleased Fixed note, and regenerate data.
- Keep package and lockfile at `0.5.2`; make no CLI or mdkg-dev behavior change.

# Files Affected

- Docs release projection/component/footer, changelog generation and smoke
  assertions, root changelog, generated release-note JSON, and targeted tests.

# Implementation Notes

- Prefer a pure projector callable from tests over Astro-only branching.
- Do not add a fallback that can make stale release content look current.
- Draft preview with zero Unreleased items renders evergreen framing and no
  invented highlights.

# Test Plan

Run targeted public-release and release-note checks while implementing; closure
is blocked on `test-455`.

# Results / Evidence

- Added `docs/src/data/currentRelease.mjs` as the pure manifest plus generated
  release-note projector. Published state requires exact package, latest-release,
  release entry, item-count, and highlight agreement; draft previews select
  `Unreleased`; hidden drafts do not resolve visible release data.
- Replaced the release-specific Astro component with
  `CurrentReleaseSupplement.astro`, retained the three Footer route variants,
  and rendered generated inline-code spans structurally without raw HTML.
- Removed release-specific generator coupling, added the Unreleased Fixed note,
  regenerated `docs/_generated/release-notes.json`, and changed smoke assertions
  to derive labels, dates, counts, and highlights from the manifest and JSON.
- `npm run test:public-release`, `npm run docs:release-notes:check`,
  `npm --prefix docs run build`, and `npm run smoke:mdkg-dev-docs` passed.
- Package metadata remains `0.5.2`; no CLI or `mdkg-dev` source behavior changed.

# Links / Artifacts

- `task-792`
- `test-455`
- `dec-84`
- `edd-78`
