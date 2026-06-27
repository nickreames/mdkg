---
id: chk-308
type: checkpoint
title: goal-42 current local web validation passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-current-local-validation-20260627, /private/tmp/mdkg-goal42-current-local-validation-20260627/browser-local-validation-final.json, /private/tmp/mdkg-goal42-current-local-validation-20260627/chrome-local-validation-final.json]
relates: [task-605]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-42, task-602, task-605, test-308, test-310]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Refreshed local pre-publish web validation for the current `goal-42` tree after
tightening the mdkg.dev `0.4.0` launch-track wording.

The mdkg.dev homepage now states the approval boundary directly:
local validation is pre-publish, and live validation is post-publish and
post-deploy after approval. The same section now also exposes `MANIFEST.md`
naming as a visible public capability alongside config overlays, custom skill
mirrors, and `COLLABORATION.md`.

# Scope Covered

Scope is captured in frontmatter: `goal-42`, `task-602`, `task-605`,
`test-308`, and `test-310`.

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- `scripts/smoke-mdkg-dev.js`
- `scripts/smoke-mdkg-dev-seo.js`
- local-only Browser/Chrome receipts under
  `/private/tmp/mdkg-goal42-current-local-validation-20260627`

## Boundaries

- in scope: source homepage copy, smoke assertions, local static builds, local
  Browser desktop/mobile validation, local Chrome desktop validation, and mdkg
  evidence.
- out of scope: git push, deploy, DNS, analytics, npm publish, git tag, live
  production validation, and provider mutation.
- raw secrets, raw prompts, raw payloads, provider UI, npm auth state, and bulky
  execution traces excluded.

# Decisions Captured

- Keep JSON-LD `softwareVersion` anchored to `package.json`/`mdkg@0.3.9` until
  a real `0.4.0` npm publish occurs.
- Label the launch lane as `0.4.0 launch track` while avoiding any claim that
  `mdkg@0.4.0` is already published.
- State local/live validation sequencing in user-facing copy:
  local validation is pre-publish; live validation is post-publish and
  post-deploy after approval.
- Include `MANIFEST.md` naming in the homepage launch-track capability set.

# Implementation Summary

- Updated the homepage launch-track paragraph to use direct pre-publish and
  post-publish/post-deploy validation language.
- Added a `Manifest naming` feature card that tells users to author new
  reusable capability records as `MANIFEST.md`, with `SPEC.md` as a one-release
  compatibility alias.
- Updated `smoke:mdkg-dev` and `smoke:mdkg-dev-seo` assertions so future
  changes preserve this public wording.

# Test Proof

- Test target: local built mdkg.dev at `http://127.0.0.1:4292/` and local
  built docs.mdkg.dev at `http://127.0.0.1:4293/`.
- Artifact folder:
  `/private/tmp/mdkg-goal42-current-local-validation-20260627`.
- Browser receipt:
  `/private/tmp/mdkg-goal42-current-local-validation-20260627/browser-local-validation-final.json`.
- Chrome receipt:
  `/private/tmp/mdkg-goal42-current-local-validation-20260627/chrome-local-validation-final.json`.
- Browser coverage: homepage desktop/mobile, docs changelog desktop/mobile,
  and docs packs/handoffs desktop.
- Chrome coverage: homepage desktop, docs changelog desktop, and docs
  packs/handoffs desktop.
- Coverage gaps: live production validation remains open until explicit
  push/deploy approval and post-deploy Browser/Chrome verification.

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed with the known non-fatal Starlight
  `Entry docs -> 404 was not found` warning.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:mdkg-dev-polish-pass5`: passed.
- `npm run smoke:mdkg-dev-a11y`: passed with 10 checked pages.
- `npm run smoke:mdkg-dev-perf`: passed; marketing output remained 0 JS bytes
  and 62,090 total bytes.
- `npm run docs:check`: passed with 401 checked examples and 0 failures.
- Initial parallel `npm run smoke:mdkg-dev` attempt failed with an `ENOTEMPTY`
  `dist/init` cleanup race while other build-backed commands were running; the
  same command passed immediately when rerun sequentially.
- In-app Browser validation: passed; all markers present, zero console errors,
  zero console warnings, no stale `--pack-profile concise`, `--profile concise`
  observed, and homepage JSON-LD `softwareVersion` was `0.3.9`.
- Chrome validation: passed with the same marker, console, profile syntax, and
  `softwareVersion` results.

## Pass / Fail Status

- status: local pre-publish validation passed; live post-publish/post-deploy
  validation remains pending approval.

## Known Warnings

- `npm --prefix docs run build` still prints the known non-fatal Starlight
  `Entry docs -> 404 was not found` warning.

# Known Issues / Follow-ups

- `task-605` and `test-308` must stay open until an approved push/redeploy
  produces current production pages and live Browser/Chrome verification passes.
- `package.json` remains `0.3.9`; no `0.4.0` npm publish readiness is claimed
  here.

## Follow-up Refs

- `goal-42`
- `task-602`
- `task-605`
- `test-308`
- `test-310`

# Links / Artifacts

- `/private/tmp/mdkg-goal42-current-local-validation-20260627/browser-local-validation-final.json`
- `/private/tmp/mdkg-goal42-current-local-validation-20260627/chrome-local-validation-final.json`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw
  secrets, raw prompts, raw payloads, or bulky execution traces.
