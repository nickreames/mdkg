---
id: epic-191
type: epic
title: production redirect canonical robots sitemap and indexability implementation
status: todo
priority: 1
tags: []
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
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Implement the minimal source/config behavior needed for production custom domains.

# Scope

- `mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Production canonicals target `https://mdkg.dev` and `https://docs.mdkg.dev`.
- Production robots/sitemaps are indexable.
- Preview hosts remain noindex.

# Milestones

- `task-566` implements docs redirect.
- `task-567` configures production canonical/index behavior.
- `task-568` validates SEO and route behavior.

# Out of Scope

- Broad copy/design polish.
- DNS changes outside the approved custom-domain cutover.

# Risks

- Production can accidentally remain noindex if Vercel env flags are not set.
- Preview hosts can accidentally become indexable if environment checks regress.

# Links / Artifacts

- `mdkg-dev/src/pages/docs.astro`
- `mdkg-dev/src/layouts/BaseLayout.astro`
- `docs/astro.config.mjs`
