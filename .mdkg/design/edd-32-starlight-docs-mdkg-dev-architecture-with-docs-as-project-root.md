---
id: edd-32
type: edd
title: Starlight docs mdkg dev architecture with docs as project root
tags: [mdkg-dev, starlight, docs]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

The canonical public docs should be an Astro Starlight site hosted separately from the marketing site at `docs.mdkg.dev`.

# Architecture

- Docs project root: `docs/`.
- Future Vercel project: `mdkg-docs`.
- Future host: `docs.mdkg.dev`.
- Starlight renders Markdown/MDX/Markdoc content with built-in navigation, search, dark mode, SEO, code highlighting, and i18n.
- `mdkg.dev/docs` remains a marketing bridge that points users to the canonical docs host.

# Data model

- Docs content: Markdown source, generated CLI reference, project docs, guides, concepts.
- Starlight config: site title, sidebar, social links, search, SEO metadata.
- Deployment: preview URL, docs route inventory, search/nav validation.

# APIs / interfaces

- Astro/Starlight build command: `npm run build`.
- Vercel output directory: `dist`.
- Generated docs contract remains repo-owned and checked by existing docs scripts.

# Failure modes

- Existing GitBook-style `SUMMARY.md` may not map directly to Starlight sidebar; implementation must translate it.
- Generated command docs may need Starlight frontmatter wrappers.
- Duplicate `/docs` and `docs.mdkg.dev` content can confuse users unless the marketing route is clearly a bridge.

# Observability

- Docs build output.
- Starlight route inventory.
- Search/nav checks.
- Generated docs drift checks.

# Security / privacy

- Docs must not expose raw secrets, tokens, private URLs, credentials, or deployment bypass data.
- Keep public-alpha limitations visible and avoid claims of unimplemented hosted services.

# Testing strategy

- Build Starlight docs locally.
- Validate top-level docs pages, generated reference, search UI, dark mode, code blocks, sitemap, robots, and metadata.
- Compare docs inventory against existing `docs/SUMMARY.md`.

# Rollout plan

1. Plan architecture in this goal.
2. Implement Starlight in a later source-change goal.
3. Deploy docs preview separately from marketing.
4. Map `docs.mdkg.dev` only after preview proof and manual DNS approval.
