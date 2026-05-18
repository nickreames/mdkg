---
id: chk-25
type: checkpoint
title: v0.1.4 visibility enforcement readiness
status: done
priority: 1
epic: epic-27
tags: [visibility, release, checkpoint]
owners: []
links: []
artifacts: [npm run test, npm run smoke:visibility, npm pack --dry-run --json, npm publish --dry-run]
relates: [epic-27, task-144, task-145, task-146, task-147, test-84]
blocked_by: []
blocks: []
refs: []
aliases: [v0-1-4-visibility-readiness]
skills: []
created: 2026-05-18
updated: 2026-05-18
---
# Summary

Closeout checkpoint for the 0.1.4 visibility enforcement slice.

# Scope Covered

- Shared effective visibility policy.
- Pack visibility filtering.
- Archive, bundle, and import hardening.
- Validate, doctor, docs, release notes, and smoke coverage.

# Decisions Captured

- No flag on `mdkg pack` preserves existing private-capable behavior.
- Public-safe or internal-safe output requires explicit `--visibility`.
- Visibility filters mdkg records and refs; it does not redact Markdown body
  text or git history.

# Implementation Summary

Epic-27 is implemented inside the unreleased `mdkg@0.1.4` line. The release now
has a shared effective visibility policy, explicit `mdkg pack --visibility`
filtering, archive visibility flags, public bundle fail-closed checks,
non-private import profile safeguards, validation and doctor diagnostics, docs,
release notes, and packed-package smoke coverage.

# Verification / Testing

- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

The dry-run publish gate reran `npm run test`, `npm run cli:check`,
`node dist/cli.js validate`, all existing smoke scripts, the new
`npm run smoke:visibility`, and publish readiness assertions.

# Known Issues / Follow-ups

Visibility filters deterministic mdkg records and metadata refs only. They do
not redact arbitrary Markdown body text, scrub git history, or replace secret
management. Future bundle import and SQLite work should continue to use the same
policy contract.

# Links / Artifacts

- `epic-27`
