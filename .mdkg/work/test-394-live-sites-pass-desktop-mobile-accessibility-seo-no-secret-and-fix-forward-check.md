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
context_refs: [goal-64, epic-235, edd-72, dec-69]
evidence_refs: []
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

Current production deployments, Product Design/Browser/Chrome access, npm proof.

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
