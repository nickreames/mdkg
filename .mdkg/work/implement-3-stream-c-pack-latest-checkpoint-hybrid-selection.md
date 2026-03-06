---
id: implement-3
type: task
title: implement stream c pack latest checkpoint hybrid selection
status: done
priority: 1
epic: epic-5
tags: [v0_4, implementation, pack, checkpoint, determinism]
owners: []
links: []
artifacts: [cmd:npm_run_build_ok_2026_03_05, cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [dec-10, edd-6, edd-8, task-52, test-21, test-22, epic-5]
blocked_by: [implement-2]
blocks: [test-21, test-22]
refs: []
aliases: [stream-c, latest_checkpoint_qid]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Implement Stream C hybrid latest-checkpoint behavior with a pack-time authoritative resolver and optional index hinting.

# Acceptance Criteria

- Pack-time resolver deterministically selects the latest checkpoint.
- Optional `latest_checkpoint_qid` hint is emitted as optimization metadata only.
- Resolver output always wins over stale or mismatched hints.
- Checkpoint selection behavior is deterministic across repeated runs.

# Files Affected

- src/pack/pack.ts
- src/commands/pack.ts
- src/graph/indexer.ts
- src/graph/index_cache.ts
- tests/

# Implementation Notes

- Keep checkpoint ids as `chk-*`.
- Preserve current pack behavior for non-checkpoint flows.

# Test Plan

- Run `npm run build`.
- Run `npm run test`.
- Run `mdkg validate`.
- Validate behavior against `test-21` and `test-22`.

# Links / Artifacts

- dec-10
- edd-6
- edd-8
- test-21
- test-22
- cmd:npm_run_build_ok_2026_03_05
- cmd:npm_run_test_ok_2026_03_05
- cmd:node_dist_cli_validate_ok_2026_03_05
