---
id: task-425
type: task
title: write external runtime integration handoff megaprompt
status: done
priority: 1
epic: epic-112
parent: goal-22
tags: [handoff, runtime, external]
owners: []
links: []
artifacts: [.mdkg/handoffs/goal-22-integration-ux-handoff.md, .mdkg/handoffs/runtime-integration-upgrade-megaprompt.md]
relates: []
blocked_by: [task-424]
blocks: [task-426]
refs: []
aliases: [external-runtime-handoff]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Write a copy-ready handoff megaprompt for the external runtime integration repo after mdkg implements and validates the new surfaces.

# Acceptance Criteria

- Handoff explains how to upgrade and adapt to new mdkg capabilities.
- Handoff includes goal state, boundaries, validation commands, queue contract notes, handoff command usage, and migration expectations.
- Handoff does not mutate the external repo and does not include raw prompts, secrets, provider payloads, or bulky execution traces.
- The node title remains generic even though the deliverable targets `/Users/nick/omni-chat-rooms/projects/omni-room-runtime`.

# Files Affected

- Handoff artifact under mdkg-owned pack/archive or task evidence location chosen during implementation.

# Implementation Notes

- The handoff target is external runtime integration, but the mdkg node title and durable roadmap naming stay generic.
- Do not edit the target repo during this task.

# Test Plan

- mdkg handoff create proof after task-422 is complete.
- node dist/cli.js validate --json
- git diff --check

# Links / Artifacts

- .mdkg/handoffs/goal-22-integration-ux-handoff.md
- .mdkg/handoffs/runtime-integration-upgrade-megaprompt.md
- task-426
