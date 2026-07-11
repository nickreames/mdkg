---
id: chk-380
type: checkpoint
title: public copy meta-language regression scan passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md, /private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.json]
relates: [test-342]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-342]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

The public-copy regression contract passed for the audited mdkg.dev and
docs.mdkg.dev surfaces. Forbidden process/meta phrases were absent from source
and built public outputs after the cleanup.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Regression coverage now lives in `scripts/smoke-mdkg-dev.js` and
  `scripts/smoke-mdkg-dev-seo.js` for homepage copy.
- Manual phrase scan covered mdkg.dev source/public assets/dist, docs source/dist,
  generated release-note data, and `CHANGELOG.md`.

## Boundaries

- in scope: homepage, demos, demo output, docs install, safety boundaries,
  generated CLI reference, changelog, and rendered static outputs.
- out of scope: non-rendered demo template fixture wording, live production
  deployment, provider state, tags, push, and npm publish.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

What changed? What patterns or architecture emerged?

# Test Proof

- Test target: forbidden public process/meta terms from `task-663`,
  `task-664`, and `task-665`.
- Fixtures or temp repos: local built `mdkg-dev/dist` and `docs/dist`.
- Coverage gaps: example template source docs still use preview-approval
  workflow wording and should be handled by a future template-copy pass if they
  become public-facing documentation.

# Verification / Testing

## Command Evidence

- `rg -n "<forbidden terms>" mdkg-dev/src mdkg-dev/public mdkg-dev/dist docs/src docs/_generated/release-notes.json CHANGELOG.md docs/dist`: no matches.
- Earlier broader scan including smoke scripts found only intentional negative
  assertion strings in `scripts/smoke-mdkg-dev.js` and
  `scripts/smoke-mdkg-dev-seo.js`.

## Pass / Fail Status

- status: passed

## Known Warnings

- none

# Known Issues / Follow-ups

- Optional follow-up: clean internal preview-approval wording from
  `examples/website-demo-template/**` and `examples/demo-runs/demo-001/**` if
  those fixtures are promoted as public reader-facing docs.

## Follow-up Refs

- task/test/goal refs:

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.json`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
