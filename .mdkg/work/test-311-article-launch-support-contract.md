---
id: test-311
type: test
title: article launch support contract
status: done
priority: 2
epic: epic-203
parent: goal-42
tags: [0.4.0, article, announcement, test]
owners: []
links: []
artifacts: [https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/]
relates: []
blocked_by: [task-606]
blocks: []
refs: [task-606, chk-324]
context_refs: []
evidence_refs: [chk-325]
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate that the article announcement support package is source-backed and
aligned with launch pages.

# Target / Scope

`task-606`, release notes, mdkg.dev/docs.mdkg.dev launch pages, and changelog
facts.

# Preconditions / Environment

Run after article-support materials and launch readiness evidence exist.

# Test Cases

- Article claims map to changelog entries, source behavior, examples, or mdkg
  evidence.
- Release notes and launch pages support the article narrative.
- June 28, 2026 article timing is explicitly recorded as target context, not as
  deploy/publish authorization.

# Results / Evidence

Passed. See `chk-325`.

# Notes / Follow-ups

- Final public posting remains outside mdkg repo mutation unless separately
  requested.
