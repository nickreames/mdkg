---
id: chk-381
type: checkpoint
title: local build smoke and browser audit passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md, /private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.json, /private/tmp/mdkg-public-copy-cleanup-20260706/focused-screenshots.json]
relates: [test-343]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-343]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

Local build, smoke, generated-doc, Product Design, and Browser validation passed
for the public-copy cleanup. Fresh screenshots and DOM/console checks were
captured for mdkg.dev and docs.mdkg.dev local builds at desktop and mobile
sizes.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `mdkg-dev/dist` and `docs/dist` were rebuilt locally for validation.
- Browser audit artifacts were written under
  `/private/tmp/mdkg-public-copy-cleanup-20260706/`.

## Boundaries

- in scope: local static builds, smoke checks, generated docs/release notes,
  local Browser rendered-page checks, and Product Design-style screenshot
  review.
- out of scope: live production validation, Vercel deployment, push, tag, npm
  publish, DNS, analytics, and provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

What changed? What patterns or architecture emerged?

# Test Proof

- Test target: local mdkg.dev and docs.mdkg.dev public-copy cleanup.
- Fixtures or temp repos: local static servers for `mdkg-dev/dist` on port 4173
  and `docs/dist` on port 4174.
- Coverage gaps: no live production validation was performed because no push or
  deploy was authorized in this pass.

# Verification / Testing

## Command Evidence

- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: `ok: true`.
- `node dist/cli.js validate --changed-only --json`: `ok: true`.
- `npm run docs:release-notes`: passed.
- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run docs:check`: passed.
- `git diff --check`: passed.
- Browser audit: 18 desktop/mobile page checks, 0 forbidden phrase failures, 0
  console error pages.

## Pass / Fail Status

- status: passed

## Known Warnings

- none

# Known Issues / Follow-ups

- none blocking local readiness. Live validation remains intentionally deferred
  until a later explicit push/deploy request.

## Follow-up Refs

- task/test/goal refs:

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.json`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/focused-screenshots.json`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
