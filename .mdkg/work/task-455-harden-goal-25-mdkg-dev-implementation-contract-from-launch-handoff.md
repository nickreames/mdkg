---
tags: [mdkg-dev, graph-only, alignment]
owners: []
links: []
artifacts: []
relates: [goal-25]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-25, edd-26, edd-27, dec-30]
evidence_refs: [chk-185]
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-22
updated: 2026-06-22
id: task-455
type: task
title: harden goal-25 mdkg.dev implementation contract from launch handoff
status: done
priority: 1
parent: goal-25
epic: epic-126
---
# Overview

Enhance the existing paused goal-25 roadmap from the mdkg.dev launch handoff without starting functional implementation.

# Acceptance Criteria

- goal-25 remains paused with `active_node: spike-14`.
- goal-25 includes detailed execution phases, checkpoint requirements, route/page inventory, docs inventory, launch-quality gates, and stop conditions.
- Existing goal-25 child tasks/tests have decision-complete requirements rather than placeholder shells.
- New design and decision records clarify visual design, public claims/SEO, quality gates, GitBook ownership, and Vercel readiness.
- No files outside `.mdkg` are changed in this hardening pass.

# Files Affected

- `.mdkg/work/goal-25-*`
- `.mdkg/work/epic-122-*` through `.mdkg/work/epic-126-*`
- `.mdkg/work/task-445-*` through `.mdkg/work/task-455-*`
- `.mdkg/work/test-200-*` through `.mdkg/work/test-206-*`
- new mdkg.dev visual design, claims/SEO, quality, GitBook ownership, and Vercel readiness design records

# Implementation Notes

- Keep the pass graph-only.
- Do not activate goal-25.
- Do not create `/mdkg-dev`, `/docs`, or `/examples`.
- Keep goal-25 routing pointed at `spike-14`.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal show goal-25 --json`
- `node dist/cli.js goal next goal-25 --json`
- `node dist/cli.js pack goal-25 --pack-profile concise`
- `git diff --check`

# Evidence

- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal show goal-25 --json`
- `node dist/cli.js goal next goal-25 --json`
- `node dist/cli.js pack goal-25 --pack-profile concise`
- `git diff --check`

# Closeout

Completed as graph-only alignment. Future work should activate goal-25 explicitly and start with `spike-14`.

# Links / Artifacts

- parent: goal-25
- epic: epic-126
- archive://archive.mdkg-dev-planning-docs-2026-06-22
- context: mdkg.dev visual design system contract
- context: mdkg.dev claims SEO and measurement contract
- context: mdkg.dev quality gate contract
- context: GitBook repo-first ownership policy
- context: Vercel readiness and no-production-launch boundary
