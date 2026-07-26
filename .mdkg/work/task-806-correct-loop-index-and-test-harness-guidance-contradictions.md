---
id: task-806
type: task
title: correct loop index and test harness guidance contradictions
status: backlog
priority: 3
parent: goal-78
prev: test-465
next: test-466
tags: [audit-followup, harness, docs, agents]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: [test-465]
blocks: [test-466]
refs: [goal-78, loop-7, spike-32, test-461, chk-541, chk-542, chk-544, dec-89, task-805, test-465]
context_refs: [goal-78, loop-7, chk-544, dec-89, task-805, test-465]
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop, verify-close-and-checkpoint]
created: 2026-07-17
updated: 2026-07-26
---
# Overview

Correct three source-backed guidance contradictions without collapsing
audience-specific startup wrappers into exact mirrors.

# Acceptance Criteria

- Root and public active-loop quickstarts include
  `mdkg loop next <loop-id> --json` in this semantic order:
  `loop show`, `skill show pursue-mdkg-loop`, `loop plan`, `loop next`,
  concise pack, answer/gate work, execute authorized lanes.
- `CONTRIBUTING.md` distinguishes ignored compatibility/cache byproducts from
  the intentionally tracked `.mdkg/index/mdkg.sqlite` repository state and
  prohibits unsafe blanket deletion, reset, or restoration.
- `tests/README.md` replaces “CLI tests are deferred” with the current command,
  core, graph, pack, util, and root-MJS family/execution map without freezing
  transient test counts.
- Startup guidance continues to delegate detailed loop behavior to the
  canonical `pursue-mdkg-loop` skill and does not broaden authority.
- Root and public wrappers remain audience-specific; tests compare semantics,
  not whole-file equality.
- Focused checks fail independently if any of the three contracts drifts.

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
- Explain that initialized consumer repos may use a different index tracking
  policy and contributors must inspect `git ls-files` plus `.gitignore` before
  cleanup.

# Test Plan

- Parse root, public source, built public source, and a disposable initialized
  fixture for ordered loop semantics.
- Verify tracked/ignored index paths with Git.
- Derive current first-level TypeScript families and root MJS paths and compare
  them with documented commands.
- Run docs/CLI checks, graph validation, and `git diff --check`.
- Do not run `ci:release` or `prepublishOnly`; this lane uses focused semantic
  checks and shares the one Goal 78 closeout ladder.

# Links / Artifacts

- `root:loop-7`
- `root:goal-78`
- `root:test-465`
- `root:dec-89`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/harness-guidance-map.md`
