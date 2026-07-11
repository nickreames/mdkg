---
id: epic-237
type: epic
title: Incremental Process Rail loop announcement
status: todo
priority: 1
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: []
blocks: []
refs: [task-733, task-734, test-403, edd-71, dec-68, dec-73, dec-74, prd-11, prop-7, prop-8]
context_refs: [goal-62, goal-63, dec-73, dec-74, prd-11, prop-7, prop-8, task-712, task-713]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-11
updated: 2026-07-11
---
# Goal

Implement the accepted Process Rail announcement after the existing quickstart,
preserving the current homepage hierarchy and making the security walkthrough
the release CTA.

# Scope

- Exact accepted eyebrow, headline, body, CTA, link, four stages, and supported
  command anchors from `dec-74`.
- Release-state gating and dormant-output safety.
- Existing mdkg.dev design-system mapping.
- Desktop, tablet, 390px, 320px, 200% zoom, keyboard, focus, contrast,
  forced-colors, and reduced-motion behavior.

# Milestones

- `task-733`: semantic announcement implementation.
- `task-734` / `test-403`: responsive and accessible proof.

# Out of Scope

Hero, quickstart, navigation, palette, illustration-system, or general homepage
redesign; unsupported commands from the generated bitmap.

# Risks

- The new band can compete with quickstart if its height or actions grow.
- Command text can overflow narrow screens or drift from CLI truth.

# Links / Artifacts

- `.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png`
- `dec-74`
- `test-403`
