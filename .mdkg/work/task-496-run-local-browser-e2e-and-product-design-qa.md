---
id: task-496
type: task
title: run local Browser E2E and Product Design QA
status: todo
priority: 1
tags: [mdkg-dev, browser, product-design, qa]
owners: []
links: []
artifacts: []
relates: [test-231, test-233]
blocked_by: [task-495]
blocks: [task-497]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Run local Browser E2E and Product Design QA before committing/pushing implementation work.

# Acceptance Criteria

- Local marketing and docs previews are tested at desktop `1440x900` and mobile `390x844`.
- Browser validation covers homepage, quickstart, trust, docs bridge, docs homepage, install, quickstart docs, claims matrix, roadmap, and one mobile flow.
- Product Design review confirms visual hierarchy, first-screen clarity, mobile layout, product proof visuals, CTA clarity, and accessibility basics.
- Screenshots/receipts are safe to record and do not contain raw secrets/prompts/tokens/payloads.

# Test Plan

- Browser route checks and screenshots.
- Product Design QA notes.
- `node dist/cli.js validate --summary --json --limit 20`

# Files Affected

# Implementation Notes

# Links / Artifacts
