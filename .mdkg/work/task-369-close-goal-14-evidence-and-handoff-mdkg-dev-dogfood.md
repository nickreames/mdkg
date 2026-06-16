---
id: task-369
type: task
title: close goal-14 evidence and handoff mdkg.dev dogfood
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, closeout, mdkg-dev, handoff]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-351, task-368, test-156]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Close `goal-14` only after spike implementation, hardening, dogfood, and
`0.3.2` dry-run release-candidate evidence are complete. The closeout should
handoff mdkg.dev dogfood findings into paused `goal-15`.

# Acceptance Criteria

- `goal-14` completion evidence summarizes implementation, docs, hardening,
  smoke, dogfood, and dry-run release readiness.
- `goal next goal-14 --json` returns no actionable node, or only blocked/deferred
  nodes with explicit explanation.
- Paused `goal-15` has enough spike-backed evidence to resume at `task-354`.
- No real npm publish, git tag, push, or global install occurs.

# Files Affected

- `.mdkg/work/goal-14-*`
- `.mdkg/work/goal-15-*`
- completion checkpoint nodes

# Implementation Notes

- Create a checkpoint for the final goal closeout.
- Keep mdkg.dev implementation deferred; this is evidence and handoff only.
- Explicitly state remaining deferred work from `goal-11` and `goal-15`.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-14 --json`
- `node dist/cli.js goal evaluate goal-14 --json`
- `git diff --check`

# Links / Artifacts

- `goal-14`
- `goal-15`
- `task-351`
- `task-368`

# Results / Evidence

Completed final `goal-14` closeout review on 2026-06-16.

Goal evidence is now complete:

- `task-347` locked spike semantics as actionable work, not a passive note or
  autonomous web-search runner.
- `task-348` implemented spike as a first-class work-node type under
  `.mdkg/work/` with `mdkg new spike`, task lifecycle, next selection, goal
  traversal, search/show/list, pack ordering, templates, validation, and command
  contract support.
- `task-349` updated README, init assets, command matrix/help, publish
  readiness, and docs language to state that spikes organize research and
  planning but do not execute web search or generate files automatically.
- `task-350` added packed temp-repo `smoke:spike` coverage.
- `task-351` dogfooded the spike workflow for mdkg.dev planning and created
  `spike-1` through `spike-5` plus follow-up launch nodes.
- `task-365` hardened init/upgrade compatibility for spike templates.
- `task-366` hardened pack/export/visibility and structured discovery parity.
- `task-367` hardened malformed spike validation and dry-run fix-plan guidance.
- `task-368` prepared the `0.3.2` release candidate and proved pack/publish
  dry-run readiness without publishing.
- `test-142` through `test-156` are closed with evidence across lifecycle,
  goal/pack/search/show behavior, packed dogfood workflow, init/upgrade,
  visibility/export, malformed-spike repair guidance, and RC dry-run readiness.

mdkg.dev handoff state:

- Paused `goal-15` has launch planning scope ready at `task-354`.
- `goal-15` includes research spikes for information architecture, outcome
  examples, security/trust posture, SEO/AI-search positioning, and technical
  architecture narrative.
- Follow-up nodes from dogfooding are present: `task-370`, `task-371`, and
  `test-157`.
- Website implementation remains deferred until `goal-15` is explicitly
  resumed.

Closeout verification:

- `node dist/cli.js validate --json` passed with zero warnings and zero errors.
- `node dist/cli.js goal next goal-14 --json` routed to this final closeout
  node before completion.
- `node dist/cli.js goal evaluate goal-14 --json` was reviewed as report-only
  evidence; all required checks have explicit command evidence on child nodes.
- `git diff --check` passed after release-candidate evidence was recorded.

No real npm publish, git tag, git push, or global install occurred.
