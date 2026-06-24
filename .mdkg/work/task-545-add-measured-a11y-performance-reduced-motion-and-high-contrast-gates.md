---
id: task-545
type: task
title: add measured a11y performance reduced-motion and high-contrast gates
status: todo
priority: 1
epic: epic-177
parent: goal-34
tags: [mdkg-dev, accessibility, performance]
owners: []
links: []
artifacts: []
relates: [goal-34, test-266]
blocked_by: [task-536, task-538, task-541]
blocks: [task-546, task-547]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-44, edd-46, dec-44]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Add measured launch-quality gates for accessibility, responsiveness, performance, reduced motion, and high contrast.

# Acceptance Criteria

- Automated check covers homepage, quickstart, trust, docs homepage, install, docs quickstart, work node types, and agent workflow.
- No critical a11y violations on key pages or documented exceptions exist.
- Performance budget records LCP, TBT/INP proxy, CLS, JS/CSS/image weight where feasible.
- Reduced-motion and high-contrast behavior is checked.
- `test-266` passes.

# Files Affected

- `scripts/**`
- `package.json`
- site/docs source as needed for remediation

# Implementation Notes

- Choose axe, pa11y, Lighthouse CI, or Playwright plus axe based on repo fit.
- Keep checks practical for local and preview environments.

# Test Plan

Run new a11y/perf smoke commands and record checkpoint evidence.

# Links / Artifacts

- `test-266`
