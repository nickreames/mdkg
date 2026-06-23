---
id: chk-187
type: checkpoint
title: mdkg.dev static site and design scaffold accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [mdkg-dev, astro, static-site, design-system, goal-25]
owners: []
links: [https://docs.astro.build/en/guides/on-demand-rendering/, https://docs.astro.build/en/guides/framework-components/]
artifacts: []
relates: [task-446]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-446, edd-24, edd-25, edd-28, edd-30, dec-30]
evidence_refs: []
aliases: []
skills: []
scope: [task-446]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The first mdkg.dev site scaffold is buildable. `/mdkg-dev` now contains an isolated Astro static-site package, a design-system contract, global CSS tokens, required core components, and initial static routes for homepage, quickstart, trust, alpha, docs bridge, `llms.txt`, `robots.txt`, and `sitemap.xml`.

# Scope Covered

- task-446
- mdkg.dev visual design system scaffold
- initial static route inventory

## Changed Surfaces

- `mdkg-dev/package.json`
- `mdkg-dev/package-lock.json`
- `mdkg-dev/astro.config.mjs`
- `mdkg-dev/tsconfig.json`
- `mdkg-dev/DESIGN.md`
- `mdkg-dev/public/favicon.svg`
- `mdkg-dev/src/styles/global.css`
- `mdkg-dev/src/components/*`
- `mdkg-dev/src/layouts/BaseLayout.astro`
- `mdkg-dev/src/pages/*`
- `.gitignore`
- `.mdkg/work/task-446-*`
- `.mdkg/work/chk-187-*`

## Boundaries

- in scope: local static site scaffold, design tokens, route shells, public-alpha copy boundaries, build proof.
- out of scope: GitBook docs source, generated command reference docs, example graphs, subgraph registration, Vercel deploy, GitBook production config, DNS, analytics activation, npm publish, tag, push, and public launch.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- Use Astro static output with no client JavaScript in the initial scaffold.
- Do not add React until a real island interaction is implemented.
- Use HTML/CSS diagrams and code snippets as the first visual assets.
- Keep site dependencies isolated in `/mdkg-dev`.
- Keep design source in `mdkg-dev/DESIGN.md` and tokens in `src/styles/global.css`.

# Implementation Summary

The scaffold establishes a static-first route and component foundation that future tasks can expand into full docs, generated references, public copy, examples, and launch checks. The first viewport uses a product diagram instead of decorative art, keeping the site focused on mdkg's repo-memory model.

# Implementation Details

- Code or graph surfaces changed: new `/mdkg-dev` subproject plus `.gitignore` generated-cache rule.
- Architecture or data-shape notes: routes are static pages or static endpoint files; future smokes can inspect `mdkg-dev/dist`.
- Compatibility notes: `mdkg-dev/.astro/`, `mdkg-dev/dist/`, and `mdkg-dev/node_modules/` are generated and ignored.

# Verification / Testing

## Command Evidence

- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm install --prefix mdkg-dev`
  result: installed 207 packages, audited 208, 0 vulnerabilities.
- command: `npm --prefix mdkg-dev run build`
  result: Astro built static output successfully and generated `/`, `/quickstart`, `/trust`, `/alpha`, `/docs`, `/llms.txt`, `/robots.txt`, and `/sitemap.xml`.
- command: `find mdkg-dev/dist -maxdepth 3 -type f -print | sort`
  result: confirmed expected built route files plus favicon and one CSS asset.
- command: `du -sh mdkg-dev/dist`
  result: approximately `72K`.
- command: `rg -n "secret|token|PRIVATE KEY|provider payload|raw prompt|/Users/nick" mdkg-dev/src mdkg-dev/DESIGN.md mdkg-dev/public`
  result: only expected safety-boundary language in design/trust content; no raw secret or local path leakage.

## Pass / Fail Status

- status: pass for static site scaffold and design-system foundation.

## Known Warnings

- warning: no browser screenshot/mobile visual QA yet. That belongs with the later launch-smoke task after docs and examples exist.

# Known Issues / Follow-ups

- task-447 must add GitBook-ready docs source and preserve existing docs.
- task-448 must add generated command-reference docs and drift checks.
- task-449 must expand homepage copy, claims evidence, metadata, `llms-full.txt`, robots/sitemap quality, and trust copy.
- task-452 must add automated site/docs/SEO/demo smokes and mobile/code-block checks.

## Follow-up Refs

- task-447
- task-448
- task-449
- task-452
- test-200

# Links / Artifacts

- local build artifact: `mdkg-dev/dist/`
- design doc: `mdkg-dev/DESIGN.md`
- source archive: `archive://archive.mdkg-dev-planning-docs-2026-06-22`

# Raw Content Safety

- Evidence is summarized with commands, route inventory, and source refs. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
