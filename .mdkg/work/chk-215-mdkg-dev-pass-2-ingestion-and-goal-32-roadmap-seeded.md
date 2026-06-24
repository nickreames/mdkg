---
id: chk-215
type: checkpoint
title: mdkg.dev pass 2 ingestion and goal-32 roadmap seeded
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-505]
created: 2026-06-23
updated: 2026-06-23
---
# Summary

The `mdkg_preview_polish_pass2/` feedback bundle was ingested into mdkg planning state. Goal 31 now owns the graph/design-only distillation, and paused Goal 32 is ready as the future implementation run for all P0, P1, P2, and P3 pass-2 stories.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Added private source archive `archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24`.
- Added readable source evidence folder `mdkg_preview_polish_pass2/` and zip `mdkg_preview_polish_pass2_docs.zip`.
- Added `goal-31` and `goal-32`.
- Added epics `epic-153` through `epic-164`.
- Added spike `spike-17`, tasks `task-499` through `task-518`, and tests `test-235` through `test-247`.
- Added product/design decisions `prd-7`, `edd-36`, `edd-37`, `edd-38`, `dec-37`, and `dec-38`.

## Boundaries

- in scope: mdkg graph/design/archive/index state and feedback source evidence.
- out of scope: functional edits to `mdkg-dev/`, `docs/`, `examples/`, `src/`, `scripts/`, package metadata, generated command docs, deploy config, Vercel settings, DNS, npm, tags, analytics, and public launch.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- `dec-37`: Claims Evidence Matrix is internal evidence, not public docs navigation.
- `dec-38`: delete the marketing `/docs` bridge now; future redirect to `docs.mdkg.dev` is separate launch/cutover work.

# Implementation Summary

Goal 32 is intentionally paused and implementation-scoped. It requires all P0/P1/P2/P3 stories, local Browser/Chrome/Product Design proof, logical commits, push to `origin/main`, Vercel preview validation, and explicit no-launch boundaries.

# Implementation Details

- Code or graph surfaces changed: mdkg graph/design/archive/index files only.
- Architecture or data-shape notes: design and historical context that can confuse `goal next` routing is kept in body sections rather than traversal-sensitive frontmatter.
- Compatibility notes: no public CLI, website, docs, package, or deployment behavior changed in Goal 31.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js archive verify archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24 --json`
- result: passed.
- command: `node dist/cli.js index`
- result: passed.
- command: `node dist/cli.js validate --summary --json --limit 20`
- result: passed with zero warnings after index.
- command: `node dist/cli.js goal next goal-31 --json`
- result: routed to `task-499` during ingestion with no warnings after edge cleanup.
- command: `node dist/cli.js goal next goal-32 --json`
- result: routed to `task-507` with no warnings.

## Pass / Fail Status

- status: pass.

## Known Warnings

- warning: none after final index and validation.

# Known Issues / Follow-ups

- Goal 32 is paused and must be explicitly activated before any site/docs/source implementation or push.
- Generated visual/image assets are not part of Goal 32's first implementation path; Goal 32 should create follow-up nodes after copy stabilizes.

## Follow-up Refs

- `goal-32`
- `task-507`
- `test-239` through `test-247`

# Links / Artifacts

- `archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24`
- `mdkg_preview_polish_pass2/`
- `prd-7`
- `edd-36`
- `edd-37`
- `edd-38`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
