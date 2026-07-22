---
id: task-806
type: task
title: correct loop index and test harness guidance contradictions
status: backlog
priority: 2
tags: [audit-followup, harness, docs, agents]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: []
blocks: [test-466]
refs: [loop-7, spike-32, test-461, chk-541, chk-542]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Correct three source-backed guidance contradictions without collapsing
audience-specific startup wrappers into exact mirrors.

# Acceptance Criteria

- Root and public active-loop quickstarts include
  `mdkg loop next <loop-id> --json` between readiness planning and execution.
- `CONTRIBUTING.md` distinguishes ignored compatibility/cache byproducts from
  the intentionally tracked `.mdkg/index/mdkg.sqlite` repository state and
  prohibits unsafe blanket cleanup.
- `tests/README.md` replaces “CLI tests are deferred” with the current command,
  core, graph, pack, util, and root-MJS family/execution map.
- Startup guidance continues to delegate detailed loop behavior to the
  canonical `pursue-mdkg-loop` skill and does not broaden authority.
- Focused checks fail if these three contracts drift again.

# Files Affected

- `AGENT_START.md`
- `assets/init/AGENT_START.md`
- `CONTRIBUTING.md`
- `tests/README.md`
- focused startup/publish guidance checks

# Implementation Notes

- Root/public wrappers have different audiences; compare required semantics,
  not whole-file hashes.
- Keep `--pack-profile concise`, which current CLI execution proved valid.
- Do not change SQLite index behavior in this documentation task.

# Test Plan

- Run focused required-snippet/semantic tests, initialize a disposable agent
  fixture, verify tracked/ignored index paths with Git, run docs/CLI checks,
  graph validation, and `git diff --check`.

# Links / Artifacts

- `root:loop-7`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/harness-guidance-map.md`
