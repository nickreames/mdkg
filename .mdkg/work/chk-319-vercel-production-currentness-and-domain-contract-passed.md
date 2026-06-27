---
id: chk-319
type: checkpoint
title: Vercel production currentness and domain contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [https://mdkg.dev/, https://www.mdkg.dev/, https://docs.mdkg.dev/project/changelog/, https://vercel.com/nicholas-reames-projects/mdkg-dev/2FeaoHwN9daYMreGoD97oufN7i7d, https://vercel.com/nicholas-reames-projects/mdkg-docs/HoDTghjzwAkK66QLjGKjAkLEracQ]
relates: [test-319]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-319]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The Vercel production currentness and custom-domain contract passed.

Both `mdkg-dev` and `mdkg-docs` production deployments are `READY`, target
`production`, match commit `28ff45fe155dd35a2e5e688242febac39ede1aac`, and the
custom domains serve the expected `0.4.0` public content.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `test-319` closed as done.
- Evidence recorded from read-only Vercel project/deployment/log inspection and
  live custom-domain checks.

## Boundaries

- in scope: Vercel/domain currentness proof.
- out of scope: new deploy, DNS, analytics, tag, Chrome live validation, and
  final launch closeout.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Passing this contract enables `task-617`; it does not replace Chrome live
  validation.

# Implementation Summary

The production deployments created by the approved `main` push are current for
the 0.4.0 release source and custom domains.

# Test Proof

- Test target: Vercel production deployments, build logs, commit currentness,
  and public custom-domain content.
- Fixtures or temp repos: none.
- Coverage gaps: live Chrome desktop/mobile validation remains `task-617`.

# Verification / Testing

## Command Evidence

- command: Vercel project/deployment/build-log inspection.
- result: `mdkg-dev` deployment `dpl_2FeaoHwN9daYMreGoD97oufN7i7d` and
  `mdkg-docs` deployment `dpl_HoDTghjzwAkK66QLjGKjAkLEracQ` are `READY`,
  production, alias-error-free, and built from commit
  `28ff45fe155dd35a2e5e688242febac39ede1aac`.
- command: live custom-domain HTTP/HTML checks.
- result: `mdkg.dev`, `www.mdkg.dev`, and
  `docs.mdkg.dev/project/changelog/` returned 200 and all required 0.4.0
  markers were present.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: project-level `live: false` remains visible in Vercel project
  records, but is resolved by deployment aliases and custom-domain evidence.

# Known Issues / Follow-ups

- Chrome live production validation must still pass before launch closeout.

## Follow-up Refs

- `task-617`
- `test-320`
- `task-605`
- `task-606`
- `test-312`

# Links / Artifacts

- `chk-318`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
