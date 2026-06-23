---
id: test-200
type: test
title: mdkg-dev subproject build and static-render contract
status: done
priority: 1
epic: epic-122
parent: goal-25
tags: [mdkg-dev, contract, static-render]
owners: []
links: []
artifacts: []
relates: [task-446]
blocked_by: [task-446]
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [edd-24]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate the mdkg-dev static site foundation.

# Acceptance Criteria

- Astro site build succeeds from the selected workspace command.
- Required routes render as static output: `/`, `/quickstart`, `/trust`, `/alpha`, `/docs`, `/llms.txt`, `/robots.txt`, and `/sitemap.xml`.
- Core HTML content is crawlable without client-only rendering.
- React islands, if any, are limited to useful interactions.
- Design tokens and core components from the visual design system contract are present.
- Mobile/code-block layout does not overflow in the smoke or documented manual proof.

# Test Plan

- `npm run smoke:mdkg-dev`
- Site build command selected by task-445.
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-122
