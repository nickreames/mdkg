---
id: chk-546
type: checkpoint
title: Two-goal test CI skill and harness hardening graph ready
checkpoint_kind: handoff
status: done
priority: 9
tags: [planning, release, ci, skills, harness]
owners: [root]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-77, goal-78, dec-87, dec-88, dec-89, prop-9, bug-4, test-469, task-810, test-468, task-803, test-463, task-804, test-464, spike-33, task-811, test-470, task-812, test-471, task-805, test-465, task-806, test-466, task-813, test-472, loop-7, chk-544, chk-545]
context_refs: [loop-7, chk-544, chk-545, dec-87, dec-88, dec-89, prop-9]
evidence_refs: [chk-544, chk-545]
aliases: []
skills: []
scope: [goal-77, goal-78]
created: 2026-07-25
updated: 2026-07-25
---
# Summary

The two-goal successor graph to the completed Test/CI/Skill Infrastructure
Audit is decision-complete and ready for separately authorized implementation.
Goal 77 is preserved in local commit `a4d4c20e`; Goal 78 is fully specified,
paused, unselected, and blocked behind Goal 77's final proof.

# Scope Covered

- Goal 77: eight explicit executable refs for deterministic bootstrap, offline
  prepublish, reusable artifacts, bounded builds, complete coverage, and the
  goal-routing defect discovered during planning.
- Goal 78: eleven explicit executable refs across measured CI, portable skill
  projections and harness guidance, and canonical audit-template alignment.

## Changed Surfaces

- mdkg goal, decision, proposal, task, test, spike, checkpoint, and normal
  SQLite index metadata only.
- No implementation source, workflow, test source, skill body, dependency,
  public seed, generated release artifact, or external system was changed.

## Boundaries

- in scope: durable local planning state and two local commits on `main`
- out of scope: implementation, selected-goal mutation, archive or bundle
  refresh, fetch, push, tag, publish, deploy, provider calls, and registry calls
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `root:dec-87`: keep three independent lockfiles, make bootstrap explicit,
  require post-bootstrap offline verification, reuse one tarball, and bind
  profile-specific build limits.
- `root:dec-88`: measure publishable runtime with raw V8 evidence plus a
  deterministic JSON summary and enforce non-regressing thresholds locally.
- `root:dec-89`: govern six exact public skill projections and two explicit
  repository-only exclusions without exposing package-release authority.
- `root:prop-9`: defer exact fast-tier membership, shards, timeouts, and
  retention to `root:spike-33` after Goal 77 produces measured receipts.

# Implementation Summary

- Goal compatibility links were removed from `relates`; historical and design
  context remains in `refs` and `context_refs`, so the explicit goal scopes do
  not absorb unrelated goals or proposals.
- Goal 77 routes from `root:bug-4` to `root:test-469`, then through dependency,
  prepublish, and coverage proof.
- Goal 78 has three separately recoverable lanes, whose heads are blocked by
  `root:test-464`; follow-up execution cannot be mistaken for completed audit
  evidence.
- Both goals remain paused. Completed `root:loop-7` and selected achieved
  `root:goal-73` remain unchanged.

# Handoff Summary

- Recipient/context: the next single-writer implementation pass
- Starting node or command: after explicit activation authority, pack and
  execute `root:bug-4` under `root:goal-77`
- Explicit boundaries: finish Goal 77 before activating Goal 78; preserve
  local-only commit authority unless separately broadened

# Verification / Testing

## Command Evidence

- `mdkg format --headings --dry-run --json`: zero changes.
- `mdkg validate --changed-only --json`: `ok: true`, zero warnings, zero errors.
- `mdkg validate --summary --json --limit 20`: `ok: true`, zero errors and two
  accepted stale-subgraph warnings.
- `mdkg goal next root:goal-77 --json`: selected `root:bug-4`, no warnings.
- `mdkg goal next root:goal-78 --json`: currently selected blocked
  `root:spike-33`, no scope warnings; this is evidence for `root:bug-4`, not a
  Goal 78 readiness claim.
- Concise dry-run packs for both goals succeeded.
- Goal evaluations were report-only and incomplete as expected.
- `mdkg goal current --json`: selected achieved `root:goal-73`.
- `mdkg loop show root:loop-7 --no-cache --no-reindex --json`: done and
  template lineage current.
- `git diff --check`: passed.

## Pass / Fail Status

- status: planning graph ready; implementation goals intentionally paused

## Known Warnings

- `demo_agentic_coding` and `template_mdkg_dev` bundle ages exceed the
  configured stale threshold. They are baseline context outside both goals.

# Known Issues / Follow-ups

- `root:bug-4` records that `goal next` currently ignores local blockers and
  configured chain-first routing. Do not use Goal 78 selection as readiness
  evidence until `root:test-469` passes.
- Goal 78 remains blocked by `root:test-464`.
- Tracked archive caches and private bundles were intentionally not refreshed
  under the accepted mdkg-planning-only boundary.

## Follow-up Refs

- `root:goal-77`
- `root:goal-78`
- `root:bug-4`
- `root:test-469`
- `root:test-464`

# Links / Artifacts

- Goal 77 planning commit: `a4d4c20e`
- Deterministic context: concise packs rooted at `root:goal-77` and
  `root:goal-78`
- No PR, remote commit, deployment, publication, or provider artifact exists.

# Raw Content Safety

- This checkpoint stores bounded planning and validation evidence only; no raw
  secrets, prompts, payloads, or bulky logs are included.
