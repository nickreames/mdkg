---
tags: [mdkg-dev, research, spike]
owners: []
links: []
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
id: spike-14
type: spike
title: research Astro GitBook integration generated docs and demo subgraph implementation risks
status: todo
priority: 1
parent: goal-25
epic: epic-122
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

Pending future activation.

# Options And Tradeoffs

- External-only docs repo keeps CLI repo small but disconnects docs from command contract and graph.
- Monolithic site/docs directory is simple but mixes docs, site, generated references, and demos.
- Split in-repo layout has more surfaces but gives clean ownership and better dogfood for subgraphs.
- Full launch implementation in one pass is useful, but it must stop at pre-release readiness unless the user separately requests deploy or production launch.

# Recommendation

Use the split in-repo layout. Before scaffolding, record a checkpoint that locks tooling, install command truth, docs preservation, generated docs approach, and launch boundaries.

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

# UX Notes

- Public docs should guide one concrete outcome at a time: install, initialize, pick a goal, inspect a pack, run validation, and close with evidence.
- Demo pages should make the agent-start story inspectable without implying unsupported autonomous execution.
- The first viewport should show product value and at least one CLI command.

# Security Notes

- Public docs and demos must not include raw secrets, tokens, provider payloads, private graph dumps, local absolute paths, or raw prompts.
- The site must state deferred surfaces clearly.
- Handoff warnings and no-secret scans are safety aids, not comprehensive data-loss prevention.

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
