---
id: task-171
type: task
title: post publish db and queue handoff prompts
status: done
priority: 2
epic: epic-20
tags: [0_1_8, handoff, sqlite, project-db, queue, consumer-repos]
owners: []
links: []
artifacts: [docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md]
relates: [epic-20, task-148, epic-33, goal-3, task-245]
blocked_by: []
blocks: []
refs: [goal-3, task-245]
aliases: [sqlite-consumer-handoffs]
skills: []
created: 2026-05-20
updated: 2026-06-04
---

# Overview

After `mdkg@0.1.8` is published, create a reusable upgrade prompt for consumer
repos so each repo can safely upgrade its `.mdkg` graph/scaffold state, preserve
local customizations, and optionally initialize the project DB foundation with
the internal local queue migration.

# Acceptance Criteria

- Prompt covers one-repo-at-a-time `mdkg upgrade --json` preflight,
  `mdkg upgrade --apply --json`, mirror sync, index rebuild, validation, and
  doctor checks.
- Prompt covers optional project DB `init/migrate/verify/stats` and sealed
  snapshot proof without treating project DB runtime files as graph source.
- Prompt explains that queue support is internal local delivery infrastructure,
  not public `mdkg db queue ...` CLI and not canonical event history.
- Prompt includes repo-specific emphasis for `omni-web`, `ochatr-ai-go`,
  `omni-room-runtime`, and the `omni-chat-rooms` root.
- Changelog summarizes new `0.1.7` DB foundation and `0.1.8` queue
  functionality for consumer repo agents.

# Files Affected

- `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`
- `.mdkg/work/task-171-post-publish-sqlite-handoff-prompts.md`

# Implementation Notes

- Consumer repos are not edited by this task; this task only creates the
  handoff artifact.
- Consumer agents should preserve existing dirty worktrees and separate
  pre-existing graph validation errors from upgrade-caused issues.
- Project DB enablement remains opt-in per repo.
- Public queue CLI work remains deferred.

# Test Plan

- Validate the mdkg graph after prompts are created.
- Run `mdkg pack task-171 --profile concise --dry-run --stats`.

# Completion Evidence

- Created `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`.
- The handoff includes the exact upgrade flow, validation gates, optional
  project DB migration checks, queue boundaries, and release evidence from the
  `mdkg@0.1.8` publish/global smoke.

# Links / Artifacts

- `epic-20`
- `task-148`
- `epic-33`
- `goal-3`
- `task-245`
- `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`
