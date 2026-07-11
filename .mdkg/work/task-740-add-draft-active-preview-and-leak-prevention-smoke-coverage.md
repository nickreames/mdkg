---
id: task-740
type: task
title: Add draft active-preview and leak-prevention smoke coverage
status: done
priority: 1
epic: epic-240
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-731, task-732, task-734, task-737, task-739]
blocks: [task-741, test-407]
refs: [test-401, test-402, test-403, test-404, test-405, test-406, test-407, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, goal-64, epic-240, dec-74, prop-8, task-730, task-731, task-732, task-733, task-734, task-735, task-736, task-737, task-738, task-739]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Extend repository smoke coverage to prove the complete release projection across
both sites before browser review or Goal 64 handoff.

# Acceptance Criteria

- Build and inspect four modes: marketing draft, docs draft, marketing active
  preview, and docs active preview.
- Assert the release manifest is byte-for-byte unchanged before and after every
  build.
- Assert a Vercel production draft override fails closed and a published fixture
  fails on package-version mismatch.
- In draft mode, scan HTML, metadata, structured data, sitemap, Pagefind, LLM
  files, robots, navigation, and direct routes for release leaks.
- In preview mode, assert exact announcement copy and all four loop routes render
  while remaining noindex/nofollow and robots-disallowed.
- Verify CTA/internal links, generated command examples, current 0.4.2 package
  truth, and absence of unsupported availability claims.
- Scan built output for `/Users/`, raw dogfood ids, checkpoint ids, template
  hashes, provider ids, tokens, secrets, private receipts, and copied dogfood
  text.
- Integrate with existing `smoke:mdkg-dev`, docs, SEO, and accessibility scripts
  rather than adding a disconnected verifier.

# Files Affected

- Existing mdkg.dev/docs/SEO/a11y smoke scripts and package scripts as needed
- Release-state fixtures and deterministic built-output assertions

# Implementation Notes

- Tests must clean temporary build output and never mutate canonical release
  state.
- Draft direct routes may be absent or generic unavailable/noindex; either path
  must expose no release content.
- Keep checks deterministic and local; do not hit production or publish.

# Test Plan

Run all focused release-state tests plus the full mdkg.dev/docs/SEO/a11y smoke
ladder. Preserve receipts for all four modes and the forbidden-content scan.

# Results / Evidence

- Added byte-for-byte release-manifest guards to the marketing smoke, matching
  the existing docs guard across canonical and active-preview builds.
- Expanded built-output leak and overclaim checks across the homepage, LLM
  projections, all four loop routes, and the install/changelog/reference
  supplements. Purpose-built `chk-1` example content remains allowed while
  current internal checkpoint ids, dogfood ids, local paths, content hashes,
  and premature npm-install claims fail the smoke.
- The shared release-state unit suite passed all 8 draft, preview, production,
  schema, parity, and immutability cases.
- `node scripts/smoke-mdkg-dev.js`,
  `node scripts/smoke-mdkg-dev-docs.js`,
  `node scripts/smoke-mdkg-dev-seo.js`, and
  `node scripts/smoke-mdkg-dev-a11y.js` passed. The docs smoke verified 68
  required files and the accessibility smoke checked 10 pages.
- Package truth remains `0.4.2`; the canonical manifest remains `draft` and no
  release activation, publish, push, or deployment occurred.

# Links / Artifacts

- `prop-8`
- `test-407`
- `goal-64`
