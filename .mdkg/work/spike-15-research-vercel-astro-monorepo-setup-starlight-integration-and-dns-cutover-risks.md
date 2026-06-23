---
id: spike-15
type: spike
title: research Vercel Astro monorepo setup Starlight integration and DNS cutover risks
status: done
priority: 1
epic: epic-131
parent: goal-27
tags: [mdkg-dev, research, vercel, starlight, dns]
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
# Research Question

What is the safest preview-first hosting architecture for mdkg.dev when the marketing site and canonical docs are both Astro-based but should deploy as separate Vercel projects?

# Context And Constraints

- Marketing source already exists under `mdkg-dev/` as an Astro static site.
- Existing repo docs live under `docs/`; this will become the Starlight project root in a future implementation pass.
- `mdkg.dev` is owned by the user and DNS will be changed manually only after preview proof.
- This spike is graph-only; it must not deploy, create Vercel projects, edit DNS, or implement Starlight.

# Search Plan

- Verify Vercel Astro and monorepo root-directory setup from official docs.
- Verify Starlight project structure, sidebar/navigation, search, SEO, and content root expectations.
- Verify DNS cutover needs for apex, `www`, and `docs` subdomains.
- Identify preview validation evidence needed before manual DNS cutover.

# Findings

- Vercel supports Astro and monorepo root-directory project setup.
- Starlight is Astro-native and covers the missing docs defaults: navigation, search, dark mode, SEO, Markdown/MDX/Markdoc, code highlighting, and i18n.
- A separate docs project avoids overloading the current marketing Astro site and keeps `docs.mdkg.dev` independent from `mdkg.dev`.
- DNS cutover should remain manual and later because the current goal is preview hosting readiness, not public launch.

# Options And Tradeoffs

- Separate Vercel projects: cleaner domain ownership, independent preview URLs, and simpler `docs.mdkg.dev`; requires two Vercel projects.
- One Astro project with Starlight embedded: simpler hosting count, but mixes marketing and docs concerns and makes `docs.mdkg.dev` less clean.
- GitBook: rejected for this lane because Starlight solves the docs UX inside the existing Astro/Vercel ecosystem.

# Recommendation

Use two Vercel projects from the same repository: `mdkg-dev` rooted at `mdkg-dev/` and `mdkg-docs` rooted at `docs/`. Implement Starlight later in `docs/`, keep `mdkg.dev/docs` as a bridge/landing page, and map `docs.mdkg.dev` only after preview proof.

# Follow-Up Nodes To Create

- No additional nodes are required during this alignment pass unless validation identifies missing deploy-boundary coverage.

# Skill Candidates

- A future skill may be useful for Vercel preview launch proof after the execution pattern stabilizes.

# Data Structures And Algorithms Notes

- Treat hosting configuration as typed evidence: project name, root, build command, output directory, domain, DNS target, and validation receipt.

# UX Notes

- Preview validation must use both Browser and Chrome because the user will manually critique the live preview before public launch.

# Security Notes

- Do not store secrets, Vercel tokens, DNS credentials, cookies, or private deployment bypass tokens in mdkg nodes or handoffs.

# mdkg.dev Launch Implications

- Preview URLs can be shared for critique, but canonical `mdkg.dev` should not cut over until site polish, docs rendering, metadata, and DNS checks are accepted.

# Evidence And Sources

- https://vercel.com/docs/frameworks/frontend/astro
- https://vercel.com/docs/monorepos
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://starlight.astro.build/
- https://starlight.astro.build/getting-started/
