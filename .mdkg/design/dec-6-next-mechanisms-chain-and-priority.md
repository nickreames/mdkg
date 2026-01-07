---
id: dec-6
type: dec
title: next priority uses chain first then priority (p0..p9)
status: accepted
tags: [mdkg, next, priority, chain]
created: 2026-01-06
updated: 2026-01-06
---

# Context

We need an easy “what should I do next?” capability.

Two complementary patterns exist:
- explicit curated flow (`prev/next`)
- triage and ordering (`priority`)

# Decision

- mdkg supports both:
  - explicit `prev/next` chains for linear progress
  - `priority: 0..9` for global ordering and triage
- `mdkg next` uses:
  1) chain (`next:`) when present and unambiguous
  2) otherwise priority-based selection among active statuses

Priority meaning:
- `0` = breaking/urgent
- `9` = later

# Alternatives considered

- chain only (reject): not enough for non-linear backlogs
- priority only (reject): lacks explicit linear planning when needed

# Consequences

- index must support fast filtering by status and priority
- CLI must resolve ambiguity and provide clear suggestions