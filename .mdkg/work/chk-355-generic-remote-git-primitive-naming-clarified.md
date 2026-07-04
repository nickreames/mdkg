---
id: chk-355
type: checkpoint
title: generic remote Git primitive naming clarified
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-51]
blocked_by: []
blocks: []
refs: [goal-50, task-649, test-337]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-51, task-650, test-338]
created: 2026-07-03
updated: 2026-07-03
---
# Summary

Clarified the child mdkg graph and skill surfaces so remote Git and
project-memory primitives are generic mdkg successor capabilities, not
0.4.1 publish-bound contract-profile behavior.

Current 0.4.1 publish/readiness nodes now point remote Git/project-memory work
at paused successor `goal-51` instead of treating it as current release scope.
The new `service-boundary-ownership-check` skill records the owner matrix and
forbidden public surfaces for these boundary-sensitive primitives.

# Scope Covered

The formal checkpoint scope is the paused successor lane: `goal-51`,
`task-650`, and `test-338`. The active 0.4.1 publish/readiness nodes are cited
in `refs` and summarized here because they were clarified, but the checkpoint is
not an executable member of `goal-50`.

## Changed Surfaces

- `goal-50`: added `goal-51` as context and clarified remote Git/project-memory
  primitives are deferred successor planning.
- `task-645`, `task-648`, `test-336`, `task-649`, and `test-337`: tightened
  0.4.1 publish/readiness naming gate language.
- `goal-51`, `task-650`, and `test-338`: seeded paused successor planning for
  generic remote Git/project-memory primitives.
- `service-boundary-ownership-check`: added canonical skill plus mirrors for
  generic ownership classification.

## Boundaries

- in scope: `.mdkg/work/**`, `.mdkg/skills/**`, `.agents/skills/**`,
  `.claude/skills/**`, and mdkg index/event files produced by mdkg commands.
- out of scope: functional TypeScript/source, package metadata, npm publish
  state, public default/init seed assets, generated dist, root subgraph bundles,
  gitlinks, downstream repos, deploys, tags, pushes, and providers.
- raw secrets, raw prompts, raw payloads, credentials, Git tokens, SSH key
  material, queue bodies, provider dumps, and runtime state roots excluded.

# Decisions Captured

- Remote repositories, authenticated Git access refs, `.mdkg` graph discovery,
  accepted revisions, history/why/next-work queries, and agent working-loop
  primitives are mdkg-owned generic capabilities.
- Product-specific runtime/profile policy remains downstream consumer-owned and
  private unless a future mdkg decision generalizes it.
- These primitives are not ready for the 0.4.1 publish lane and are routed to
  paused successor `goal-51`.

# Implementation Summary

Created `goal-51` with `task-650` and `test-338` as a successor planning lane.
The lane is paused and explicitly non-publish, with implementation, docs,
templates, package, publish, push, provider, root bundle, and downstream repo
mutation out of scope.

Added a canonical `service-boundary-ownership-check` skill and synced configured
mirrors. The skill classifies mdkg-owned generic project-memory primitives and
requires opaque refs/hashes/policy refs for authenticated Git access rather than
credential material.

# Audit Findings

- Reviewed surfaces: `goal-50`, `task-645`, `task-648`, `task-649`,
  `test-336`, `test-337`, `goal-51`, `task-650`, `test-338`, and the new
  service-boundary skill.
- Findings: targeted public-surface grep over these edited nodes found no
  downstream product-name mentions after the clarification.
- Residual risk: broader historical graph nodes still contain product-specific
  planning context; this checkpoint only clarifies the active publish/readiness
  path plus the new successor lane.

# Verification / Testing

## Command Evidence

- command: `git status --short --branch` before edits
- result: clean tracked/untracked state, `main...origin/main [ahead 18]`
- command: `mdkg status --json` before edits
- result: ok with warning that selected `root:goal-49` is already achieved;
  graph stale false, dirty false
- command: `mdkg goal show root:goal-50 --json`
- result: active publish lane, active node `task-646`
- command: `mdkg goal next root:goal-50 --json`
- result: selected blocked approval-gated publish task `task-646`
- command: targeted `rg` over edited release/successor nodes for downstream
  product-name literals
- result: no matches
- command: `mdkg skill validate service-boundary-ownership-check --json`
- result: ok true, checked_count 1, warning_count 0, error_count 0
- command: `mdkg index`
- result: index, skills index, capabilities index, subgraphs index, and sqlite
  index written
- command: `mdkg validate --changed-only --json`
- result: ok true, warning_count 0, error_count 0
- command: `mdkg validate --summary --limit 20 --json`
- result: ok true, warning_count 1, error_count 0; only warning is the existing
  legacy SPEC compatibility warning for `.mdkg/work/mdkg-cli/SPEC.md`
- command: `git diff --check`
- result: passed with no output

## Pass / Fail Status

- status: pass for changed-file validation and whitespace checks; full graph
  summary has one unrelated legacy SPEC compatibility warning

## Known Warnings

- warning: `mdkg status --json` still reports the previously selected
  `root:goal-49` as already achieved; the explicit target for this run is
  `root:goal-50`.
- warning: `.mdkg/work/mdkg-cli/SPEC.md` remains a legacy SPEC compatibility
  warning outside this change.

# Known Issues / Follow-ups

- `goal-51` remains paused successor planning. It is not a 0.4.1 publish
  prerequisite unless a later owner explicitly changes the release scope.
- Future implementation must define CLI/API, validation, docs, templates, and
  release gates before claiming remote Git/project-memory primitives as public
  mdkg behavior.

## Follow-up Refs

- `goal-51`
- `task-650`
- `test-338`

# Links / Artifacts

- `goal-50`
- `task-649`
- `test-337`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
