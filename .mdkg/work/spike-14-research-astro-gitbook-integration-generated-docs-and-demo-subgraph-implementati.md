---
tags: [mdkg-dev, research, spike]
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
id: spike-14
type: spike
title: research Astro GitBook integration generated docs and demo subgraph implementation risks
status: todo
priority: 1
parent: goal-25
epic: epic-122
---
# Research Question

What implementation architecture should Goal 2 use to build the site, docs source, generated docs pipeline, and demo/template graphs with the least drift and strongest launch safety?

# Context And Constraints

- The source bundle is committed and private archive evidence is available.
- This spike records research and planning only; it does not implement website or docs files.
- Future execution must avoid over-claiming deferred mdkg capabilities.

# Search Plan

- Read all planning source files and prior mdkg.dev nodes.
- Map each source to PRD, EDD, DEC, task, test, or future spike outputs.
- Check older external-docs-only nodes for supersession needs.

# Findings

- Research pending future activation.
- Goal 2 should confirm tooling details before scaffolding any subproject.

# Options And Tradeoffs

- External-only docs repo keeps CLI repo small but disconnects docs from command contract and graph.
- Monolithic site/docs directory is simple but mixes docs, site, generated references, and demos.
- Split in-repo layout has more surfaces but gives clean ownership and better dogfood for subgraphs.

# Recommendation

Use the split in-repo layout and seed a paused implementation goal after source evidence is archived.

# Follow-Up Nodes To Create

- Canonical PRDs, EDDs, and DEC.
- Paused Goal 2 implementation roadmap.
- Future skill candidate for docs launch workflows.

# Skill Candidates

- Future mdkg-dev launch skill for generated docs, no-secret checks, and public-alpha closeout.

# Data Structures And Algorithms Notes

- Treat generated command docs and subgraph bundles as derived artifacts with drift checks.
- Keep demo template graph IDs stable across separate repos and rewrite only on same-repo imports.

# UX Notes

- Public docs should guide one concrete outcome at a time: install, initialize, pick a goal, inspect a pack, run validation, and close with evidence.
- Demo pages should make the agent-start story inspectable without implying unsupported autonomous execution.

# Security Notes

- Public docs and demos must not include raw secrets, tokens, provider payloads, private graph dumps, or raw prompts.
- The site must state deferred surfaces clearly.

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
