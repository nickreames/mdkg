---
id: chk-255
type: checkpoint
title: goal-36 production domain cutover planning
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [goal-36, mdkg-dev, production-domain, graph-only]
owners: []
links: []
artifacts: []
relates: [task-563]
blocked_by: []
blocks: []
refs: [goal-36, task-563, test-281, task-564]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-563]
created: 2026-06-24
updated: 2026-06-24
---
# Summary

Created `goal-36`, `Launch mdkg.dev and docs.mdkg.dev production custom domains`, as the active production-domain cutover goal. The goal is intentionally implementation-scoped for the next run: it permits Chrome/Vercel verification, production custom-domain validation, minimal source changes for redirect/indexability, Browser/Chrome evidence, logical commits, push when implementation gates pass, and Vercel production-domain proof.

This checkpoint closes only the mdkg graph creation pass. No source/site/docs implementation, Vercel mutation, DNS mutation, deploy, push, npm publish, tag, analytics activation, GitHub settings mutation, or public announcement occurred.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Added `goal-36`.
- Added `spike-21`.
- Added `epic-189` through `epic-193`.
- Added `task-563` through `task-572`.
- Added `test-281` through `test-288`.
- Updated `.mdkg/index/mdkg.sqlite` through `node dist/cli.js index`.

## Boundaries

- in scope: mdkg graph planning, route contracts, task/test structure, and evidence checkpoint.
- out of scope: source edits, Vercel changes, DNS changes, deployment, push, publish, tag, analytics activation, GitHub settings mutation, public launch announcement.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- `mdkg.dev` is the canonical marketing host.
- `www.mdkg.dev` redirects to `https://mdkg.dev/`.
- `docs.mdkg.dev` is the canonical docs host.
- `https://mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Production custom domains are indexable immediately after verification.
- Preview `*.vercel.app` hosts remain noindex.

# Implementation Summary

The goal separates custom-domain execution into five lanes: provenance/boundary, Vercel/DNS/SSL, redirect/canonical/indexability, Browser/Chrome/Vercel validation, and screenshot/checklist closeout.

# Implementation Details

- Code or graph surfaces changed: mdkg graph nodes only.
- Architecture or data-shape notes: non-actionable prior context is kept in body text instead of frontmatter refs so `goal next` routing stays warning-free.
- Compatibility notes: existing untracked `nr-banner-1.png` and `nr-banner-2.png` remain untouched and outside this pass.

# Verification / Testing

## Command Evidence

- command: `git status --short --branch`
- result: repo was on `main...origin/main`; only pre-existing untracked banner images plus mdkg graph/index changes were present.
- command: `node dist/cli.js index`
- result: global, skills, capabilities, subgraphs, and SQLite indexes refreshed.
- command: `node dist/cli.js validate --summary --json --limit 20`
- result: `ok: true`, zero warnings, zero errors.
- command: `node dist/cli.js doctor --strict --json`
- result: `ok: true`; one expected local project DB runtime warning.
- command: `node dist/cli.js goal next goal-36 --json`
- result: returned `task-563` with no warnings before closeout.
- command: `node dist/cli.js goal claim goal-36 task-564 --json`
- result: `goal-36` active node is now `task-564`.

## Pass / Fail Status

- status: graph-only creation pass passed.

## Known Warnings

- Known warning: `doctor --strict` reports expected local `.mdkg/db/runtime/project.sqlite` runtime state; this is not part of the production-domain cutover.

# Known Issues / Follow-ups

- Future `task-564` must verify or attach Vercel custom domains because planning evidence showed Vercel project metadata still listing only default `*.vercel.app` domains.
- Future tasks must resolve the mixed live-domain state recorded in `goal-36`: docs served but noindex, apex placeholder-like response, and www SSL mismatch behavior.

## Follow-up Refs

- `task-564`
- `test-282`
- `test-283`

# Links / Artifacts

- `goal-36`
- `task-563`
- `test-281`
- `task-564`

# Raw Content Safety

- Evidence is summarized with mdkg refs and command outcomes only. No secrets, prompts, payloads, credentials, or private account screenshots were stored.
