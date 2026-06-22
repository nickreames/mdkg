---
title: mdkg.dev Static Site Architecture EDD
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph / mdkg.dev
---

# mdkg.dev Static Site Architecture EDD

## 1. Purpose

This document defines the recommended architecture for `mdkg.dev`, the public website for Markdown Knowledge Graph.

The site should be static, crawlable, fast, and easy for both humans and AI agents to read. It should live inside the mdkg repository so the project can dogfood its own subgraph and handoff workflows while keeping website copy synchronized with the CLI, README, command contract, changelog, and documentation.

## 2. Core architectural decision

Build `mdkg.dev` as an owned static site inside the mdkg repo using:

- **Astro** for static site generation and content-driven pages.
- **React islands/components** where interactivity improves UX.
- **Markdown/MDX** for authored content.
- **Generated artifacts** from mdkg command metadata where possible.
- **GitBook** as the professional developer docs surface at `docs.mdkg.dev`.

The key decision is to avoid a pure client-rendered single-page application for the core product/docs surface. The site should serve real HTML for SEO, sharing previews, fast first load, and LLM readability.

## 3. Repository placement

`mdkg.dev` should live inside the mdkg repo.

Recommended conceptual layout:

```text
mdkg/
├── src/                         # mdkg CLI source
├── package.json
├── README.md
├── CHANGELOG.md
├── AGENT_START.md
├── CLI_COMMAND_MATRIX.md
├── dist/
│   └── command-contract.json    # generated command metadata
├── mdkg-dev/                    # Astro + React static site
│   ├── package.json
│   ├── astro.config.*
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── content/
│   │   ├── data/
│   │   └── styles/
│   ├── public/
│   └── scripts/
├── docs/                        # repo-owned docs source for GitBook sync
├── examples/ or demos/           # nested demo/template projects
├── .mdkg/                       # root project memory/orchestration graph
└── .mdkg/subgraphs/             # projected child graph inspection trees
```

A more concrete naming decision can be made during implementation. The key requirements are:

- The site is inside the mdkg repo.
- The site can consume generated CLI metadata.
- The site can link to docs synced from the same repo.
- The site itself can be modeled as a nested mdkg subgraph for dogfooding.
- Demo/template graphs can sit side by side with the site as nested subprojects.

## 4. Dogfooding model

The mdkg root repo should orchestrate mdkg.dev development using mdkg itself.

Desired model:

```text
root mdkg graph
  ├── mdkg CLI/source work
  ├── mdkg.dev subgraph
  ├── demo repo subgraph
  └── template graph subgraph
```

This supports several product goals:

- Demonstrates mdkg subgraph usage in a real repo.
- Allows mdkg.dev to ingest mdkg artifacts as the repo evolves.
- Gives the project a credible “built with itself” story.
- Creates realistic examples for docs, demos, and handoffs.
- Keeps website requirements close to CLI implementation work.

## 5. Site responsibilities

`mdkg.dev` should own:

- Product positioning.
- Landing page.
- Quickstart entry point.
- Demo/video embeds.
- Links to GitHub, npm, docs, X, LinkedIn, Nicholas site, and ochatr.ai.
- Public alpha trust messaging.
- SEO metadata.
- Social preview metadata.
- `llms.txt` and optional `llms-full.txt`.
- Generated/linked command reference bridge.
- Redirects to GitBook docs.

`mdkg.dev` should not own:

- Full documentation CMS.
- Full CLI reference authoring by hand.
- Private analytics dashboards.
- User accounts.
- Graph editing UI.
- Runtime execution services.

## 6. GitBook responsibilities

`docs.mdkg.dev` should own:

- Professional docs navigation.
- Quickstart and installation guide.
- Concepts.
- Guides.
- Safety boundaries.
- Public alpha contract.
- Advanced alpha docs.
- Generated or synchronized CLI reference.
- Changelog or changelog bridge.

The repo should remain the canonical source for docs. GitBook should be used as a polished documentation surface, not as the only copy of product truth.

## 7. Data and generated artifacts

The website should consume generated artifacts where possible to reduce drift.

Important inputs:

- `package.json` version.
- `README.md` intro/installation snippets.
- `CHANGELOG.md` latest version.
- `CLI_COMMAND_MATRIX.md`, until replaced or generated.
- `dist/command-contract.json`.
- Generated command docs.
- Generated changelog summaries.
- GitHub repo URL.
- npm package metadata, if fetched during build or manually synchronized.

Recommended generated public outputs:

```text
/llms.txt
/llms-full.txt
/command-contract.json
/changelog.json
/docs/reference/ or /reference/
/sitemap.xml
/robots.txt
```

If the full generated command reference lives in GitBook, `mdkg.dev` should still expose a stable reference landing page that links to GitBook and machine-readable artifacts.

## 8. Static rendering requirements

The site must be fully usable without client-side JavaScript for core content.

Requirements:

- Hero copy appears in server-rendered/static HTML.
- Quickstart appears in static HTML.
- Docs links appear in static HTML.
- Footer links appear in static HTML.
- `llms.txt` is plain text.
- Sitemap and robots are generated at build time.
- Social metadata is present in page head.
- Page titles and descriptions are unique.

React components may be used for:

- Copy-to-clipboard buttons.
- Command tabs for npm/pnpm/bun/npx.
- Demo tabs.
- Lightweight interactive diagrams.
- CTA tracking hooks.

React should not be required to read the site.

