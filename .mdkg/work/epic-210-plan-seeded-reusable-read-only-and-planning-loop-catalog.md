---
id: epic-210
type: epic
title: Plan seeded reusable read-only and planning loop catalog
status: todo
priority: 1
tags: [loop, planning, seeds, templates, audits]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-57, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-05
updated: 2026-07-05
---
# Goal

Plan the initial mdkg-owned reusable loop catalog for read-only and planning
workflows that agents can import, fork, enhance, and rerun against repos.

# Scope

- Security audit loop.
- Design/frontend UX audit loop.
- Backend/API/CLI design-bloat audit loop.
- Tech-stack best-practices audit loop.
- Duplicate-code/linting audit loop.
- Test/CI/SKILL.md infrastructure audit loop.
- User-story audit and recommendations loop.
- Seed/import behavior and documentation expectations.

# Milestones

- Define catalog entry purposes and expected linked child nodes.
- Specify which loops are read-only audit loops and which are planning loops.
- Add seed-template implementation contract tests.

# Out of Scope

- Write-capable implementation loops in the seed catalog MVP.
- Making seeded loops runtime jobs.
- CocoIndex-backed semantic retrieval.

# Risks

- Seed loops could become too generic to be useful.
- Audit loops could appear to mutate code without explicit write mode.
- Frontend/backend quality loops could mix product-specific policy into generic
  mdkg primitives.

# Links / Artifacts

- `goal-57`
- `task-671`
- `test-348`
