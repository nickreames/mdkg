---
id: task-352
type: task
title: document npm token userconfig publish flow
status: done
priority: 1
epic: epic-69
tags: [release, npm, auth, skill]
owners: []
links: []
artifacts: []
relates: [goal-14]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Document the verified npm publish auth path so future releases do not silently
skip exported `NPM_TOKEN` and fail at registry PUT after the full publish gate.

# Acceptance Criteria

- `verify-close-and-checkpoint` explains how to create a temporary npm
  userconfig that references `${NPM_TOKEN}` without printing the token.
- Release rules/docs require `npm whoami --userconfig=...` before real publish.
- Publish guidance avoids `always-auth` because npm warns that it is unsupported.
- Skill mirrors are synced after the canonical skill update.
- `test-145` records the checklist contract.

# Files Affected

- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
- `.agents/skills/verify-close-and-checkpoint/SKILL.md`
- `.mdkg/core/rule-5-release-and-versioning.md`

# Implementation Notes

- Use a literal `${NPM_TOKEN}` placeholder in the temp npmrc file; do not write
  the actual token in docs examples.
- This task changes release procedure docs only. It does not publish.

# Test Plan

- `mdkg skill validate verify-close-and-checkpoint`
- `mdkg skill sync`
- `mdkg validate --json`
- `rg -n "NPM_TOKEN|userconfig|npm whoami" .mdkg/skills .agents/skills .mdkg/core`

# Links / Artifacts

- `test-145`
- `goal-14`

# Evidence

- Updated canonical and mirrored `verify-close-and-checkpoint` skill guidance
  with temporary npm userconfig, `NPM_TOKEN`, and `npm whoami` checks.
- Updated release rule publish checklist with the same auth boundary.
- Verified with `mdkg skill validate verify-close-and-checkpoint`,
  `mdkg skill sync`, `npm run cli:check`, `npm run smoke:init`, and
  `mdkg validate --json`.
