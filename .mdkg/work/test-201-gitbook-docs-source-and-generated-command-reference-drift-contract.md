---
id: test-201
type: test
title: GitBook docs source and generated command-reference drift contract
status: done
priority: 1
epic: epic-123
parent: goal-25
tags: [mdkg-dev, contract, gitbook, command-docs]
owners: []
links: []
artifacts: []
relates: [task-447, task-448]
blocked_by: [task-448]
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [edd-24, edd-27]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate repo-first docs source and generated command-reference drift protection.

# Acceptance Criteria

- `/docs` contains GitBook-ready source, navigation, quickstart, safety, alpha, concept, guide, reference, and advanced-alpha entrypoints.
- Existing `/docs` files are preserved, migrated deliberately, or linked from the new docs index.
- GitBook ownership policy exists and does not claim the hosted domain is live unless configured later.
- Generated command docs are derived from the command contract.
- Drift checks fail when generated command reference output is stale.
- Core launch commands and advanced alpha commands are separated in docs.

# Test Plan

- `npm run cli:contract`
- `npm run smoke:command-docs`
- `npm run smoke:mdkg-dev-docs`
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-123
