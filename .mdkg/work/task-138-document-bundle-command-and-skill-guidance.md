---
id: task-138
type: task
title: document bundle command and skill guidance
status: done
priority: 2
epic: epic-22
tags: [bundle, docs, skills]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Document snapshot bundles across public docs, generated init assets, core
rules, and local release/closeout skill guidance.

# Acceptance Criteria

- README and command matrix explain bundle commands, profiles, outputs,
  exclusions, and fail-closed public behavior.
- Generated init docs mention bundle usage without requiring bundle refresh
  during normal `mdkg index`.
- Core CLI and repo-safety rules describe bundle contracts and commit posture.
- Release/closeout skill guidance includes `smoke:bundle` and optional private
  bundle refresh before commits when configured.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `assets/init/README.md`
- `assets/init/AGENT_START.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `.mdkg/README.md`
- `.mdkg/core/rule-3-cli-contract.md`
- `.mdkg/core/rule-4-repo-safety-and-ignores.md`
- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
- `.agents/skills/verify-close-and-checkpoint/SKILL.md`
- `.claude/skills/verify-close-and-checkpoint/SKILL.md`
- `CHANGELOG.md`

# Implementation Notes

- Docs keep mdkg generic and avoid Omni-branded public command language.
- `.mdkg/bundles/` is documented as commit-eligible by policy, not ignored by
  default.
- Public bundle safety is framed as a fail-closed export rule.

# Test Plan

- `npm run cli:check`
- `npm run smoke:matrix`
- `npm publish --dry-run`

# Links / Artifacts

- `README.md`
- `CLI_COMMAND_MATRIX.md`
