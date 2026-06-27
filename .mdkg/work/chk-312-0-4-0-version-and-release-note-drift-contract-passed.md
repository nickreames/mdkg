---
id: chk-312
type: checkpoint
title: 0.4.0 version and release note drift contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-316]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-316]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Validated the `0.4.0` version and release-note drift contract.

The root package metadata, generated docs, public changelog pages, and mdkg.dev
structured metadata now agree on the `0.4.0` source release target. Remaining
`0.3.9` references are historical release entries, not stale target metadata.

# Scope Covered

- `test-316`
- `task-612`
- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- `docs/_generated/release-notes.json`
- `docs/_generated/cli-reference.md`
- `docs/_generated/command-contract-summary.json`
- `docs/src/content/docs/project/changelog.md`
- `docs/project/changelog.md`
- `mdkg-dev/src/pages/index.astro`

## Changed Surfaces

- Verified version alignment after task implementation.
- Confirmed generated release-note data has `package_version` and
  `latest_release` set to `0.4.0`.
- Confirmed generated CLI reference reports package version `0.4.0`.
- Confirmed public changelog pages mention `0.4.0`, `0.3.9`, `0.3.8`, and
  required historical `0.3.7` coverage.

## Boundaries

- in scope: local source/version drift proof.
- out of scope: npm publish, Vercel deployment, Chrome live validation, DNS,
  analytics, git push, and git tag.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- `0.4.0` source metadata can be prepared locally before publish, but final
  live claims remain blocked on postpublish and Vercel/Chrome evidence.

# Implementation Summary

The drift contract passed for the local source state and unblocks the next
prepublish gate task.

# Test Proof

- Test target: `task-612` release metadata and public docs drift.
- Fixtures or temp repos: none.
- Coverage gaps: registry availability, npm dry-run, postpublish install,
  Vercel deployment, and Chrome live proof are covered by later nodes.

# Verification / Testing

## Command Evidence

- command: `rg` drift scan across package metadata, generated docs, public
  changelog pages, mdkg.dev source, claims, and smoke scripts.
- result: target metadata reports `0.4.0`; remaining `0.3.9` refs are
  historical release content.
- command: `npm run docs:check`
- result: pass.
- command: `node scripts/assert-publish-ready.js`
- result: pass.
- command: `npm --prefix docs run build`
- result: pass.
- command: `npm --prefix mdkg-dev run build`
- result: pass.
- command: `npm run smoke:mdkg-dev-docs`
- result: pass.
- command: `npm run smoke:mdkg-dev`
- result: pass.
- command: `npm run smoke:mdkg-dev-seo`
- result: pass.
- command: `node dist/cli.js validate --changed-only --json`
- result: pass.
- command: `node dist/cli.js validate --json`
- result: pass with one accepted legacy `SPEC.md` compatibility warning.
- command: `git diff --check`
- result: pass.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: accepted legacy `SPEC.md` compatibility warning remains in full
  graph validation.

# Known Issues / Follow-ups

- `task-613` must still run registry checks, full prepublish gates, pack
  dry-run, and publish dry-run before any real npm publish decision.

## Follow-up Refs

- `task-613`
- `test-317`

# Links / Artifacts

- `chk-311`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
