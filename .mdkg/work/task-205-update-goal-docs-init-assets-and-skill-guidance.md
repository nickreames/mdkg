---
id: task-205
type: task
title: update goal docs init assets and skill guidance
status: done
priority: 1
epic: epic-36
prev: task-204
next: task-206
tags: [goal, docs, init, skills]
owners: []
links: []
artifacts: []
relates: [epic-36, prd-3, edd-10, task-204]
blocked_by: []
blocks: [task-206]
refs: [rule-3, rule-4, rule-6]
aliases: [goal-docs]
skills: []
created: 2026-05-31
updated: 2026-05-31
---

# Overview

Document goal UX and agent harness usage across public docs, generated init
assets, command references, changelog, and skill guidance.

# Acceptance Criteria

- README, `CLI_COMMAND_MATRIX.md`, `AGENT_START.md`, and seeded init docs
  describe `goal` nodes and the future-safe harness loop.
- Changelog records the `0.1.5` unreleased goal-node work.
- Help snapshots and command parity checks include `mdkg goal` if implemented.
- Skill guidance records improvement candidates during normal goal execution
  and only edits skills during explicit skill-maintenance work.
- Public docs clearly state required checks are report-only in this release.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `CHANGELOG.md`
- seeded init docs and default skills

# Implementation Notes

- Keep public docs generic; do not make goal support Codex- or Claude-only.
- Keep the 4,000-character external goal condition limit as compatibility
  guidance, not as a hard mdkg body limit.

# Test Plan

- `npm run cli:check`
- Docs grep for `goal`, `mdkg goal`, and `required_checks`.
- Fresh init smoke proves seeded docs mention goal behavior when appropriate.

# Verification Evidence

- Updated `README.md`, `CLI_COMMAND_MATRIX.md`, `AGENT_START.md`,
  seeded init docs, `CHANGELOG.md`, and core CLI/template rules.
- Public docs state `mdkg goal evaluate` is report-only and does not run
  `required_checks`.
- Seeded startup guidance records skill-improvement candidates during normal
  goal execution and reserves `SKILL.md` edits for explicit skill-maintenance
  work.
- `npm run cli:check`, `npm run smoke:init`, and `npm run smoke:matrix`
  passed.

# Links / Artifacts

- `prd-3`
- `edd-10`
- `task-204`
