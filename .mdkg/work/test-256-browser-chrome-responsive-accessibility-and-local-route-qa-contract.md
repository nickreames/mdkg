---
id: test-256
type: test
title: Browser Chrome responsive accessibility and local route QA contract
status: done
priority: 1
epic: epic-171
parent: goal-33
tags: [browser, chrome, accessibility, pass-3]
owners: []
links: []
artifacts: []
relates: [goal-33, task-530]
blocked_by: [task-530]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [desktop-qa, tablet-qa, mobile-qa, console-errors, code-blocks, no-secret-markers]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify local rendered marketing/docs pages with Browser and Chrome.

# Test Cases

- Desktop, tablet-ish, and mobile widths are checked.
- Marketing and docs route inventories from `edd-42` are covered.
- No page-level console errors, broken local nav, visible overlap, mobile overflow, unreadable code blocks, or raw secret/prompt/token/payload markers.
- Evidence is recorded in `chk-231`.
