---
id: task-440
type: task
title: create mdkg.dev architecture IA demo and agent UX EDDs
status: done
priority: 1
epic: epic-119
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-439]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-21
---
# Overview

Distill architecture notes into canonical EDDs that future implementation can execute without re-reading loose planning docs.

# Acceptance Criteria

- edd-24 through edd-27 exist.
- Architecture, agent UX, demo/template, and IA concerns are separated.
- No /mdkg-dev, /docs, or /examples files are created.

# Files Affected

- .mdkg/design/edd-24-*.md
- .mdkg/design/edd-25-*.md
- .mdkg/design/edd-26-*.md
- .mdkg/design/edd-27-*.md

# Implementation Notes

- Keep design records implementation-ready but non-mutating.
- Use split-source and demo architecture from planning bundle.

# Test Plan

- node dist/cli.js search mdkg.dev architecture --json finds the EDDs after indexing.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-119
- context: mdkg_planning_docs/PRD_mdkg-dev_public_alpha.md
- context: mdkg_planning_docs/PRD_mdkg_public_alpha_polish.md
- context: mdkg_planning_docs/CONTENT_mdkg_positioning_and_origin_story.md
- context: mdkg_planning_docs/EDD_mdkg-dev_static_site_architecture.md
- context: mdkg_planning_docs/EDD_mdkg_cli_agent_ux.md
- context: mdkg_planning_docs/EDD_mdkg_demo_repo_design.md
- context: mdkg_planning_docs/DOCS_mdkg_gitbook_strategy.md
- context: mdkg_planning_docs/UX_mdkg-dev_information_architecture.md
- context: mdkg_planning_docs/STRATEGY_mdkg-dev_conversion_paths.md
