---
id: chk-495
type: checkpoint
title: v0.5.0 loop docs route and smoke side effects hardened
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-64, task-717, test-388]
blocked_by: []
blocks: []
refs: [task-717, test-388, chk-493, chk-494]
context_refs: [goal-64, task-717, test-388]
evidence_refs: [chk-493, chk-494]
aliases: []
skills: []
scope: [task-717, test-388]
created: 2026-07-11
updated: 2026-07-11
---
# Summary

Post-prepublish manual audit restored the local docs preview, proved every loop
route, and closed two release-gate coverage gaps without publishing or
activating the dormant release.

# Scope Covered

- Local preview routing for the four v0.5.0 loop documentation pages.
- Accessibility and internal-link coverage for preview-only documentation.
- Repository-cleanliness behavior of the demo graph smoke inside prepublish.
- Goal 64 local preflight evidence only; external release actions remain gated.

# Decisions Captured

- A stopped local dev server is an operational failure, not evidence of a
  missing static route. Route existence remains enforced by build output and
  live HTTP checks.
- Preview-only pages must receive the same accessibility and internal-link
  checks as canonical docs pages.
- Smokes that exercise mutating commands must operate on temporary fixture
  copies and assert that committed fixture indexes remain byte-stable.

# Implementation Summary

- Restarted docs with `PUBLIC_MDKG_RELEASE_PREVIEW=1` on `127.0.0.1:4322` after
  confirming no process was listening on the port.
- Expanded `scripts/smoke-mdkg-dev-a11y.js` from 10 canonical pages to 19
  canonical and active-preview surfaces, including all four loop routes plus
  preview-modified install, changelog, and generated CLI reference pages.
- Updated `design-qa.md` so the durable QA receipt matches the 19-page gate.
- Changed `scripts/smoke-demo-graph.js` to copy all four demo repositories to a
  temporary root before indexing and added a source-index hash assertion.

# Verification / Testing

- Live HTTP returned `200` for `/loops/`, `/loops/templates-and-forks/`,
  `/loops/readiness-routing-evidence-closeout/`, and
  `/loops/security-audit/`; `/loops` also resolved.
- `npm run docs:check`: passed, including 459 checked command examples.
- `npm run smoke:mdkg-dev-docs`: passed with 68 required files.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:mdkg-dev-a11y`: passed with `checked_pages: 19`.
- `npm run smoke:demo-graph`: passed twice; both runs left every committed demo
  index unchanged.
- The first complete `npm publish --dry-run` passed and exposed the demo-index
  side effect through the final worktree audit. After the fix and graph update,
  a second uninterrupted run recorded in
  `/private/tmp/mdkg-v050-final-prepublish-rerun.log` exited `0` and ended with
  `+ mdkg@0.5.0`. The candidate still contains 189 files, is 397.0 kB packed,
  and retains SHA-1 `ed5069631bb24bc4fd3658cefbb4683c4998c88a`.

# Known Issues / Follow-ups

- The operator retains final manual visual review in the in-app browser.
- External registry, advisory, security, push, publish, global-install,
  activation, deployment, and production-validation actions remain owned by
  `task-718` and later Goal 64 work.

# Links / Artifacts

- `task-717`
- `test-388`
- `chk-493`
- `chk-494`
