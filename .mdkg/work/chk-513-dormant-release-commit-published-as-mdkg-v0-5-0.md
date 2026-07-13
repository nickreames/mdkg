---
id: chk-513
type: checkpoint
title: Dormant release commit published as mdkg v0.5.0
checkpoint_kind: implementation
status: done
priority: 9
tags: [release, npm, ci, v0.5.0]
owners: []
links: []
artifacts: [artifact://npm/mdkg/0.5.0, artifact://github-actions/run/29254216004]
relates: [task-719]
blocked_by: []
blocks: []
refs: [goal-64, test-390, dec-69, dec-81, chk-496, chk-512]
context_refs: [goal-64, task-718, test-389, test-390, task-720]
evidence_refs: [chk-496, chk-511, chk-512]
aliases: []
skills: []
scope: [task-719]
created: 2026-07-13
updated: 2026-07-13
---
# Summary

The exact dormant release candidate commit
`7afbf6d8df58279f70c6257b65437791fec59e63` was pushed to `origin/main`, passed
both required GitHub Actions package gates, and was published exactly once as
`mdkg@0.5.0`. Npm `latest` now resolves to `0.5.0`; the website release manifest
remains `draft`, and no Git tag was created.

# Scope Covered

- First dormant push, exact-SHA CI, npm publication, and immediate registry
  metadata verification.

## Changed Surfaces

- Git origin advanced from `794436c7` to `7afbf6d8`.
- Npm registry published `mdkg@0.5.0` with `latest` set to `0.5.0`.

## Boundaries

- in scope: dormant push, CI, npm publish, and immediate registry proof
- out of scope: global installation, website activation, production deployment
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `chk-496` supplied the bounded operator approval.
- `dec-69` keeps the release tagless and requires fix-forward behavior.
- `dec-81` accepts manual source-backed security requalification for v0.5.0.

# Implementation Summary

- Full local `prepublishOnly` passed immediately before publication.
- GitHub Actions run `29254216004` passed Node `24.15.0` and Node `24.x` gates.
- Origin and local SHA matched exactly before publish.
- Npm owner/auth, version absence, and zero-advisory checks passed immediately
  before publication.

# Verification / Testing

## Command Evidence

- `git push origin main`: pushed through `7afbf6d8`.
- `gh run watch 29254216004 --exit-status`: passed both jobs.
- `npm publish`: published `mdkg@0.5.0` with 190 files.
- `npm view mdkg version`: `0.5.0`.
- Registry SHA-1: `e2912a1069761b392fc9ed2c713ecb4bd690758e`.
- Registry integrity:
  `sha512-n3k5Sjn7PcNk5gnEkGIVdeYyRBZ9A0UG6hkneEro1vRWTP3+XXy4HKVdbJ1AcnnJE6JGvQWdv8ayHmqEqxvYLQ==`.

## Pass / Fail Status

- status: done

## Known Warnings

- The published npm version is irreversible; all later failures must fix
  forward. Website activation remains intentionally dormant.

# Known Issues / Follow-ups

- Verify registry-fetched bytes, clean install, and `0.4.2` upgrade in `task-720`.

## Follow-up Refs

- `task-720`, `test-391`

# Links / Artifacts

- `artifact://npm/mdkg/0.5.0`
- `artifact://github-actions/run/29254216004`

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
