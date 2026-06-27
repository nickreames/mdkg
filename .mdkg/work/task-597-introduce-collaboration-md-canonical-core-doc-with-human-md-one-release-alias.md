---
id: task-597
type: task
title: introduce COLLABORATION.md canonical core doc with HUMAN.md one release alias
status: todo
priority: 1
epic: epic-200
parent: goal-41
tags: [0.3.9, collaboration, core-docs, compatibility]
owners: []
links: []
artifacts: [AGENT_START.md, .mdkg/core/HUMAN.md, assets/init/core]
relates: []
blocked_by: [task-594]
blocks: [test-304, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Introduce `COLLABORATION.md` as the canonical core collaboration profile while
keeping `HUMAN.md` as a one-release compatibility alias.

# Acceptance Criteria

- New agent init/upgrade flows prefer `COLLABORATION.md`.
- Existing `HUMAN.md` customizations are preserved and treated as legacy alias
  content for one release.
- AGENT_START and first-party skills point agents at `COLLABORATION.md` first.
- The transition is aligned with the accepted MANIFEST/SPEC bridge policy.

# Files Affected

- core docs and init assets
- upgrade behavior
- docs/help/skills that reference the collaboration profile

# Implementation Notes

- Do not delete `HUMAN.md` in `0.3.9`.
- A later follow-up goal should fade out both `HUMAN.md` and `SPEC.md` legacy
  aliases after the compatibility window.

# Test Plan

- Fresh init creates/uses the canonical collaboration doc.
- Upgrade fixture with legacy `HUMAN.md` preserves local content.
- `test-304`

# Links / Artifacts

- `dec-53`
- `dec-50`
