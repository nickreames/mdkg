---
id: chk-339
type: checkpoint
title: short path demo route evidence passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-324]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-324]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

Local Browser and Chrome proof passed for `/demos`, `/demo/1`, and
`/demo/1/output` at desktop and mobile sizes.

# Scope Covered

- `test-324`
- `goal-44`

## Changed Surfaces

- mdkg test/checkpoint evidence
- local route validation screenshots under `/private/tmp/mdkg-goal44-demo-routes`

## Boundaries

- in scope: local route build, browser rendering, metadata, noindex output proof
- out of scope: live production validation, push, deploy, DNS, tag, publish
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `dec-58`: short path demo routes are the public URL model.
- `dec-59`: local proof uses the existing `mdkg-dev` app.

# Implementation Summary

Validated that `/demos` and `/demo/1` are public indexable pages and
`/demo/1/output` is a noindex preview surface. The detail route exposes graph,
filesystem, output, and boundary markers from the sanitized snapshot.

# Test Proof

- Test target: `/demos`, `/demo/1`, and `/demo/1/output`.
- Fixtures or temp repos: local `mdkg-dev` preview at `127.0.0.1:4322`.
- Coverage gaps: production deployment validation is intentionally deferred.

# Verification / Testing

## Command Evidence

- command: Browser local validation against `http://127.0.0.1:4322`
- result: desktop/mobile routes loaded with no console errors or horizontal
  overflow.
- command: Chrome local validation against `http://127.0.0.1:4322`
- result: desktop/mobile routes loaded with no console errors or horizontal
  overflow.
- command: metadata checks
- result: `/demos` and `/demo/1` had index/follow metadata; `/demo/1/output`
  had `noindex,nofollow` and no scripts.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: none from Browser or Chrome route validation

# Known Issues / Follow-ups

- Production deployment and live validation are still not part of this local
  goal and require separate approval.

## Follow-up Refs

- `task-622`
- `test-325`

# Links / Artifacts

- `/private/tmp/mdkg-goal44-demo-routes/browser-desktop-demos.png`
- `/private/tmp/mdkg-goal44-demo-routes/browser-desktop-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/browser-desktop-demo-1-output.png`
- `/private/tmp/mdkg-goal44-demo-routes/browser-mobile-demos.png`
- `/private/tmp/mdkg-goal44-demo-routes/browser-mobile-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/browser-mobile-demo-1-output.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-desktop-demos.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-desktop-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-desktop-demo-1-output.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-mobile-demos.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-mobile-demo-1.png`
- `/private/tmp/mdkg-goal44-demo-routes/chrome-mobile-demo-1-output.png`

# Raw Content Safety

- Browser/Chrome evidence is local screenshot and summarized DOM metadata only.
