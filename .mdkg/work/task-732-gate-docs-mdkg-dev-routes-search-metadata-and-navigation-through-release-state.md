---
id: task-732
type: task
title: Gate docs.mdkg.dev routes search metadata and navigation through release state
status: todo
priority: 1
epic: epic-236
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-730]
blocks: [task-735, task-738, task-740, test-402]
refs: [test-402, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, epic-236, epic-238, epic-239, dec-74, prop-8, task-730]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Make docs.mdkg.dev consume the shared release projection before loop routes,
navigation, metadata, search, sitemap, or LLM output are emitted.

# Acceptance Criteria

- Draft navigation contains no top-level Loops group and built output contains no
  loop guide body, title, description, command, or target-version content.
- Direct `/loops/**` access is absent or returns a generic unavailable state with
  `noindex, nofollow`; it cannot reveal release guide content.
- Draft sitemap, Pagefind, LLM-facing files, metadata, and structured data exclude
  all loop routes and content.
- Active preview renders the complete release IA but remains noindex/nofollow
  and robots-disallowed.
- Published projection exposes the Loops group, routes, Pagefind, sitemap, and
  public metadata only after package/version parity succeeds.
- Existing Starlight navigation and preview-wide noindex behavior remain intact.

# Files Affected

- `docs/astro.config.*` and release-aware docs helpers
- `docs/src/` route/content ownership as required
- Docs sitemap, Pagefind, robots, metadata, and LLM output scripts/tests

# Implementation Notes

- Prefer build-time suppression when practical; a generic unavailable route is
  acceptable only when no content or indexing lane leaks.
- Reuse `task-730` projection and do not create a docs-only release flag.
- Content creation belongs to `task-735` through `task-737`.

# Test Plan

Run `test-402`; inspect direct routes and built sitemap, Pagefind, robots,
metadata, and LLM files in draft and active-preview modes.

# Links / Artifacts

- `task-730`
- `test-402`
- `prop-8`
