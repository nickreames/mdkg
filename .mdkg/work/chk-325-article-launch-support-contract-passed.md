---
id: chk-325
type: checkpoint
title: article launch support contract passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/]
relates: [test-311]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-311]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The article launch support contract passed. The announcement support material in
`task-606` is constrained to source-backed, changelog-backed, and live-page
validated claims.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `test-311` closed as done.
- No article was published and no public channel was mutated.

## Boundaries

- in scope: article-support claim validation for the June 28, 2026 announcement
  target.
- out of scope: publishing the article, deploying, tagging, DNS, analytics, or
  downstream repo mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- June 28, 2026 remains timing context only, not authorization for further
  side effects.

# Implementation Summary

`task-606` now lists article-safe claims:

- mdkg is a local-first Git-native project memory loop for AI coding agents.
- `0.4.0` makes mdkg.dev and docs.mdkg.dev launch-current for the public alpha.
- Public pages describe config overlays, skill mirrors, `COLLABORATION.md`, and
  `MANIFEST.md` naming.
- Release claims are backed by npm postpublish, Vercel currentness, Chrome live
  validation, and public no-secret evidence.

# Test Proof

- Test target: article-support claims and launch-page/release-note alignment.
- Fixtures or temp repos: none.
- Coverage gaps: none blocking.

# Verification / Testing

## Command Evidence

- command: reviewed `task-606` article-support section and `chk-324`.
- result: claims map to changelog/release notes, live pages, source behavior,
  and mdkg evidence; unsupported public-side-effect claims are excluded.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: final public posting remains outside this repo and is not performed.

# Known Issues / Follow-ups

- Close `test-312` and evaluate `goal-42`.

## Follow-up Refs

- `test-312`
- `goal-42`

# Links / Artifacts

- `task-606`
- `chk-324`
- `https://mdkg.dev/`
- `https://docs.mdkg.dev/project/changelog/`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
