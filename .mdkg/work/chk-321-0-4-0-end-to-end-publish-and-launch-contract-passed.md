---
id: chk-321
type: checkpoint
title: 0.4.0 end-to-end publish and launch contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-0.4.0-chrome-live-20260627, /private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json, https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/]
relates: [test-320]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-320]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The `0.4.0` end-to-end publish and launch contract passed. The package is
published and installable from npm, Vercel production deployments are current
for the approved release commit, Chrome live desktop/mobile validation passed,
and public no-secret/content sanity found no release-blocking issues.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `test-320` closed as done.
- End-to-end proof now ties together npm publish/postpublish, Vercel
  currentness, Chrome live validation, public content, and approval boundaries.

## Boundaries

- in scope: evidence review for the complete `0.4.0` package and public-site
  launch path.
- out of scope: additional npm publish, git tag, git push, Vercel deploy, DNS,
  analytics, provider mutation, or article publication.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- The release is ready for final launch-readiness closeout from the evidence
  perspective; `task-606` still owns the final recommendation wording.

# Implementation Summary

The completed evidence chain is:

- `chk-316`: real `mdkg@0.4.0` npm publish completed after explicit approval.
- `chk-317`: npm latest/dist-tags and clean temp global install/probes passed.
- `chk-318`: Vercel production deployments for `mdkg.dev` and `docs.mdkg.dev`
  are current and built from commit `28ff45fe155dd35a2e5e688242febac39ede1aac`.
- `chk-319`: custom-domain currentness and Vercel build-log/domain contract
  passed.
- `chk-320`: Chrome live desktop/mobile validation passed.

# Test Proof

- Test target: `goal-42` end-to-end publish and launch readiness contract.
- Fixtures or temp repos: postpublish npm temp prefix/workspace from `chk-317`;
  Chrome live artifact folder from `chk-320`.
- Coverage gaps: none blocking. Final closeout still needs `task-605`,
  `task-606`, and `test-312` state transitions.

# Verification / Testing

## Command Evidence

- command: reviewed publish, postpublish, Vercel, and Chrome evidence
  checkpoints.
- result: all upstream contracts passed.
- command: `node dist/cli.js goal next goal-42 --json`.
- result: selector advanced from `test-320` to `task-605`, confirming the
  end-to-end test no longer blocks the launch-proof umbrella.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: Vercel project records still reported `live: false`; accepted under
  `chk-318`/`chk-319` because production aliases and custom domains served the
  expected release content.

# Known Issues / Follow-ups

- Close `task-605` with the completed Browser/Product Design/SEO/no-secret and
  live Chrome proof summary.
- Close `task-606` and `test-312` with the final launch-readiness
  recommendation.

## Follow-up Refs

- `task-605`
- `task-606`
- `test-312`

# Links / Artifacts

- `chk-316`
- `chk-317`
- `chk-318`
- `chk-319`
- `chk-320`
- `/private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
