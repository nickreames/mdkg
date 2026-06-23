---
id: spike-14
type: spike
title: research Astro GitBook integration generated docs and demo subgraph implementation risks
status: done
priority: 1
epic: epic-122
parent: goal-25
tags: [mdkg-dev, research, spike]
owners: []
links: [https://docs.astro.build/en/guides/on-demand-rendering/, https://docs.astro.build/en/guides/framework-components/, https://docs.astro.build/en/guides/integrations-guide/react/, https://docs.astro.build/en/guides/deploy/vercel/, https://gitbook.com/docs/getting-started/git-sync, https://gitbook.com/docs/publishing-documentation/llm-ready-docs, https://vercel.com/docs/analytics, https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data, https://web.dev/articles/vitals]
artifacts: []
relates: [task-445]
blocked_by: []
blocks: [task-445]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-25, edd-26, edd-27, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Research Question

What implementation architecture should goal-25 use to build mdkg.dev, docs source, generated command docs, and demo/template graphs with the least drift and strongest launch safety?

# Context And Constraints

- The source bundle is committed and private archive evidence is available.
- Run only after goal-25 is explicitly activated.
- Record implementation research and decisions before scaffolding any website, docs, or example files.
- Avoid over-claiming deferred mdkg capabilities.
- Real deploy, DNS, Vercel production promotion, GitBook production config, analytics activation, npm publish, tag, and push remain out of scope.

# Search Plan

- Re-read the archived planning bundle and canonical PRD/EDD/DEC nodes.
- Verify package manager, workspace assumptions, root npm scripts, and existing `/docs` contents.
- Verify exact GitHub and npm URLs from package metadata or authoritative sources.
- Verify install commands before publishing them: `npm install -g mdkg`, `npx mdkg --help`, and any pnpm/bun examples included.
- Re-check current official Astro, GitBook, Vercel, Google Search, and Web Vitals docs before implementation.
- Identify which launch checks can be automated locally and which must remain documented manual launch steps.

# Findings

- Current repo state:
  - `package.json` is `mdkg@0.3.7` with npm scripts for CLI build/test/smokes, but no `mdkg-dev`, docs-generation, site-build, or demo-graph scripts yet.
  - `mdkg-dev/` and `examples/` do not exist yet.
  - `docs/` exists and currently contains historical handoff documents, so task-447 must preserve or explicitly relocate existing docs rather than replacing the directory.
  - `.npmignore` excludes `.mdkg/` and node/cache surfaces but does not yet exclude future `mdkg-dev/`, `docs/`, or `examples/` sources from the npm package.
  - Local runtime used for this spike: Node `v26.0.0`, npm `11.12.1`.
- Package/source truth:
  - Local and registry package metadata agree on package name `mdkg`, binary `dist/cli.js`, repo `git+ssh://git@github.com/nickreames/mdkg.git`, engine `node >=24.15.0`, and latest registry version `0.3.7`.
  - Public docs should show `npm install -g mdkg` as the primary install path and verify one-off commands in a later smoke before launch copy is finalized.
- Astro:
  - Official Astro docs state that pages, routes, and API endpoints are prerendered at build time by default, and advise starting with default `static` mode until server rendering is needed.
  - React/framework components can be used inside Astro and render as static HTML by default; client-side JavaScript is only sent when explicit `client:*` hydration directives are used.
  - The React integration can be added with `astro add react` or configured manually with `@astrojs/react`, `react`, and `react-dom`.
  - Vercel can deploy Astro as a static site or server-rendered site; Goal 25 should keep static output and only document Vercel readiness.
- GitBook:
  - GitBook has GitHub/GitLab Sync for docs-as-code workflows and describes it as bi-directional. mdkg policy should still be repo-first: GitBook edits must be synchronized back through Git review instead of becoming canonical state.
  - GitBook exposes Markdown pages, `llms.txt`, `llms-full.txt`, and a docs MCP endpoint for published spaces. The repo implementation should still generate or author mdkg.dev's own `llms.txt` and keep GitBook production publishing/manual configuration out of scope.
- SEO, analytics, and quality:
  - Google recommends JSON-LD for structured data when the setup allows it; use structured data only where it matches visible content.
  - Web Vitals targets in the design node are current: LCP at or under 2.5 seconds, INP at or under 200 ms, and CLS at or under 0.1.
  - Vercel Web Analytics is a plausible later launch option, but analytics activation remains out of scope for this goal.
- Launch boundary:
  - Goal 25 should produce local pre-release readiness: buildable site, GitBook-ready docs source, generated reference artifacts, example graphs, subgraph registration, and smokes.
  - Goal 25 must not deploy, promote previews, configure DNS, enable analytics, publish npm, tag, push, or publicly launch.

# Options And Tradeoffs

- External-only docs repo keeps CLI repo small but disconnects docs from command contract and graph.
- Monolithic site/docs directory is simple but mixes docs, site, generated references, and demos.
- Split in-repo layout has more surfaces but gives clean ownership and better dogfood for subgraphs.
- Full launch implementation in one pass is useful, but it must stop at pre-release readiness unless the user separately requests deploy or production launch.
- Nested npm workspace integration would centralize root scripts, but it risks pulling site dependencies into the CLI package install path if package boundaries are not explicit.
- A standalone `mdkg-dev/package.json` keeps site dependencies isolated and is the safer first implementation; root scripts can delegate into it.

# Recommendation

Use the split in-repo layout from dec-30:

- `/mdkg-dev`: standalone Astro static site package with isolated dependencies and static-first output.
- `/docs`: repo-owned GitBook documentation source, preserving current `docs/` files or moving them deliberately into a legacy/reference location during task-447.
- `/examples`: nested demo/template graphs only after their local `.mdkg` graphs validate.
- Root package scripts should delegate to the site/docs/demo scripts but keep the npm package `files` allowlist focused on CLI distribution artifacts.
- Generated command reference docs should come from `dist/command-contract.json` and/or the existing `scripts/generate-command-contract.js` output, not hand-maintained command duplication.
- Add local smokes for site build/static route inventory, GitBook docs inventory, SEO/metadata/no-secret checks, and demo graph validation before closeout.
- Record a boundary/tooling checkpoint after task-445 that says exactly what was verified and which public launch actions remain manual.

# Follow-Up Nodes To Create

No new implementation nodes are required before starting goal-25; use the existing scoped nodes below.

# Follow-Up Nodes To Execute

- task-445: implementation boundary and package/workspace tooling.
- task-446: static site and visual design.
- task-447: GitBook docs source.
- task-448: generated command docs.
- task-449: public alpha content, claims, trust, and LLM docs.

# Skill Candidates

- Future mdkg-dev launch skill for generated docs, no-secret checks, claim evidence, metadata checks, and public-alpha closeout.

# Data Structures And Algorithms Notes

- Treat generated command docs and subgraph bundles as derived artifacts with drift checks.
- Keep demo template graph IDs stable across separate repos and rewrite only on same-repo imports.
- Keep mdkg graph nodes as planning truth, not a raw public content dump.
- Keep site route/content inventories as bounded JSON receipts so future smokes can compare expected pages, docs, examples, metadata, and no-secret scan results.
- Keep generated docs deterministic: sort command families, flags, examples, output formats, and safety labels so docs drift checks are stable.
- Use root-qualified qids for future subgraph registration; nested graph mutations belong in the owning nested repo.

# UX Notes

- Public docs should guide one concrete outcome at a time: install, initialize, pick a goal, inspect a pack, run validation, and close with evidence.
- Demo pages should make the agent-start story inspectable without implying unsupported autonomous execution.
- The first viewport should show product value and at least one CLI command.
- Homepage and README top sections should share the same product promise, public-alpha caveats, install command, Node requirement, and golden first-run path.
- The docs IA should separate "Start here", "Concepts", "Guides", "Advanced alpha", "Reference", and "Project" so queues/MCP/subgraphs do not dominate first-run learning.
- `llms.txt` should be concise and source-backed; `llms-full.txt` can be longer but must not dump private graph content.

# Security Notes

- Public docs and demos must not include raw secrets, tokens, provider payloads, private graph dumps, local absolute paths, or raw prompts.
- The site must state deferred surfaces clearly.
- Handoff warnings and no-secret scans are safety aids, not comprehensive data-loss prevention.
- Preview deployments, GitBook production settings, analytics activation, and DNS are manual launch actions after this goal.
- Structured data and SEO metadata must reflect visible content and shipped capabilities, not roadmap-only features.

# Evidence And Sources

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- mdkg_planning_docs/PRD_mdkg-dev_public_alpha.md
- mdkg_planning_docs/PRD_mdkg_public_alpha_polish.md
- mdkg_planning_docs/CONTENT_mdkg_positioning_and_origin_story.md
- mdkg_planning_docs/EDD_mdkg-dev_static_site_architecture.md
- mdkg_planning_docs/EDD_mdkg_cli_agent_ux.md
- mdkg_planning_docs/EDD_mdkg_demo_repo_design.md
- mdkg_planning_docs/DOCS_mdkg_gitbook_strategy.md
- mdkg_planning_docs/UX_mdkg-dev_information_architecture.md
- mdkg_planning_docs/STRATEGY_mdkg-dev_conversion_paths.md
- package.json
- .npmignore
- git remote -v
- node --version
- npm --version
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm view mdkg version name repository.url bin engines dist-tags --json --prefer-online
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/guides/framework-components/
- https://docs.astro.build/en/guides/integrations-guide/react/
- https://docs.astro.build/en/guides/deploy/vercel/
- https://gitbook.com/docs/getting-started/git-sync
- https://gitbook.com/docs/publishing-documentation/llm-ready-docs
- https://vercel.com/docs/analytics
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://web.dev/articles/vitals