## 9. SEO and LLM readability requirements

The site should be optimized for normal search, developer sharing, and AI-agent ingestion.

Requirements:

- Clear page titles.
- Descriptive meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Twitter/X card metadata.
- Sitemap.
- Robots.
- Structured headings.
- Minimal layout-only text images.
- Copyable command snippets.
- Raw Markdown or Markdown-equivalent source for agent-facing pages where practical.
- `llms.txt` with concise docs map.
- `llms-full.txt` or equivalent long-form agent primer.
- Public command contract artifact.

## 10. `llms.txt` design

`/llms.txt` should be concise and stable.

Recommended contents:

- Product one-liner.
- Current package version.
- Public alpha status.
- Install/quickstart links.
- Core concepts links.
- CLI reference link.
- Safety boundaries link.
- Command contract link.
- GitHub/npm/docs links.
- Guidance that agents should prefer `mdkg pack <id>` over ad hoc file lists.

`/llms-full.txt` can include:

- Longer product model.
- Golden agent loop.
- Core command families.
- Read-only vs mutating command distinctions.
- Advanced alpha caveats.
- Safety boundaries.
- Example workflows.

## 11. Version and drift checks

Pre-publish checks should prevent stale public metadata.

Required checks:

- `package.json` version matches latest changelog heading.
- README visible version matches package version or avoids hard-coded version.
- CLI matrix version metadata matches package version or avoids hard-coded version.
- Site displayed version matches package version.
- Generated command contract is fresh.
- Generated CLI reference is fresh.
- Quickstart commands still pass smoke test.
- GitBook source docs are synchronized or marked as pending.

Recommended scripts:

```bash
npm run cli:contract
npm run docs:generate
npm run docs:check-version
npm run docs:check-links
npm run smoke:quickstart
npm run site:build
```

Exact script names can differ. The requirement is that drift checks are automated before publication.

## 12. README parity

The first screen of `README.md` and the hero/quickstart region of `mdkg.dev` should tell the same story.

Parity requirements:

- Same primary positioning.
- Same public alpha terminology.
- Same canonical install command set.
- Same golden first-run path.
- Same safety caveats at the appropriate level.
- Same GitHub/docs links.

The README does not need to duplicate the full homepage. It should route to `mdkg.dev` and docs once the site is live.

## 13. Deployment model

The site should deploy as static output.

Possible deployment targets:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages, if sufficient

Deployment requirements:

- Build command runs from `mdkg-dev/` or repo root workspace script.
- Environment variables are not required for rendering public content.
- Site can be previewed on pull requests.
- Production deploy only from main branch or tagged release process.
- Broken link/version checks should fail CI for production deploys.

## 14. Analytics

Use lightweight analytics if desired, but do not let analytics tooling complicate launch.

Useful events:

- Click install command copy.
- Click GitHub.
- Click npm.
- Click docs.
- Click demo.
- Click ochatr.ai waitlist.
- Click X/LinkedIn.
- Click `llms.txt` or command contract, if measurable.

Analytics should respect developer trust. Avoid invasive tracking.

## 15. Content model

Recommended content types:

- Landing page sections.
- Product feature cards.
- Command snippets.
- CTA link config.
- Demo cards.
- Advanced alpha feature cards.
- Origin story snippet.
- Docs link map.

Astro content collections can be used for structured content if useful. Avoid overbuilding a CMS. The site should be easy to edit in Markdown/MDX and easy for agents to modify safely.

## 16. GitBook integration

Integration options:

1. GitBook sync from `/docs` directory.
2. GitBook docs generated from a separate branch or docs folder.
3. mdkg.dev links to GitBook for all deep docs.
4. Site build generates shared artifacts used by both mdkg.dev and GitBook source.

Recommended approach:

- Keep docs source in the mdkg repo.
- Use GitBook for public docs rendering.
- Use generated docs artifacts from command contract where possible.
- Keep mdkg.dev as the product landing and docs bridge.

## 17. Advanced architecture notes

Because mdkg itself supports subgraphs, bundles, command contracts, and generated artifacts, mdkg.dev can become progressively more dynamic without becoming a web app.

Future capabilities:

- Site sections generated from mdkg graph metadata.
- Demo pages generated from demo graph state.
- Changelog pages generated from changelog + release metadata.
- Command reference generated from `command-contract.json`.
- Agent-readable packs generated for docs examples.
- Public examples generated from nested demo repo state.

These should be future enhancements, not launch blockers.

## 18. Implementation risks

### Risk: site becomes another stale documentation surface

Mitigation: generated artifacts, version checks, README parity checks, and GitBook sync discipline.

### Risk: Astro/GitBook split creates duplicated content

Mitigation: mdkg.dev owns product explanation; GitBook owns docs. Shared copy primitives can live in repo data files.

### Risk: advanced features overwhelm homepage

Mitigation: homepage teaches golden path; advanced alpha features are one-sentence preview cards linking to docs.

### Risk: dogfooding subgraphs slows launch

Mitigation: the dogfooding model is a design goal, not a launch blocker. The first site can live in-repo before fully modeling itself as a polished subgraph.

## 19. Summary

`mdkg.dev` should be a static, owned, crawlable product surface inside the mdkg repo. Astro + React gives control and performance; GitBook gives professional docs speed. Generated command/reference artifacts and pre-publish checks prevent drift. The site should dogfood mdkg over time without allowing dogfooding architecture to block the initial public alpha launch.
