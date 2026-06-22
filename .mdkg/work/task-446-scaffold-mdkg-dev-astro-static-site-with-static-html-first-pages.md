---
tags: [mdkg-dev, astro, design-system, static-site]
owners: []
links: []
artifacts: []
relates: [task-445, task-449]
blocked_by: [task-445]
blocks: [task-449, test-200]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-25, edd-27, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: task-446
type: task
title: scaffold mdkg-dev Astro static site with static HTML first pages
status: todo
priority: 1
parent: goal-25
epic: epic-122
---
# Overview

Create the mdkg.dev static site foundation after boundary design is accepted.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and task-445 is done.
- `/mdkg-dev` is an Astro static-site subproject with TypeScript and static output.
- React islands are used only for useful interaction; core public content renders as static HTML.
- `mdkg-dev/DESIGN.md` documents visual direction, colors, typography, spacing, components, diagrams, accessibility, and performance constraints.
- Design tokens are implemented in site CSS and match the visual design system contract.
- Required routes exist at minimum: `/`, `/quickstart`, `/trust`, `/alpha`, `/docs`, `/llms.txt`, `/robots.txt`, and `/sitemap.xml`.
- Core components exist: Button, Card, CodeBlock, TerminalBlock, FeatureCard, SectionHeader, CTAGroup, Badge, NavBar, Footer, DiagramCard, and claim/evidence display.
- No public publish, deploy, push, tag, DNS change, analytics activation, or production promotion occurs.

# Files Affected

- `/mdkg-dev`
- package/script wiring decided by task-445

# Implementation Notes

- Prefer static generation and crawlable HTML.
- Use white/zinc surfaces with restrained blue, sky, and teal accents.
- Use Ocean Flow gradient sparingly.
- Avoid AI glow, cartoon mascots, and hype visuals.
- Record a site/design scaffold checkpoint before closing.

# Test Plan

- Site build command selected in task-445.
- Static render smoke or equivalent route inventory.
- Mobile/code-block spot check if a local browser smoke is available.
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-122
- context: mdkg.dev visual design system contract
- context: mdkg.dev quality gate contract
