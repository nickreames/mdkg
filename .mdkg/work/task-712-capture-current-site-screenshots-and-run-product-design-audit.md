---
id: task-712
type: task
title: Capture current site screenshots and run Product Design audit
status: todo
priority: 1
epic: epic-230
prev: task-711
next: task-713
tags: [release, product-design, audit, screenshots]
owners: []
links: []
artifacts: []
relates: [goal-62, test-385]
blocked_by: [task-711]
blocks: [task-713]
refs: [test-385]
context_refs: [goal-62, epic-230, edd-71, dec-68, dec-73, prd-11, task-711]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Capture fresh desktop and mobile screenshots of mdkg.dev and docs.mdkg.dev and
run Product Design Audit before proposing release changes.

# Acceptance Criteria

- Fresh desktop and mobile screenshots cover the mdkg.dev homepage hero,
  quickstart and exact post-quickstart insertion boundary, quickstart page,
  docs landing/navigation, install, agent workflow, generated CLI reference,
  and changelog.
- Audit reports UX, visual hierarchy, contrast, accessibility, consistency, and
  release-message opportunities tied to screenshot evidence.
- Findings are prioritized as release blocker, recommended, or follow-up.
- Audit evaluates incremental announcement placement and top-level Loops
  discoverability without proposing a broad hero or homepage redesign.

# Files Affected

List files/directories expected to change.

- Planning artifacts and screenshot evidence only
- No website/docs source edits

# Implementation Notes

- Use Product Design `audit` and in-app Browser.
- Do not create Figma unless the operator explicitly requests it.
- Screenshot findings may identify accessibility risks, but Goal 3 must perform
  keyboard, semantic, contrast, and responsive implementation checks.

# Test Plan

Review the screenshot set and audit findings with the operator before ideation.

# Links / Artifacts

- `edd-71`
- `dec-73`
- `prd-11`
