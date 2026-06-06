---
id: task-252
type: task
title: document source projection doctrine
status: done
priority: 1
epic: epic-39
parent: goal-6
tags: [projection, doctrine, spec, skill]
owners: []
links: []
artifacts: [.mdkg/design/dec-21-mdkg-spec-skill-source-of-truth-and-projection-doctrine.md, .mdkg/design/dec-22-codex-agents-as-projection-not-durable-capability-state.md, .mdkg/design/edd-14-spec-skill-template-taxonomy-and-codex-projection-architecture.md]
relates: [goal-6, epic-39, test-88]
blocked_by: []
blocks: [task-253, task-254]
refs: [dec-21, dec-22, edd-14]
aliases: [source-projection-doctrine-task]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Document mdkg/SPEC/SKILL as source and `.codex/agents` as projection.

# Acceptance Criteria

- Source/projection hierarchy is recorded.
- Projection-only Codex doctrine is recorded.

# Files Affected

- `.mdkg/design/dec-21-*.md`
- `.mdkg/design/dec-22-*.md`
- `.mdkg/design/edd-14-*.md`

# Implementation Notes

- Keep design nodes out of direct goal traversal.

# Test Plan

- `mdkg capability search "Codex projection" --json`

# Closeout Evidence

- `dec-21`, `dec-22`, and `edd-14` were added.

# Links / Artifacts

- `dec-21`
- `dec-22`
- `edd-14`
