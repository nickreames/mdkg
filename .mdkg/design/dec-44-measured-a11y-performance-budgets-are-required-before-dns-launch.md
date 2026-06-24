---
id: dec-44
type: dec
title: measured a11y performance budgets are required before DNS launch
status: accepted
tags: [mdkg-dev, accessibility, performance]
owners: []
links: []
artifacts: []
relates: [goal-34, task-545]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

The current sites are static and promising, but the latest audit explicitly did not run Lighthouse, axe, or real mobile-device tests. Launch confidence requires measurement, not only visual inspection.

# Decision

mdkg.dev must have measured accessibility and performance budgets before any DNS launch or production promotion.

# Alternatives considered

- Rely on Starlight/Astro defaults and manual review.
- Add automated checks plus Browser/Chrome manual evidence.

# Consequences

- Launch readiness becomes evidence-backed.
- Goal-34 must add practical a11y/perf scripts and document known exceptions instead of claiming full compliance.
- Production launch remains blocked until these budgets pass or are explicitly waived.

# Links / references

- `goal-34`
- `task-545`
- `test-266`
