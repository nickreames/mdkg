---
id: task-438
type: task
title: archive mdkg.dev planning bundle as source evidence
status: done
priority: 1
epic: epic-118
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-437]
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

Add the committed planning bundle to mdkg archive sidecars so every distilled node has a durable source-evidence URI.

# Acceptance Criteria

- Archive sidecar exists for archive.mdkg-dev-planning-docs-2026-06-22.
- Archive verification passes.
- Archive URI is used as evidence on distilled nodes.

# Files Affected

- .mdkg/archive/archive.mdkg-dev-planning-docs-2026-06-22/**

# Implementation Notes

- Use mdkg archive add and mdkg archive verify.
- Keep archive visibility private.

# Test Plan

- node dist/cli.js archive verify archive://archive.mdkg-dev-planning-docs-2026-06-22 --json passes.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-118
- context: mdkg_planning_docs/PRD_mdkg-dev_public_alpha.md
- context: mdkg_planning_docs/PRD_mdkg_public_alpha_polish.md
- context: mdkg_planning_docs/CONTENT_mdkg_positioning_and_origin_story.md
- context: mdkg_planning_docs/EDD_mdkg-dev_static_site_architecture.md
- context: mdkg_planning_docs/EDD_mdkg_cli_agent_ux.md
- context: mdkg_planning_docs/EDD_mdkg_demo_repo_design.md
- context: mdkg_planning_docs/DOCS_mdkg_gitbook_strategy.md
- context: mdkg_planning_docs/UX_mdkg-dev_information_architecture.md
- context: mdkg_planning_docs/STRATEGY_mdkg-dev_conversion_paths.md
