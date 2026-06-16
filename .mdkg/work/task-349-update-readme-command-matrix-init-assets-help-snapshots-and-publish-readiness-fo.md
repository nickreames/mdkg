---
id: task-349
type: task
title: update README command matrix init assets help snapshots and publish readiness for spikes
status: done
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, docs, command-matrix, publish-readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: [test-144]
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Update user-facing docs, init assets, command matrix entries, help snapshots,
and publish-readiness checks so the new `spike` type is discoverable and cannot
drift from CLI behavior.

# Acceptance Criteria

- README and init README explain spikes as research/planning work nodes.
- `CLI_COMMAND_MATRIX.md` and init command matrix list `mdkg new spike` through
  the existing `new` and work lifecycle surfaces.
- Help snapshots, generated command contract, and generated command docs remain
  current.
- Publish-readiness assertions require the spike template, docs mention, and
  smoke script wiring.
- Docs explicitly state that spikes do not perform web search, execute research,
  create follow-up nodes, or generate `SKILL.md` automatically.
- User examples show a spike leading to intentional follow-up task/test and skill
  candidate notes.

# Files Affected

- README/init docs and command matrix.
- CLI help snapshots, command contract generation outputs, and command-doc smoke.
- Publish-readiness scripts and init asset assertions.

# Implementation Notes

- Keep docs explicit that spikes do not execute web search or create files
  automatically.
- Tie spike guidance to mdkg.dev launch readiness without starting website work.
- Keep examples executable in fresh temp repos.

# Test Plan

- `npm run cli:check`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- `node scripts/assert-publish-ready.js`
- `npm run smoke:spike`

# Links / Artifacts

- `task-348`
- `test-144`
