---
id: chk-27
type: checkpoint
title: mdkg 0.1.8 db and queue consumer upgrade handoff
status: backlog
priority: 9
tags: [0_1_8, handoff, project-db, queue, consumer-repos]
owners: []
links: []
artifacts: [docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md]
relates: [task-171]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-171]
created: 2026-06-04
updated: 2026-06-04
---
# Summary

Created a durable `mdkg@0.1.8` consumer repo upgrade handoff for upgrading
other repos' `.mdkg` graphs to the latest managed scaffold and optionally
enabling the new project DB foundation plus internal queue migration.

# Scope Covered

- `task-171`
- `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`

# Decisions Captured

- Consumer upgrades should run one repo at a time with `mdkg upgrade --json`
  before `mdkg upgrade --apply --json`.
- Existing local docs and graph changes must be preserved; pre-existing
  validation failures are reported separately from upgrade-caused failures.
- Project DB enablement remains explicit opt-in per repo.
- Queue support is internal local delivery infrastructure only in `0.1.8`; no
  public `mdkg db queue ...` command is exposed.

# Implementation Summary

- Added the reusable upgrade megaprompt and changelog artifact at
  `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`.
- Updated `task-171` from the old `0.1.3` SQLite-only framing to the current
  `0.1.8` DB-and-queue handoff.
- Related the task to `epic-33`, `goal-3`, and `task-245` so queue release
  context is discoverable from the handoff.

# Verification / Testing

- `mdkg pack task-171 --profile concise --dry-run --stats` passed.
- `mdkg validate` passed before closeout with only the expected stale-index
  warning from graph edits.
- `mdkg doctor --json` reported `ok: true`; the only warning before reindex was
  stale SQLite cache.
- `mdkg index` rebuilt JSON and SQLite graph indexes after task closeout.

# Known Issues / Follow-ups

- Consumer repos are not upgraded by this task; the new artifact is the handoff
  for separate per-repo upgrade runs.
- Public queue CLI commands remain deferred.
- No commit, tag, push, or npm publish is performed by this handoff task.

# Links / Artifacts

- `task-171`
- `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`
- `goal-3`
- `task-245`
