---
id: task-133
type: task
title: update skills for archive compression and snapshot bundles
status: todo
priority: 2
epic: epic-22
tags: [skills, compression, snapshot-bundle, archive, commit-cadence]
owners: []
links: []
artifacts: [.mdkg/skills/verify-close-and-checkpoint/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md]
relates: [epic-22, epic-24, epic-27]
blocked_by: [epic-22, epic-24]
blocks: []
refs: [rule-4, edd-3, edd-8]
aliases: [snapshot-skills-update]
skills: []
created: 2026-05-17
updated: 2026-05-17
---

# Overview

Plan updates to internal mdkg skills so configured commit and closeout workflows
refresh archive compression and full `.mdkg` graph snapshot bundles before
commit.

# Acceptance Criteria

- Commit-cadence guidance includes configured archive compression before durable
  commit boundaries.
- Closeout guidance includes configured full `.mdkg` snapshot bundle refresh.
- Skills distinguish private-local tracked bundles from public/export-safe
  bundles.
- Skills continue to preserve one durable writer per run and avoid commit spam.

# Files Affected

- `.mdkg/skills/verify-close-and-checkpoint/SKILL.md`
- `.mdkg/skills/build-pack-and-execute-task/SKILL.md`
- `assets/init/skills/default/*`

# Implementation Notes

- This task is planning for a later skill update pass, not an immediate skill
  edit.
- Official npm docs should stay generic and not mention Omni.
- Bundle refresh should be conditional on repo config once bundle commands
  exist.

# Test Plan

- Later implementation should run `mdkg skill validate`.
- Later implementation should run `mdkg skill sync`.
- Later implementation should validate generated skill mirrors.

# Links / Artifacts

- `epic-22`
- `epic-24`
- `epic-27`
