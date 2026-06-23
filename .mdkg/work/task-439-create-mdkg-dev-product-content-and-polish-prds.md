---
id: task-439
type: task
title: create mdkg.dev product content and polish PRDs
status: done
priority: 1
epic: epic-119
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-438]
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

Distill product, content, positioning, origin-story, and polish planning into canonical PRDs.

# Acceptance Criteria

- prd-4 captures public-alpha positioning and origin story.
- prd-5 captures prelaunch polish and public-alpha requirements.
- Both PRDs link to archive and source paths.

# Files Affected

- .mdkg/design/prd-4-*.md
- .mdkg/design/prd-5-*.md

# Implementation Notes

- Separate product positioning from polish/prelaunch requirements.
- Do not write public website copy yet.

# Test Plan

- node dist/cli.js show prd-4 --json and prd-5 resolve after index.

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
