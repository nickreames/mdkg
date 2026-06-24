---
id: task-550
type: task
title: fix preview docs CTA link behavior across header hero footer and docs bridge
status: done
priority: 1
epic: epic-182
parent: goal-35
tags: [mdkg-dev, docs, links, vercel-preview]
owners: []
links: []
artifacts: []
relates: [test-270]
blocked_by: [task-549]
blocks: [task-551]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Make every preview-facing docs CTA and docs bridge link resolve to the live docs preview instead of future DNS.

# Acceptance Criteria

- Marketing header, hero, footer, final CTA, and `/docs` route target `https://mdkg-docs.vercel.app/` for docs.
- Copy can name `docs.mdkg.dev` as future canonical docs only when clearly labeled as future DNS.
- External link behavior is consistent and testable.
- No DNS, Vercel production, or public launch changes occur.

# Test Plan

- Run the pass-5 link smoke added in this goal.
- Verify links in Browser/Chrome local and hosted preview checks.

# Files Affected

# Implementation Notes

# Links / Artifacts
