---
id: task-148
type: task
title: create post publish repo handoff prompts
status: todo
priority: 2
epic: epic-25
tags: [handoff, release, runtime-contract, upgrade, repos]
owners: []
links: []
artifacts: []
relates: [task-132, epic-24, epic-25, epic-26]
blocked_by: []
blocks: []
refs: [edd-3, edd-8]
aliases: [post-publish-handoff-prompts]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

After the next mdkg npm package is published, produce repo-specific upgrade and
alignment prompts for the core consumer repos.

# Acceptance Criteria

- Produce one prompt for `/Users/nick/git/omni-room-runtime` that asks its coding
  agent to upgrade mdkg, emit richer `WORK_ORDER.md` and `RECEIPT.md`
  frontmatter, preserve `artifact://` versus `archive://` separation, and
  validate against the latest mdkg CLI.
- Produce one prompt for `/Users/nick/git/omni-web` that asks its coding agent to
  upgrade mdkg and adopt archive, visibility, bundle, and work mirror guidance
  where relevant to the repo.
- Produce one prompt for `/Users/nick/git/ochatr-ai-go` that asks its coding
  agent to upgrade mdkg and align backend semantic mirror boundaries with mdkg
  receipt, archive, and visibility conventions.
- Prompts must be safe for each repo: no npm publishing, no cross-repo source
  edits, and no raw secret or production ledger/payment state in mdkg mirrors.

# Files Affected

- `.mdkg/work/task-148-create-post-publish-repo-handoff-prompts.md`
- future prompt artifacts, if requested during the post-publish handoff pass

# Implementation Notes

This task is intentionally post-publish. It should not block local mdkg schema
compatibility work, but it should be completed before asking consumer repos to
adopt the new package behavior.

# Test Plan

- Validate the local mdkg graph.
- Confirm the prompts reference the published mdkg version and repo-specific
  validation commands.

# Links / Artifacts

- `task-132`
- `/Users/nick/git/omni-room-runtime`
- `/Users/nick/git/omni-web`
- `/Users/nick/git/ochatr-ai-go`
