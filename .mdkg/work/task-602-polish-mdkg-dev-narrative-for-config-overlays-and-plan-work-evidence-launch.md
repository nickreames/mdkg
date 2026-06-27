---
id: task-602
type: task
title: polish mdkg.dev narrative for config overlays and plan work evidence launch
status: todo
priority: 2
epic: epic-203
parent: goal-42
tags: [0.4.0, mdkg-dev, narrative, launch]
owners: []
links: []
artifacts: [mdkg-dev, CHANGELOG.md]
relates: []
blocked_by: [spike-22]
blocks: [task-605, task-606]
refs: [spike-22]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Polish mdkg.dev copy and structure so the public launch narrative reflects the
new customization model and the established Plan -> Work -> Evidence framing.

# Acceptance Criteria

- mdkg.dev presents config overlays as the primary enterprise customization
  path.
- Forkable starters are not positioned as the default path.
- Copy covers custom skill mirrors, upgradable kernel behavior, and
  collaboration-profile naming only after `goal-41` facts are stable.
- Claims stay source-backed and low-hype.

# Files Affected

- `mdkg-dev/`
- changelog/release note inputs as needed

# Implementation Notes

- Do not change docs.mdkg.dev content in this task except shared source data.
- Avoid marketing copy that outruns implementation proof.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- Browser desktop/mobile review in `task-605`

# Links / Artifacts

- `goal-41`
- `dec-51`
- `dec-52`
