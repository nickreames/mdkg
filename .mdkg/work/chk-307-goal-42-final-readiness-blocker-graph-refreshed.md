---
id: chk-307
type: checkpoint
title: goal-42 final readiness blocker graph refreshed
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-606]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-42, task-605, test-308, task-606, test-311, test-312]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Refreshed the `goal-42` final readiness graph so `task-606` can become
actionable after upstream website/docs, Browser/Chrome, SEO, no-secret, and
example proof is complete.

This is a graph-only correction. `task-606` no longer waits on downstream
validation tests `test-311` and `test-312`; instead it blocks them. `task-605`
and `test-308` now distinguish historical live-currentness evidence from the
current local branch state.

# Scope Covered

Scope is captured in frontmatter: `goal-42`, `task-605`, `test-308`,
`task-606`, `test-311`, and `test-312`.

## Changed Surfaces

- `.mdkg/work/task-605-run-browser-seo-accessibility-and-no-secret-launch-readiness-proof.md`
- `.mdkg/work/test-308-docs-site-browser-seo-and-accessibility-contract.md`
- `.mdkg/work/task-606-prepare-article-announcement-support-and-close-0-4-0-launch-readiness.md`
- `.mdkg/work/chk-307-goal-42-final-readiness-blocker-graph-refreshed.md`

## Boundaries

- in scope: mdkg graph routing, current evidence wording, checkpoint evidence,
  and local graph validation.
- out of scope: source/docs/package/site behavior changes, live production
  validation, git push, deploy, DNS, analytics, npm publish, and git tag.
- raw secrets, raw prompts, raw payloads, provider UI, npm auth state, and bulky
  execution traces excluded.

# Decisions Captured

- `task-606` should be gated by upstream proof nodes only.
- `test-311` and `test-312` are downstream validation contracts for
  `task-606`, not prerequisites for starting it.
- Live Browser/Chrome production validation remains a post-push/post-deploy
  boundary. This checkpoint records no new live production claim.

# Implementation Summary

- Removed `test-311` and `test-312` from `task-606.blocked_by`.
- Added `test-311` to `task-606.blocks`, keeping `test-312` there as well.
- Added an implementation note explaining that both tests validate the
  closeout task after it runs.
- Updated `task-605` and `test-308` to say the latest recorded live-production
  currentness evidence remains `chk-302`, `chk-303`, and `chk-304`, while the
  current local branch is `main...origin/main [ahead 11]` at `419db20`.

# Audit Findings

- Reviewed surfaces: `task-605`, `test-308`, `task-606`, `test-311`,
  `test-312`, `goal-42` selector behavior, and local git status.
- Findings: the prior graph had a task/test cycle where `task-606` was blocked
  by its own downstream validation tests. That would make final launch
  readiness closeout ambiguous after `task-605` completes.
- Residual risk: production mdkg.dev/docs.mdkg.dev currentness is still
  unproven after the latest local commits until an approved push/redeploy and
  live Browser/Chrome validation run.

# Verification / Testing

## Command Evidence

- `git status --short --branch`: `## main...origin/main [ahead 11]` before this
  graph-only edit.
- `git rev-list --left-right --count origin/main...HEAD`: `0 11`.
- `git log --oneline -5`: latest local commits include `419db20 docs: prefer
  profile flag in public examples` and `6970248 web: align 0.4.0 launch
  language`.
- `node dist/cli.js goal next goal-42 --json`: still selects `task-605`, which
  remains open until approved push/redeploy and live verification pass.
- `node dist/cli.js index`: passed; rebuilt JSON, skills, capabilities,
  subgraphs, and SQLite index caches.
- `node dist/cli.js validate --changed-only --json`: passed with `ok: true`, 0
  warnings, and 0 errors.
- `node dist/cli.js validate --json`: passed with `ok: true`, 1 accepted legacy
  `SPEC.md` compatibility warning, and 0 errors.
- `node dist/cli.js show task-606 --json`: passed; `task-606.blocked_by` now
  excludes `test-311` and `test-312`, and `task-606.blocks` includes both.
- `git diff --check`: passed.

## Pass / Fail Status

- status: passed locally; ready for graph-only local commit.

## Known Warnings

- Full graph validation is expected to retain the accepted legacy `SPEC.md`
  compatibility warning until the planned follow-up bridge is fully retired.

# Known Issues / Follow-ups

- `task-605` remains open until approved push/redeploy and live
  Browser/Chrome production validation prove mdkg.dev/docs.mdkg.dev are
  current.
- `task-606` should become actionable only after `task-605`, `test-308`, and
  `test-310` are complete.
- `0.4.0` package publish readiness still requires the final package version
  bump, full pre-publish gates, pack dry-run, publish dry-run, and explicit
  approval.

## Follow-up Refs

- `goal-42`
- `task-605`
- `test-308`
- `task-606`
- `test-311`
- `test-312`

# Links / Artifacts

- `chk-302`
- `chk-303`
- `chk-304`
- `chk-305`
- `chk-306`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw
  secrets, raw prompts, raw payloads, or bulky execution traces.
