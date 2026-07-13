---
id: test-394
type: test
title: Live sites pass desktop mobile accessibility SEO no secret and fix forward checks
status: done
priority: 1
epic: epic-235
tags: [release, browser, accessibility, seo, no-secret]
owners: []
links: []
artifacts: []
relates: [goal-64, task-723]
blocked_by: []
blocks: []
refs: [task-723]
context_refs: [goal-64, epic-235, edd-72, dec-69, dec-81, task-722, test-393, chk-516]
evidence_refs: [chk-513, chk-514, chk-515, chk-516, chk-517]
aliases: []
skills: []
cases: []
created: 2026-07-10
updated: 2026-07-13
---
# Overview

Provide final user-visible proof that both live sites accurately and accessibly
represent the published package and that failures have explicit recovery work.

# Target / Scope

Homepage, loop docs, install/upgrade, CLI examples, release notes, metadata, links.

# Preconditions / Environment

Exact production deployments for fix-forward commit `32245512`,
Product Design/Browser/Chrome access, npm proof, and completed activation
receipt `chk-516`. This test is the acceptance lane within `task-723` and is not
blocked on that task closing first.

# Test Cases

- Desktop/mobile visual, navigation, keyboard, contrast, and semantic checks.
- SEO, canonical, structured metadata, displayed 0.5.0, and link validation.
- No-secret scan and source/live content parity.
- Final receipt contains all release evidence, residual risks, fix-forward work,
  and explicit no-tag confirmation.

# Results / Evidence

Passed. Both exact-SHA Vercel deployments succeeded for `32245512`; all named
routes returned `200`; the corrected docs Edit-page link resolves through the
`docs/` monorepo prefix; desktop and mobile layouts have no horizontal overflow
or incoherent overlap; canonical, H1, language, viewport, navigation, version,
and public-alpha checks passed; Chrome keyboard focus and Skip-to-content passed;
browser consoles were clean; public-output secret patterns were absent; and the
serial site, docs, SEO, 19-page accessibility, and performance smoke checks
passed. Full evidence is compressed in `chk-517`.

# Notes / Follow-ups

- No release-blocking live defect remains.
- No additional security scan, npm publish, global install, or approval cycle is
  part of this test.
