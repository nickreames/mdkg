---
id: epic-177
type: epic
title: accessibility responsiveness performance and reduced-motion QA
status: todo
priority: 1
tags: [mdkg-dev, accessibility, performance]
owners: []
links: []
artifacts: []
relates: [goal-34, task-545, test-266]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-44, edd-46, dec-44]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Add measured accessibility, responsive, reduced-motion, high-contrast, and performance gates before launch traffic.

# Scope

Automated a11y/perf checks, manual keyboard/focus evidence, mobile overflow checks, reduced-motion handling, high-contrast review, and practical performance budgets.

# Milestones

- No critical a11y violations on key routes.
- Mobile widths have no horizontal overflow.
- Performance budget receipt is recorded.

# Out of Scope

Claiming comprehensive WCAG compliance beyond tested scope.

# Risks

- Lab metrics vary by environment.
- Automated a11y checks miss keyboard-flow issues.

# Links / Artifacts

- `task-545`
- `test-266`
