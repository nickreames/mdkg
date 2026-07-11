---
id: epic-218
type: epic
title: Seeded reusable audit and planning loop catalog
status: todo
priority: 1
tags: [loop, seeds, audit, planning]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Seed reusable read-only and planning-oriented loop templates that agents can
fork, inspect, and improve without treating them as runtime jobs.

# Scope

- Security audit loop.
- Design/frontend UX audit loop.
- Backend/API/CLI design-bloat audit loop.
- Tech-stack best-practices audit loop.
- Duplicate-code/linting audit loop.
- Test/CI/SKILL.md infrastructure audit loop.
- User-story audit and recommendations loop.

# Milestones

- `task-683` creates the seeded catalog.
- `test-358` proves the catalog is present and validation-clean.

# Out of Scope

- No write-capable implementation loops in MVP seeds.
- No repo-specific private policy baked into generic templates.

# Risks

- Seeds could become prose-only templates instead of graph-native loop nodes.
- Seeds could accidentally imply mdkg executes agents.

# Links / Artifacts

- `goal-58`
- `task-671`
- `test-348`
