---
id: test-394
type: test
title: Live sites pass desktop mobile accessibility SEO no secret and fix forward checks
status: todo
priority: 1
epic: epic-235
tags: [release, browser, accessibility, seo, no-secret]
owners: []
links: []
artifacts: []
relates: [goal-64, task-723]
blocked_by: [task-723]
blocks: []
refs: [task-723]
context_refs: [goal-64, epic-235, edd-72, dec-69, dec-81, task-722, test-393, chk-516]
evidence_refs: [chk-513, chk-514, chk-515, chk-516]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Provide final user-visible proof that both live sites accurately and accessibly
represent the published package and that failures have explicit recovery work.

# Target / Scope

Homepage, loop docs, install/upgrade, CLI examples, release notes, metadata, links.

# Preconditions / Environment

Current production deployments at `b265da71`, Product Design/Browser/Chrome
access, npm proof, and completed activation receipt `chk-516`.

# Test Cases

- Desktop/mobile visual, navigation, keyboard, contrast, and semantic checks.
- SEO, canonical, structured metadata, displayed 0.5.0, and link validation.
- No-secret scan and source/live content parity.
- Final receipt contains all release evidence, residual risks, fix-forward work,
  and explicit no-tag confirmation.

# Results / Evidence

Pending `task-723` and live deployment.

# Notes / Follow-ups

- Goal remains open for any release-blocking live defect.
- No additional security scan, npm publish, global install, or approval cycle is
  part of this test.
