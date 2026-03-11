---
id: task-50
type: task
title: plan skills query tag filter and stage gating contract
status: done
priority: 1
epic: epic-5
tags: [v0_4, skills, query, stage_gating]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, edd-2, edd-5, edd-7, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [stage:plan, tags-mode]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define deterministic query contracts for tag-filtered skill discovery in 0.0.4 planning.

# Acceptance Criteria

- Planned skills query surface remains under existing command families (`list`, `show`, `search`).
- Tag filtering contract is documented for skills (`--tags <tag,tag,...>`).
- Tag matching mode contract is documented (`--tags-mode any|all`).
- Stage tag examples are documented (`stage:plan`, `stage:execute`, `stage:review`).
- Query contracts remain clearly marked as planned (not implemented).

# Files Affected

- src/commands/list.ts
- src/commands/search.ts
- src/commands/show.ts
- src/util/filter.ts
- src/cli.ts
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md

# Implementation Notes

- Keep command naming deterministic and compatible with existing command families.
- Keep stage gating vocabulary policy-driven, not hardcoded allowlist in 0.0.4.

# Test Plan

Validate query and stage-tag contracts through planning tests (`test-20`).

# Links / Artifacts

- prd-1
- dec-10
- edd-2
- edd-5
- edd-7
- epic-5
