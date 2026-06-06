---
id: task-278
type: task
title: define root and downstream SPEC sync after mdkg publication
status: done
priority: 1
epic: epic-52
parent: goal-8
tags: [sync, release, downstream, adoption]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-52, test-105]
blocked_by: [task-276, task-277]
blocks: [task-279]
refs: [edd-14]
aliases: [downstream-spec-adoption]
skills: [verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how parent/root repos and downstream consumers adopt the completed SPEC
design foundation.

# Adoption Paths

The completed SPEC design foundation can move outward through three separate
paths. They must not be collapsed into one action.

## Path 1: Local Accepted SHA

Use when mdkg design work is accepted locally but no npm publish has happened.

Required evidence:

- mdkg worktree has a reviewable commit containing the SPEC design foundation.
- `node dist/cli.js validate --json` passes.
- `node dist/cli.js goal next goal-8 --json` is either empty for final
  closeout or routes only to an explicit follow-up when the goal is still
  active.
- Required capability searches resolve from the committed graph.
- No package version claim is made.

Allowed adoption:

- Parent/root repos may reference the accepted local SHA or refreshed subgraph
  bundle as planning context.
- Root subgraph refresh can be previewed with `mdkg subgraph sync --dry-run
  --json`.
- No downstream repo should treat the local SHA as a public package release.

Stop condition:

- Do not publish, tag, push downstream changes, or run all-repo sync from this
  path unless a separate request explicitly selects that work.

## Path 2: Package Publish

Use only when a future release goal explicitly requests publishing mdkg assets.

Required evidence:

- package version, changelog, README, `CLI_COMMAND_MATRIX.md`, init assets,
  and publish-readiness checks agree on the release intent.
- `npm run build`, `npm run test`, `npm run cli:check`,
  `node dist/cli.js validate`, relevant smoke tests,
  `node scripts/assert-publish-ready.js`, `npm pack --dry-run --json`,
  `npm publish --dry-run`, and `git diff --check` pass.
- Registry state confirms the target version is unpublished before real
  publish.
- Post-publish registry install and temp-repo smoke pass.

Allowed adoption:

- Downstream repos may upgrade to the published npm version.
- Release notes can describe SPEC design, parser, validation, template, and
  migration behavior that actually shipped.

Stop condition:

- This goal does not publish. Publication remains a separate release goal.

## Path 3: Root Subgraph Refresh

Use when a parent/root repository tracks mdkg as an imported subgraph or bundle
for planning context.

Required evidence:

- mdkg source commit or package version is accepted.
- Root repo worktree is inspected before sync.
- `mdkg subgraph sync --dry-run --json` reports the intended mdkg refresh.
- The root repo records whether it consumed a local SHA, package version, or
  bundle snapshot.
- Root validation passes after sync if apply is requested in that separate
  repo.

Allowed adoption:

- Root may refresh read-only mdkg subgraph context.
- Root may create its own downstream adoption goal or handoff prompt.

Stop condition:

- Do not mutate the root repo from this mdkg-only goal.

# Downstream Repo Adoption Policy

Downstream adoption is a separate per-repo goal. Each repo should:

- inspect its current mdkg version, graph health, dirty worktree, and local
  template customizations.
- choose local SHA, package version, or subgraph snapshot as the source.
- run `mdkg upgrade --dry-run --json` before apply.
- preserve downstream-local SPEC extensions and product-specific examples.
- apply scaffold/template updates only after reviewing preserved
  customizations and conflicts.
- validate with repo-local gates, not only mdkg package gates.
- create repo-owned SPEC nodes from templates only when the repo has an
  explicit adoption task.

All-repo sync should be a separate umbrella goal with an inventory, per-repo
plan, validation matrix, and stop conditions. It should not run as part of
goal-8 closeout.

# Handoff Checklist

Before another repo consumes this foundation, provide:

- accepted mdkg commit SHA or package version.
- summary of SPEC design capabilities completed.
- compatibility status: design-only, parser implemented, diagnostics wired,
  templates promoted, or package published.
- explicit no-exporter/no-runtime-implementation boundary when applicable.
- required validation commands for the consumer repo.
- instructions to preserve downstream-local extensions.
- follow-up tasks for parser/validator implementation if not yet shipped.

# Adoption Blockers

Do not recommend downstream adoption when:

- `goal-8` lacks closeout evidence.
- `mdkg validate` fails.
- capability searches for SPEC section, diagnostics, projection drift, runtime
  agent manifest, or orchestrator agent fail.
- local template migration policy is unresolved.
- package release notes claim behavior that has not shipped.
- downstream repo worktree or graph state is unknown.

# Acceptance Criteria

- Local accepted SHA, package publish, and root subgraph refresh paths are
  separate.
- All-repo sync is a separate follow-up goal.
- Per-repo SPEC adoption happens after mdkg assets are accepted.

# Test Plan

- `mdkg capability search "downstream SPEC adoption" --json`
- `mdkg goal next goal-8 --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Do not publish or sync downstream repos in this task.

# Links / Artifacts

- `goal-8`
- `epic-52`
