---
id: task-563
type: task
title: create goal-36 graph lock boundaries and record current DNS Vercel evidence
status: done
priority: 1
epic: epic-189
parent: goal-36
tags: []
owners: []
links: []
artifacts: [chk-255]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-255]
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Create the goal-36 graph, lock the production-domain cutover boundary, record the current mixed DNS/Vercel evidence, and close the mdkg-only creation pass without source or Vercel mutation.

# Acceptance Criteria

- `goal-36` exists, is active, and initially routes to `task-563`.
- Scope includes epics, spike, tasks, and tests for the production custom-domain cutover.
- Current evidence records that Vercel DNS delegation exists, `docs.mdkg.dev` serves docs but noindex, apex returns a placeholder-like response, and `www` has SSL mismatch behavior.
- `test-281` is done after routing validation.
- `task-563` closes with checkpoint evidence and `goal-36` claims `task-564`.
- No source, site, docs, Vercel, DNS, push, publish, tag, or unrelated untracked files are changed.

# Files Affected

- `.mdkg/work/**`
- `.mdkg/index/mdkg.sqlite`

# Implementation Notes

- Leave `nr-banner-1.png` and `nr-banner-2.png` untouched.
- This task is the graph-only setup boundary; implementation starts at `task-564`.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js goal show goal-36 --json`
- `node dist/cli.js goal next goal-36 --json`
- `node dist/cli.js pack goal-36 --pack-profile concise`
- `git diff --check`

# Links / Artifacts

- `goal-36`
- `test-281`
