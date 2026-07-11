---
id: test-404
type: test
title: Loops documentation routes navigation search and indexing obey release state
status: todo
priority: 1
epic: epic-238
tags: [release, test, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-736]
blocks: [test-407]
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, epic-238, dec-74, prop-8, task-735, task-736]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prove first-class loop documentation is complete and discoverable only when the
shared release projection allows it.

# Target / Scope

`task-735` and `task-736`; four-route IA except walkthrough detail, top-level
navigation, content accuracy, direct routes, sitemap, Pagefind, LLM output,
themes, mobile navigation, links, and code overflow.

# Preconditions / Environment

Docs draft and active-preview builds, desktop/mobile browser, Pagefind index,
sitemap, LLM files, and Starlight light/dark/auto modes.

# Test Cases

- Draft mode exposes no Loops navigation, route content, metadata, search result,
  sitemap URL, or LLM text.
- Active preview exposes a top-level Loops group after Concepts and before Guides
  with exactly the four accepted routes.
- Overview accurately distinguishes goals/loops and mdkg/harness ownership.
- Templates page lists all seven templates, materialization modes, provenance,
  stale warnings, and no automatic rewrite.
- Lifecycle page accurately covers typed readiness, approvals, evidence, waivers,
  continuation, blocking, and closeout.
- Desktop and mobile navigation, heading order, links, current-page state, code
  overflow, and light/dark/auto themes pass.
- Preview routes remain noindex/nofollow and robots-disallowed.

# Results / Evidence

Pending Goal 63 implementation.

# Notes / Follow-ups

- A broad docs-sidebar cleanup is out of scope.
- Generated CLI reference remains syntax authority.
