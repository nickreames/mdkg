---
id: test-343
type: test
title: local build smoke product design and browser validation contract
status: done
priority: 1
parent: goal-56
tags: [mdkg-dev, docs-mdkg-dev, build, smoke, product-design, browser]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-342]
blocks: []
refs: [task-663, task-664, task-665, test-342]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Prove the copy cleanup is locally buildable and visually/readably acceptable
before any push or deployment is requested.

# Target / Scope

List the work items or areas covered (use `relates` for tickets).

- `test-342`
- mdkg-dev static site
- docs Starlight site
- generated release-note data

# Preconditions / Environment

Document environment, data, and setup requirements.

- `test-342` has passed or has no unresolved P1 findings.
- Product Design and Browser skills are available for local screenshot review.

# Test Cases

- `npm run docs:release-notes` updates or verifies generated release-note data
  after `CHANGELOG.md` wording changes.
- `npm --prefix mdkg-dev run build` passes.
- `npm --prefix docs run build` passes.
- `npm run smoke:mdkg-dev` passes.
- `npm run smoke:mdkg-dev-docs` passes.
- `npm run smoke:mdkg-dev-seo` passes.
- `npm run docs:check` passes.
- Product Design audit captures fresh local screenshots for the audited pages
  and classifies remaining copy as acceptable or exact gap.
- Browser local audit confirms rendered pages have no obvious layout breakage,
  no console errors, and no weird public meta/process language.
- `git diff --check` passes.

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

Passed. See `chk-381` and `chk-382`.

- `node dist/cli.js index`, full validation, changed-only validation, and
  `git diff --check` passed.
- `npm run docs:release-notes`, `npm --prefix mdkg-dev run build`,
  `npm --prefix docs run build`, `npm run smoke:mdkg-dev`,
  `npm run smoke:mdkg-dev-docs`, `npm run smoke:mdkg-dev-seo`, and
  `npm run docs:check` passed.
- Fresh local Browser/Product Design artifacts are under
  `/private/tmp/mdkg-public-copy-cleanup-20260706/`.

# Notes / Follow-ups

- No push, deploy, DNS, tag, or npm publish is authorized by this test.
- Live validation remains deferred until a later explicit push/deploy request.
