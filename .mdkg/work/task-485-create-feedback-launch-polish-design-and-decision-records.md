---
id: task-485
type: task
title: create feedback launch polish design and decision records
status: done
priority: 1
tags: [mdkg-dev, edd, decision, feedback]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create the design and decision records that make Goal 30 decision-complete before implementation begins.

# Acceptance Criteria

- `edd-34` defines product/docs/SEO polish architecture.
- `edd-35` defines Browser/Product Design/Vercel validation proof.
- `dec-36` records P0 plus core P1 scope with P2 deferred.

# Files Affected

- `.mdkg/design/edd-34-*.md`
- `.mdkg/design/edd-35-*.md`
- `.mdkg/design/dec-36-*.md`

# Test Plan

- `node dist/cli.js show edd-34 --json`
- `node dist/cli.js show edd-35 --json`
- `node dist/cli.js show dec-36 --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
