---
id: task-52
type: task
title: plan latest checkpoint hybrid selection and index hint
status: done
priority: 1
epic: epic-5
tags: [v0_4, checkpoint, pack, index]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, edd-2, edd-3, edd-6, edd-8, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [latest_checkpoint_qid, checkpoint-selection]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define 0.0.4 hybrid latest-checkpoint selection behavior for pack planning: pack-time authoritative resolver with optional index hint.

# Acceptance Criteria

- Pack-time latest-checkpoint selection is defined as authoritative behavior.
- Optional index metadata hint (`latest_checkpoint_qid`) is documented as optimization only.
- Deterministic tie-break rules are documented for multiple candidate checkpoints.
- Mismatch behavior is documented: pack-time resolver wins over stale hint.
- This pass does not change runtime pack behavior.

# Files Affected

- src/commands/pack.ts
- src/pack/pack.ts
- src/graph/indexer.ts
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md
- .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-v0-4-episodic-memory-and-provenance.md

# Implementation Notes

- Keep selection semantics deterministic under identical repo state and flags.
- Preserve `chk-*` ID conventions in all examples.

# Test Plan

Validate hybrid selection and hint consistency contracts (`test-21`, `test-22`).

# Links / Artifacts

- prd-1
- dec-10
- edd-2
- edd-3
- edd-6
- edd-8
- epic-5
