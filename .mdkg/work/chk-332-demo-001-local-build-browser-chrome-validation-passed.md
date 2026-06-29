---
id: chk-332
type: checkpoint
title: demo-001 local build Browser Chrome validation passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-322]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-322]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

`test-322` passed for `examples/demo-runs/demo-001`: the forked website demo
builds locally and has desktop/mobile Browser and Chrome visual evidence.

# Scope Covered

- `test-322`
- `examples/demo-runs/demo-001`
- local Browser/Chrome validation artifacts under `/private/tmp/mdkg-demo-001-validation`

## Changed Surfaces

- Demo run source:
  `examples/demo-runs/demo-001/src/pages/index.astro`,
  `src/components/GoalRunConsole.tsx`, `src/styles/global.css`, and
  `src/assets/ocean-flow-map.svg`.
- Demo run package files: `package.json`, `package-lock.json`,
  `astro.config.mjs`, and `tsconfig.json`.
- Validation harness: `scripts/smoke-demo-graph.js`.

## Boundaries

- in scope: local build, local render validation, screenshot receipts, graph
  status updates.
- out of scope: Vercel project creation, preview deployment, DNS, aliases,
  durable `demo-N.mdkg.dev` hosting, git push, tag, npm publish, analytics, and
  production promotion.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `edd-58`
- `edd-59`

# Implementation Summary

The forked run became a complete local Astro static website with a focused
React Island console and Ocean Flow visual treatment. The site is explicit that
it is a local preview candidate only and that Vercel work requires separate
approval.

# Test Proof

- Test target: `examples/demo-runs/demo-001`.
- Fixtures or temp repos: local Astro build output under ignored `dist/`;
  Browser/Chrome screenshots under `/private/tmp/mdkg-demo-001-validation`.
- Coverage gaps: no live Vercel preview exists yet; that remains `task-621`.

# Verification / Testing

## Command Evidence

- `npm install` in `examples/demo-runs/demo-001`: passed with 0
  vulnerabilities.
- `npm run build` in `examples/demo-runs/demo-001`: passed; built one static
  page.
- `node dist/cli.js --root examples/demo-runs/demo-001 validate --json`:
  `ok: true`, zero warnings.
- Browser local check: desktop/mobile screenshots showed the hero, navigation,
  React Island interaction, no horizontal overflow, and no console logs.
- Chrome local check: desktop/mobile screenshots confirmed responsive rendering
  and React Island interaction.
- `npm run smoke:demo-graph`: passed after allowing completed forked runs to
  report an achieved goal with no next node.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: Astro/Vite build emitted upstream React plugin deprecation warnings
  for `esbuild` and `optimizeDeps.esbuildOptions`; no app build failure.

# Known Issues / Follow-ups

- `task-621` must create or verify the Vercel preview project and deployment
  only after explicit approval.
- `test-324` must validate preview URL evidence after a preview exists.

## Follow-up Refs

- `task-621`
- `test-324`
- `task-622`

# Links / Artifacts

- `/private/tmp/mdkg-demo-001-validation/browser-desktop-top.png`
- `/private/tmp/mdkg-demo-001-validation/browser-desktop-console-verify.png`
- `/private/tmp/mdkg-demo-001-validation/browser-mobile-top.png`
- `/private/tmp/mdkg-demo-001-validation/chrome-desktop-top.png`
- `/private/tmp/mdkg-demo-001-validation/chrome-desktop-console-build.png`
- `/private/tmp/mdkg-demo-001-validation/chrome-mobile-top.png`
- `examples/demo-runs/demo-001/.mdkg/work/chk-4-demo-001-validation-passed-and-preview-approval-recommended.md`

# Raw Content Safety

- Evidence is summarized with artifact paths only. No raw prompts, provider
  payloads, credentials, cookies, tokens, or bulky execution traces are stored.
