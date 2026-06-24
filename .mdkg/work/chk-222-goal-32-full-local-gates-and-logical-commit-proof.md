---
id: chk-222
type: checkpoint
title: Goal 32 full local gates and logical commit proof
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-516]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-516]
created: 2026-06-23
updated: 2026-06-23
---
# Summary

Goal 32 local release-quality gates passed after pass-2 mdkg.dev and docs.mdkg.dev polish, Browser/Chrome/Product Design QA, and smoke automation updates. The tree is ready to be split into logical local commits before the approved `origin/main` push and Vercel preview validation in `task-517`.

# Scope Covered

Scope covers `task-516` and the Goal 32 local gate boundary after `task-508` through `task-515` plus `test-239` through `test-245` were completed.

## Changed Surfaces

- mdkg.dev marketing pages, navigation, CTA, terminal block, base layout, sitemap, robots, `llms.txt`, and `llms-full.txt`.
- Starlight docs source, mirrored docs source, docs IA, install/quickstart/safety/changelog/roadmap/reference pages, and advanced alpha guides.
- mdkg.dev smoke scripts, docs checks, SEO/noindex checks, pass-2 polish smoke, and publish-readiness assertions.
- Goal 32 graph evidence, tests, checkpoints, and follow-up nodes.

## Boundaries

- in scope: local builds, docs checks, smokes, CLI tests, command contract checks, graph validation, strict doctor, and whitespace validation.
- out of scope: DNS changes, production promotion, npm publish, analytics activation, git tags, and public launch.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes; evidence is summarized through command names and pass/fail status.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

The pass-2 polish work is now backed by local automation and current mdkg graph evidence. The docs and marketing builds are validated in both normal and preview noindex modes, and the broader mdkg CLI test suite remains green after the site/docs/script changes.

# Implementation Details

- Code or graph surfaces changed: `mdkg-dev/`, `docs/`, `scripts/smoke-mdkg-dev*`, `scripts/assert-publish-ready.js`, `package.json`, and `.mdkg/work` evidence nodes.
- Architecture or data-shape notes: `mdkg.dev/docs` was removed as a local rendered bridge; canonical docs remain the separate Starlight docs project intended for `docs.mdkg.dev`.
- Compatibility notes: no npm runtime package version change or public CLI behavior change in this goal.

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: pass.
- `npm --prefix docs run build`: pass.
- `npm run docs:check`: pass.
- `npm run smoke:mdkg-dev`: pass.
- `npm run smoke:mdkg-dev-docs`: pass.
- `npm run smoke:mdkg-dev-seo`: pass.
- `npm run smoke:demo-graph`: pass.
- `npm run smoke:mdkg-dev-polish-pass2`: pass.
- `npm run build`: pass.
- `npm run test`: pass, 507 tests, 0 failures.
- `npm run cli:check`: pass.
- `npm run cli:contract`: pass with command contract hash `bb6d15e23a09b9a013aed406eac42e4e90f8ef6cb799759198a7777b3527ca74`.
- `node dist/cli.js validate --summary --json --limit 20`: pass with 0 warnings and 0 errors.
- `node dist/cli.js doctor --strict --json`: pass with 0 failures.
- `git diff --check`: pass.

## Pass / Fail Status

- status: pass.

## Known Warnings

- `node dist/cli.js doctor --strict --json` reports one non-failing `db.runtime_transient_files` warning for ignored local project DB runtime state; project DB verification passes.

# Known Issues / Follow-ups

- `task-517` must still create logical commits, push `main` to `origin/main`, and validate Vercel preview redeploys.
- `task-519` and `test-248` capture the deferred generated visual asset and demo video storyboard work.

## Follow-up Refs

- `task-517`
- `task-518`
- `task-519`
- `test-248`

# Links / Artifacts

- `/private/tmp/mdkg-goal32-design-qa/qa-receipt.json`
- `/private/tmp/mdkg-goal32-design-qa/product-design-audit-notes.md`
- `/private/tmp/mdkg-goal32-design-qa/chrome-spot-check.json`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
