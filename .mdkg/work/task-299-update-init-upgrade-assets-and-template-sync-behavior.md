---
id: task-299
type: task
title: update init upgrade assets and template sync behavior
status: done
priority: 2
epic: epic-60
parent: goal-9
prev: task-298
next: task-300
tags: [init, upgrade, templates, assets]
owners: []
links: []
artifacts: [.mdkg/templates, scripts/copy-init-assets.js, checks://git-diff-check]
relates: [goal-9, epic-60, test-116]
blocked_by: [task-298]
blocks: [task-300]
refs: [edd-15]
aliases: [0-3-0-init-upgrade-assets]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Ensure init and upgrade flows carry the 0.3.0 templates without forcing SPEC
adoption in every repo.

# Acceptance Criteria

- Init assets include valid optional SPEC and work templates.
- Upgrade dry-run preserves local customizations and reports template changes.
- Repos without SPEC files remain valid after upgrade.

# Files Affected

- `.mdkg/templates`
- init assets
- upgrade assets

# Implementation Notes

- Upgrade dry-runs should report changes without clobbering local templates.

# Test Plan

- `npm run smoke:init`
- `npm run smoke:upgrade`
- `node dist/cli.js upgrade --dry-run --json`

# Links / Artifacts

- `test-116`
