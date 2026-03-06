---
id: task-45
type: task
title: plan llms txt agent prompt snippet and example pack docs
status: todo
priority: 1
epic: epic-4
tags: [v0_4, mdkg-dev, llm, docs]
owners: []
links: []
artifacts: []
relates: [prd-2, dec-8, dec-9, edd-2, edd-3, edd-4, edd-5, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-04
updated: 2026-03-04
---

# Overview

Define the v0.4 contract for LLM-readable artifacts: `llms.txt`, agent prompt snippet, and sample pack examples.

# Acceptance Criteria

- `llms.txt` content contract is specified (docs index, core CLI list, directory structure, schema summary, pack flow, skills flow).
- Agent prompt snippet contract is specified and aligned with deterministic pack-first guidance.
- Example pack coverage is specified for task, edd, and skills-included shapes.
- All examples are labeled target-state where runtime capabilities are not yet implemented.

# Files Affected

- .mdkg/design/prd-2-mdkg-dev-website-and-documentation-plan-v0-4.md
- README.md
- src/cli.ts
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md
- .mdkg/design/edd-4-mdkg-init-omni-specification-v0-4.md
- .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md

# Implementation Notes

- Keep exact skills/events command naming deferred; example commands are non-normative.
- Keep guidance anchored to current CLI help output for implemented commands.

# Test Plan

Validate artifact contracts and source-truth boundaries (`test-16`, `test-15`).

# Links / Artifacts

- prd-2
- dec-8
- dec-9
- edd-2
- edd-3
- edd-4
- edd-5
- epic-4
