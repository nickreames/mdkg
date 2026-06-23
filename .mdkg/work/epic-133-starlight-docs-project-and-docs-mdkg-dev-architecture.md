---
id: epic-133
type: epic
title: Starlight docs project and docs mdkg dev architecture
status: backlog
priority: 1
tags: [mdkg-dev, starlight, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Define the canonical docs architecture using Starlight instead of GitBook.

# Scope

- `docs/` becomes a Starlight project root in the future implementation pass.
- Vercel project name: `mdkg-docs`.
- Future host: `docs.mdkg.dev`.
- `mdkg.dev/docs` remains a marketing bridge or landing page.

# Milestones

- Specify Starlight package/build shape without implementing it.
- Map existing Markdown/docs inventory into Starlight content expectations.
- Define docs preview validation for navigation, search, SEO, code highlighting, and dark mode.

# Out of Scope

- Installing Starlight.
- Moving docs into `src/content/docs`.
- Editing docs content or generated docs.
- Creating the `mdkg-docs` Vercel project.

# Risks

- Starlight migration may require file moves and frontmatter normalization.
- Generated command docs need drift checks after migration.

# Links / Artifacts

- `task-466`
- `test-214`
- `edd-32`
- `dec-35`
- https://starlight.astro.build/
