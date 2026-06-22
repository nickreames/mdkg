---
tags: [mdkg-dev, astro, site-foundation]
owners: []
links: []
artifacts: []
relates: [goal-25, edd-24]
blocked_by: []
blocks: [spike-14, task-445, task-446, test-200]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: epic-122
type: epic
title: mdkg-dev Astro subproject foundation
status: todo
priority: 1
---
# Goal

Create the Astro static-site foundation for mdkg.dev inside `/mdkg-dev` without destabilizing the CLI package.

# Scope

- Research implementation risks and lock package/tooling boundaries.
- Scaffold a static HTML-first Astro site.
- Add `mdkg-dev/DESIGN.md`, tokens, core components, required routes, and static render proof.

# Milestones

- `spike-14`: implementation risks grounded.
- `task-445`: tooling/package boundary accepted with checkpoint.
- `task-446`: site/design scaffold accepted with checkpoint.
- `test-200`: static render contract passes.

# Out of Scope

- No production deploy.
- No public launch.
- No Vercel promotion.

# Risks

- Subproject tooling could conflict with root package scripts.
- Site source could accidentally enter npm package contents.
- Visual design could drift from launch trust posture.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
