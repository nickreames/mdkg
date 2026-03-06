---
id: task-33
type: task
title: plan init omni flag and llm compatibility
status: done
priority: 1
epic: epic-4
tags: [v0_4, init, cli]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Define the planned v0.4 contract for `mdkg init --omni` while preserving `--llm` compatibility and source-truth documentation.

# Acceptance Criteria

- Planned behavior for `--omni` is documented as target-state, not current behavior.
- Compatibility expectations for `--llm` are explicit.
- Scope for SOUL/HUMAN core-node scaffolding is documented.
- Omni scaffold target requires `.mdkg/skills/` scaffold but does not require a default example skill file.
- Omni scaffold target includes seeded `.mdkg/work/events/events.jsonl` first-event line in valid JSONL format.

# Files Affected

- src/cli.ts
- src/commands/init.ts
- README.md
- .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/design/edd-4-mdkg-init-omni-specification-v0-4.md

# Implementation Notes

- Keep command names for skills/events deferred.
- Keep this task focused on init contract and migration compatibility.
- Keep `core.md` pin semantics ID-only.
- Keep single-writer/batching guidance documented for external orchestrators, not enforced by init runtime behavior.

# Test Plan

Validate with a documentation-oriented checklist and ensure future implementation has concrete CLI acceptance tests (`test-9`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-4
- epic-4
