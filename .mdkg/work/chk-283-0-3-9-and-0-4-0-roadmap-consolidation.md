---
id: chk-283
type: checkpoint
title: 0.3.9 and 0.4.0 roadmap consolidation
checkpoint_kind: audit
status: backlog
priority: 9
tags: [roadmap, consolidation, 0.3.9, 0.4.0, graph-only]
owners: []
links: []
artifacts: [.mdkg/work, .mdkg/design]
relates: []
blocked_by: []
blocks: []
refs: [dec-51, dec-52, dec-53, edd-56, edd-57, chk-282]
context_refs: [goal-20, goal-21, goal-26, goal-40]
evidence_refs: [chk-282]
aliases: []
skills: []
scope: []
created: 2026-06-26
updated: 2026-06-26
---
# Summary

Archived stale roadmap lanes and created the replacement release goals for the
next mdkg work:

- `goal-41`: `0.3.9` CLI extensibility and release-polish foundation.
- `goal-42`: `0.4.0` public docs/site launch and release notes surface.

The consolidation accepts the completed `mdkg@0.3.8` publish/post-publish
validation in `chk-282` as the reason `goal-26` should no longer block routing.

# Scope Covered

`goal-20`, `goal-21`, `goal-26`, `goal-41`, and `goal-42`.

## Changed Surfaces

- mdkg graph/design state only.
- No source, docs, package, website, publish, tag, push, deploy, DNS, analytics,
  or downstream repo mutation occurred in this pass.

## Boundaries

- in scope: archiving stale goals, seeding replacement goals, design decisions,
  EDDs, tasks, tests, spike, and this checkpoint.
- out of scope: source/docs/package implementation, public site changes, npm
  publish, git tag, push, deploy, DNS, analytics, and downstream repo mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-51`: config overlays are the official enterprise customization path.
- `dec-52`: arbitrary skill mirror paths are supported with defaults preserved.
- `dec-53`: `COLLABORATION.md` replaces `HUMAN.md` with a one-release alias.
- `edd-56`: config overlay, upgrade, and skill mirror architecture.
- `edd-57`: docs/release notes automation and public changelog architecture.

# Implementation Summary

- `goal-20` was archived as a stale demo-only `0.3.9` lane.
- `goal-21` was archived as a stale broad `0.4.0` launch lane.
- `goal-26` was archived as superseded by the actual `0.3.8` publish and
  installed-package validation.
- `task-462` and `test-211` were closed as historical/superseded, not rerun
  under their original no-public-side-effect pre-release contract.
- `goal-41` now owns `0.3.9` CLI/kernel customization and release readiness.
- `goal-42` now owns `0.4.0` mdkg.dev/docs.mdkg.dev public launch polish.

# Audit Findings

- Reviewed surfaces: live mdkg status, stale goal records, 0.3.8 publish
  checkpoint, current source-grounded config/init/skill mirror facts from prior
  analysis, and existing archived-goal lifecycle behavior.
- Findings: archived goal state is the correct representation for superseded
  goal lanes; child `goal-26` blocker nodes needed explicit supersession notes
  to avoid stale actionable routing.
- Residual risk: old archived-goal child tasks from earlier roadmap eras remain
  historical backlog, consistent with existing graph behavior.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js goal archive goal-26 --json`
- result: passed; `goal-26` archived with `last_active_node: task-462`.
- command: `node dist/cli.js goal archive goal-20 --json`
- result: passed; `goal-20` archived with `last_active_node: spike-9`.
- command: `node dist/cli.js goal archive goal-21 --json`
- result: passed; `goal-21` archived with `last_active_node: spike-10`.
- command: `node dist/cli.js new ...`
- result: created replacement decision, EDD, goal, epic, task, spike, test, and
  checkpoint nodes for `0.3.9` and `0.4.0`.

## Pass / Fail Status

- status: pending final validation in this graph pass.

## Known Warnings

- Full validation may report the accepted legacy dogfood `SPEC.md`
  compatibility warning from the 0.3.8 bridge; changed-only validation must be
  clean.

# Known Issues / Follow-ups

- Execute `goal-41` next for `0.3.9` CLI extensibility.
- Execute `goal-42` after or alongside stable `0.3.9` facts for public launch
  polish.

## Follow-up Refs

- `goal-41`
- `goal-42`
- `task-594`
- `spike-22`

# Links / Artifacts

- `chk-282`
- `goal-20`
- `goal-21`
- `goal-26`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
