---
id: edd-17
type: edd
title: operator status and doctor strict baseline architecture
tags: [status, doctor, operator, architecture, 0-3-2]
owners: []
links: []
artifacts: []
relates: [epic-74, task-324]
refs: [rule-3, epic-74, goal-13]
aliases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

`0.3.2` should make mdkg repo health easy to inspect from humans, agents, and
CI without requiring a hand-assembled sequence of `git status`, `mdkg validate`,
`mdkg db verify`, `mdkg goal current`, and cache checks.

This design introduces two read-only surfaces:

- `mdkg status --json`: a fast operator summary.
- `mdkg doctor --strict --json`: an actionable health report with typed check
  IDs, severities, and remediation hints.

Both commands may read Git state, caches, config, selected goal state, and
project DB state. They must not rebuild indexes, apply repairs, write graph
files, mutate project DB state, or update selected goal state.

# Architecture

Create a shared operator-health collector used by both commands. The collector
should have small check functions and return a stable JSON envelope. `status`
summarizes checks for day-to-day use; `doctor --strict` returns the full check
list and fails on stricter conditions.

Implementation boundaries:

- `src/commands/status.ts` owns the `mdkg status` CLI surface and summary
  formatting.
- `src/commands/doctor.ts` keeps existing checks but evolves result rows to
  typed IDs and strict-mode severities.
- Shared health helpers live outside command dispatch so unit tests can
  exercise them without shelling out.
- `src/cli.ts`, help snapshots, and `CLI_COMMAND_MATRIX.md` document both
  surfaces together.

# Data model

No new durable data model is required in `0.3.2`. Both commands are read-only
projections over existing sources:

- `package.json`
- `CHANGELOG.md`
- `.mdkg/config.json`
- `.mdkg/state/selected-goal.json`
- `.mdkg/index/*`
- `.mdkg/db/project-db.json` and project DB verify results when DB is enabled
- Git status and branch upstream metadata when Git is available

The JSON envelopes become public command contracts and should be snapshotted in
tests.

# APIs / interfaces

Public commands:

- `mdkg status [--json]`
- `mdkg doctor [--strict] [--json]`

`status --json` envelope:

```json
{
  "action": "status",
  "ok": true,
  "root": "/repo",
  "mdkg": {
    "package_version": "0.3.2",
    "binary_path": "/opt/homebrew/bin/mdkg"
  },
  "git": {
    "available": true,
    "branch": "main",
    "clean": true,
    "ahead": 0,
    "behind": 0,
    "dirty_tracked_count": 0,
    "untracked_count": 0
  },
  "graph": {
    "valid": true,
    "warning_count": 0,
    "error_count": 0
  },
  "goal": {
    "selected": "goal-13",
    "active_node": "task-324",
    "stale": false
  },
  "db": {
    "enabled": true,
    "verified": true,
    "warning_count": 0,
    "failure_count": 0
  },
  "generated": {
    "index_stale": false,
    "capabilities_stale": false
  },
  "summary": {
    "level": "ok",
    "warnings": 0,
    "failures": 0
  }
}
```

`doctor --strict --json` envelope:

```json
{
  "action": "doctor",
  "ok": false,
  "strict": true,
  "checks": [
    {
      "id": "goal.selected_achieved",
      "name": "selected goal",
      "status": "fail",
      "severity": "error",
      "message": "selected goal is achieved but still current",
      "remediation": "run mdkg goal select <active-goal> or mdkg goal clear"
    }
  ],
  "summary": {
    "ok": false,
    "errors": 1,
    "warnings": 0,
    "infos": 0
  }
}
```

Check row contract:

- `id`: stable machine key, lower snake/dot case.
- `name`: short human label.
- `status`: `pass | warn | fail | info`.
- `severity`: `info | warning | error`.
- `message`: one-sentence diagnosis.
- `remediation`: concrete next command or policy note.
- `refs`: optional ids, qids, paths, or command refs.

Initial check IDs:

- `runtime.node_version`
- `repo.root_config`
- `repo.git_state`
- `release.package_changelog`
- `graph.validate`
- `graph.index_cache`
- `graph.capability_cache`
- `goal.selected_missing`
- `goal.selected_achieved`
- `db.project_verify`
- `db.runtime_transient_files`
- `archive.storage`
- `bundle.storage`
- `subgraph.configured_state`
- `visibility.policy`

# Failure modes

- Git is unavailable or the repo has no upstream branch: `status` reports
  `git.available` or nullable ahead/behind fields instead of failing.
- Graph validation fails: `status --json` returns `ok: false`; `doctor
  --strict` emits a typed `graph.validate` failure.
- Project DB is not enabled: `db.enabled: false` is not a failure.
- Project DB is enabled but verify fails: strict doctor fails with
  `db.project_verify`.
- Selected goal is achieved/stale: status reports `goal.stale: true`; strict
  doctor fails with `goal.selected_achieved`.
- Dirty Git worktree: status reports counts; strict doctor warns by default and
  later repair/apply commands may treat it as a hard refusal.
- Changelog/package mismatch: strict doctor warns with
  `release.package_changelog`; release-specific hard failure belongs to a later
  release-check slice.

# Observability

JSON output goes to stdout and must parse as a single JSON object. Human
diagnostics and non-JSON notes go to stderr. Text output may be concise, but it
must not be the source of truth for automation.

Exit-code policy:

- `0`: command completed and no failing checks exist.
- `1`: command completed but health checks failed.
- `2`: usage error.
- Existing internal errors keep current CLI error handling.

# Security / privacy

Do not include environment variables, auth headers, npm tokens, cookie values,
raw queue payloads, raw project DB row payloads, or private node bodies in
status/doctor output. Path output should be repo-relative where possible.
Subgraph and capability summaries must preserve existing visibility policy.

# Testing strategy

Unit tests:

- `status --json` succeeds in a clean temp repo and includes release, git,
  graph, selected goal, generated cache, and DB fields.
- `status --json` reports dirty tracked and untracked counts without failing.
- `doctor --strict --json` emits stable typed check IDs and fails on invalid
  graph state.
- Stale achieved selected goal is detected.
- JSON stdout contains no human prefix text; diagnostics go to stderr.

Packed/temp smoke:

- Create a temp repo, `mdkg init --agent`, validate, run `status --json`,
  `doctor --strict --json`, dirty the repo, rerun status/doctor, initialize and
  verify DB, then rerun both commands.

# Rollout plan

1. Implement `mdkg status --json` and minimal text output.
2. Refactor doctor rows to stable typed check IDs without breaking existing
   `doctor --json` consumers.
3. Add `--strict` as an opt-in mode that upgrades selected-goal, graph, DB, and
   generated-state issues into actionable failures.
4. Add command matrix/help snapshots and packed temp-repo smoke coverage.
5. Keep fix/apply behavior out of scope; `epic-70` owns repair planning.

# Links / Artifacts

- `goal-13`
- `epic-74`
- `task-324`
- `rule-3`
