---
id: chk-310
type: checkpoint
title: goal-42 0.4.0 publish and Vercel blockers enhanced
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-612]
blocked_by: []
blocks: []
refs: [goal-42, task-605, task-606, test-312]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-612, test-316, task-613, test-317, task-614, task-615, test-318, task-616, test-319, task-617, test-320]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Completed a graph-only enhancement of `goal-42` so the `0.4.0` lane now blocks
on every known publish and launch-readiness gap instead of treating website
proof or package dry-runs as sufficient.

The next actionable node is `task-612`, which owns `0.4.0` package metadata,
`CHANGELOG.md`, generated docs, docs release cards, and mdkg.dev public-copy
alignment before publish proof begins.

# Scope Covered

- `goal-42`
- `task-605`
- `task-606`
- `test-312`
- `task-612`
- `test-316`
- `task-613`
- `test-317`
- `task-614`
- `task-615`
- `test-318`
- `task-616`
- `test-319`
- `task-617`
- `test-320`

## Changed Surfaces

- Added explicit blocker nodes for source release prep, version drift, full
  prepublish dry-run gates, approval-gated npm publish, npm postpublish
  validation, Vercel production currentness, Chrome live validation, and the
  final end-to-end launch contract.
- Updated `goal-42` to make `task-612` the active node.
- Updated `task-605`, `task-606`, `test-312`, `epic-202`, and `epic-204` so
  closeout is blocked until the new contracts have evidence.
- Rebuilt the mdkg index.

## Boundaries

- in scope: mdkg graph/checkpoint/index state.
- out of scope: source/docs/package changes, npm publish, git push/tag, Vercel
  deploy, DNS, analytics, and provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Npm publish must precede public website claims that `mdkg@0.4.0` is available.
- Vercel deploy/currentness proof must precede live Chrome launch proof.
- Any uncovered readiness gap remains a blocker node, not a closeout note.

# Implementation Summary

New blockers:

- `task-612`: prepare `0.4.0` package metadata, changelog, generated docs, and
  public copy.
- `test-316`: version and release-note drift contract.
- `task-613` and `test-317`: prepublish gates, pack dry-run, and publish
  dry-run.
- `task-614`: real npm publish after explicit approval.
- `task-615` and `test-318`: npm postpublish registry, dist-tag, temp install,
  and temp workspace validation.
- `task-616` and `test-319`: Vercel production deployment/currentness and custom
  domain contract.
- `task-617` and `test-320`: Chrome live production validation and final
  end-to-end launch contract.

# Audit Findings

- Reviewed surfaces: current `goal-42`, `task-605`, `task-606`, `test-312`,
  mdkg validation output, and read-only Vercel project records.
- Findings: current blockers are explicit for `package.json`/lockfile still
  needing `0.4.0`, missing `0.4.0` changelog/release-note proof, prepublish
  dry-runs, real npm publish, npm postpublish validation, Vercel production
  currentness, and Chrome live validation.
- Residual risk: Vercel project inspection reported `READY` latest production
  deployments for both projects but `live: false`; domain/currentness proof is
  therefore required before launch readiness can be claimed.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js index`
- result: pass; SQLite/index caches rebuilt.
- command: `node dist/cli.js validate --changed-only --json`
- result: pass after removing an invalid task-level Chrome skill slug.
- command: `node dist/cli.js validate --json`
- result: pass with only the accepted legacy `SPEC.md` warning.
- command: `node dist/cli.js goal next goal-42 --json`
- result: selects `task-612`.
- command: Vercel `get_project` for `mdkg-dev` and `mdkg-docs`
- result: confirmed project IDs
  `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056` and
  `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd` under
  `team_RkZhrKQs9wWs6PAdTcrwZ87z`; latest production deployments were `READY`
  and project records reported `live: false`.

## Pass / Fail Status

- status: graph enhancement passed validation.

## Known Warnings

- warning: full validation still reports the accepted legacy
  `.mdkg/work/mdkg-cli/SPEC.md` compatibility warning.

# Known Issues / Follow-ups

- `task-612` is the next implementation task.
- No source/docs/package files were intentionally changed by this graph-only
  enhancement pass.

## Follow-up Refs

- `task-612`
- `test-316`
- `task-613`
- `test-317`
- `task-614`
- `task-615`
- `test-318`
- `task-616`
- `test-319`
- `task-617`
- `test-320`

# Links / Artifacts

- Vercel team: `team_RkZhrKQs9wWs6PAdTcrwZ87z`
- mdkg.dev project: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
- docs.mdkg.dev project: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
