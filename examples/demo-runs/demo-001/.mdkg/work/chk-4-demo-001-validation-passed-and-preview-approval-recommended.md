---
id: chk-4
type: checkpoint
title: demo-001 validation passed and preview approval recommended
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-1]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-1]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

`test-1` passed for `demo-001`: the generated site builds locally, validates in
mdkg, renders cleanly in Browser and Chrome desktop/mobile captures, and is
ready to request parent Vercel preview approval.

# Scope Covered

- `test-1`
- `goal-1`
- local website candidate in `examples/demo-runs/demo-001`

## Changed Surfaces

- No additional source changes beyond `task-1`.
- Validation evidence lives in `/private/tmp/mdkg-demo-001-validation`.

## Boundaries

- in scope: local mdkg validation, local build evidence, Browser/Chrome visual
  checks, noindex/public-claim review.
- out of scope: Vercel project creation, preview deployment, DNS, durable
  hosting, analytics, git push, tag, and npm publish.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-1`
- `dec-2`
- `edd-1`

# Implementation Summary

The completed run is a local preview candidate. It should be either kept as
local proof or handed to the parent `goal-44` preview workflow for explicit
Vercel approval.

# Test Proof

- Test target: `goal-1` / `test-1`.
- Fixtures or temp repos: local `dist/index.html`; Browser/Chrome screenshots
  in `/private/tmp/mdkg-demo-001-validation`.
- Coverage gaps: no live preview URL exists yet, so no Vercel build-log,
  deployment-id, or preview noindex check has run.

# Verification / Testing

## Command Evidence

- `node dist/cli.js --root examples/demo-runs/demo-001 validate --json`:
  `ok: true`, zero warnings.
- `npm run build`: passed with one static page.
- Browser desktop/mobile: hero, nav, React Island interaction, no horizontal
  overflow, and empty console logs verified.
- Chrome desktop/mobile: responsive rendering and React Island interaction
  captured.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: Vite/React deprecation warnings during build only; no app error.

# Known Issues / Follow-ups

- Parent `task-621` must remain approval-gated before any Vercel mutation.
- Parent `test-324` must verify preview evidence after a preview exists.

## Follow-up Refs

- parent `task-621`
- parent `test-324`
- parent `task-622`

# Links / Artifacts

- `/private/tmp/mdkg-demo-001-validation/browser-desktop-top.png`
- `/private/tmp/mdkg-demo-001-validation/browser-desktop-console-verify.png`
- `/private/tmp/mdkg-demo-001-validation/browser-mobile-top.png`
- `/private/tmp/mdkg-demo-001-validation/chrome-desktop-top.png`
- `/private/tmp/mdkg-demo-001-validation/chrome-desktop-console-build.png`
- `/private/tmp/mdkg-demo-001-validation/chrome-mobile-top.png`

# Raw Content Safety

- Evidence is summarized with artifact paths and command outcomes only. No raw
  prompts, provider payloads, credentials, cookies, tokens, or bulky execution
  traces are stored.
