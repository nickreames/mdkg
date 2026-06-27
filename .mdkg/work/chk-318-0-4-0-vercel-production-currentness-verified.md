---
id: chk-318
type: checkpoint
title: 0.4.0 Vercel production currentness verified
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [https://mdkg.dev/, https://www.mdkg.dev/, https://docs.mdkg.dev/project/changelog/, https://vercel.com/nicholas-reames-projects/mdkg-dev/2FeaoHwN9daYMreGoD97oufN7i7d, https://vercel.com/nicholas-reames-projects/mdkg-docs/HoDTghjzwAkK66QLjGKjAkLEracQ]
relates: [task-616]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-616]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Verified Vercel production currentness for `mdkg.dev` and `docs.mdkg.dev` after
the `mdkg@0.4.0` npm publish and postpublish validation.

The earlier approved push to `origin/main` triggered Vercel production
deployments for both projects. No new Vercel deploy, DNS change, analytics
change, or provider mutation was performed during this verification pass.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `task-616` closed as done.
- Read-only Vercel project/deployment/build-log evidence recorded.
- Read-only custom-domain HTTP/HTML evidence recorded.

## Boundaries

- in scope: Vercel project/deployment/log inspection and live custom-domain
  currentness checks.
- out of scope: new Vercel deploy, git push, git tag, DNS, analytics, Chrome
  live validation, and final launch closeout.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- The project-level `live: false` field is accepted as non-blocking because
  deployment aliases and custom-domain HTML checks prove production currentness
  for the required domains.

# Implementation Summary

Both Vercel projects are on production deployments built from commit
`28ff45fe155dd35a2e5e688242febac39ede1aac`, the commit previously pushed and
used for the npm release prep.

# Implementation Details

- Code or graph surfaces changed: mdkg evidence only.
- Architecture or data-shape notes: no provider mutation was needed because the
  approved `main` push had already triggered production deployments.
- Compatibility notes: live docs now expose `0.4.0` release coverage required
  before Chrome live validation.

# Verification / Testing

## Command Evidence

- command: Vercel `get_project` for `mdkg-dev`.
- result: project `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`, team
  `team_RkZhrKQs9wWs6PAdTcrwZ87z`, latest deployment
  `dpl_2FeaoHwN9daYMreGoD97oufN7i7d`, `READY`, `production`, domains include
  `mdkg.dev` and `www.mdkg.dev`.
- command: Vercel `get_project` for `mdkg-docs`.
- result: project `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`, team
  `team_RkZhrKQs9wWs6PAdTcrwZ87z`, latest deployment
  `dpl_HoDTghjzwAkK66QLjGKjAkLEracQ`, `READY`, `production`, domains include
  `docs.mdkg.dev`.
- command: Vercel `get_deployment` for both latest deployments.
- result: both deployments `READY`, target `production`, source `git`, alias
  errors null, GitHub commit SHA
  `28ff45fe155dd35a2e5e688242febac39ede1aac`.
- command: Vercel build-log inspection for both deployments.
- result: both builds completed and deployments completed; no release-blocking
  errors found.
- command: custom-domain HTTP/HTML marker checks for `https://mdkg.dev/`,
  `https://www.mdkg.dev/`, and `https://docs.mdkg.dev/project/changelog/`.
- result: all returned 200; `www.mdkg.dev` resolved to `https://mdkg.dev/`;
  required markers for `0.4.0`, `mdkg@0.4.0`, JSON-LD `softwareVersion:
  0.4.0`, Vercel currentness, and Chrome live-validation were present.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: Vercel project records still report `live: false`; accepted because
  deployment aliases and public custom-domain content proved currentness.

# Known Issues / Follow-ups

- `task-617` must still run live Chrome validation before launch closeout.
- Final no-secret/content sanity and launch recommendation remain later nodes.

## Follow-up Refs

- `test-319`
- `task-617`
- `test-320`

# Links / Artifacts

- mdkg.dev deployment:
  `https://vercel.com/nicholas-reames-projects/mdkg-dev/2FeaoHwN9daYMreGoD97oufN7i7d`
- docs deployment:
  `https://vercel.com/nicholas-reames-projects/mdkg-docs/HoDTghjzwAkK66QLjGKjAkLEracQ`
- live domains: `https://mdkg.dev/`, `https://www.mdkg.dev/`,
  `https://docs.mdkg.dev/project/changelog/`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
