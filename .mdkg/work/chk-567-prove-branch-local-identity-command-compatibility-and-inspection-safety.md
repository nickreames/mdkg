---
id: chk-567
type: checkpoint
title: Prove branch-local identity command compatibility and inspection safety
checkpoint_kind: implementation
status: done
priority: 1
tags: [goal-82, identity-v2, local-proof]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [task-821, task-822, test-475, edd-81]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-821, goal-82]
created: 2026-09-06
updated: 2026-09-06
---
# Summary

Goal 82 scope: 732 TypeScript plus 26 public-contract tests pass; command-state JSON/SQLite proof and unchanged Git staging. Reconciliation task-822 and final acceptance remain open.

# Scope Covered

- Completed node: task-821 (Resolve identity-backed nodes across ordinary branch-local commands)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Shared identity authoring, resolver, parser, index/cache/SQLite and validation.
- show/list/search/pack/MCP, task/goal/loop/checkpoint/event, archive/work,
  capability/manifest and graph transport command adapters; selected-goal helper.
- tests/commands/identity_commands.test.ts (18 scenarios, including the
  command-by-state matrix), identity migration and SQLite contention fixtures.
- Both graph-movement docs; owned task/goal/checkpoint and derived index state.

## Boundaries

Goal 82 Run authority, one mdkg-project-agent writer on main at
8f69773b653fd3fb409c4b473e4d39e288ee6e21, one ahead of cached origin/main.
No remote verification. No canonical graph migration, Git staging/commit/push,
history/worktree operations, bundle/subgraph refresh, provider/deployment,
release or consumer/root/sibling writes. Disposable local fixtures only.

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

V2 ordinary commands retain immutable identity, bind proven structured links,
and preserve exact body/evidence bytes. Read-only variants retain every distinct
identity sharing an alias; ambiguous mutations fail. Canonical capability and
node indexes derive from authored identity, never silently invent or discard it.
Selection follows identity across alias reuse without changing local state on
read. Claims remain durable lifecycle semantics, not distributed writer leases.
Loop groups have fresh independent identities; preview values are provisional.
Typed WORK/MANIFEST path compatibility and internal archive links survive
identity binding; external locators and historical payload hashes stay opaque.

# Verification / Testing

## Command Evidence

- npm run build: PASS; final npm run test:built: PASS, 732 TypeScript tests plus
  26 public-release/security contract tests. No provider/production test action.
- Focused identity-command/archive/migration suite: 43 passed before the final
  fixture-only contention timeout change; all are included in the final run.
- npm run cli:check:built and npm run docs:check:built: PASS, 475 examples.
- Full graph validation: zero errors and three inherited stale-bundle warnings.
  Changed-only validation and git diff --check: PASS. Evidence-boundary reindex
  and validation follow this checkpoint.
- Matrix source checks exact stable targets and whole-fixture hashes across
  untracked/staged/unstaged-alias-change states in JSON and SQLite modes. Git
  index bytes and authored identities remain unchanged by reads/index rebuilding.

## Pass / Fail Status

- PASS for task-821; not full Goal 82 or reviewed reconciliation acceptance.

## Known Warnings

- Three inherited imported-bundle age warnings remain deliberately untouched.
- Failed iterations are retained in task-821: two real validation regressions,
  typed import-path correction, fixture JSON misuse, and a validation command
  overlapping dist cleanup. The concurrent allocation test timed out only under
  full-suite load and passed in isolation; its stress-only timeout is now 60s,
  with the production 10s default unchanged and asserted.

# Known Issues / Follow-ups

- Task-822: reviewed ancestor-aware reconciliation, exact mappings, explicit
  conflict decisions, replay/cherry-pick/revert safety and bounded recovery.
- test-151/475/476: complete final acceptance; alias-change fixtures alone are
  not proof of real reviewed integration. No canonical adoption is authorized.

## Follow-up Refs

- task-822, test-151, test-475, test-476, goal-82.

# Links / Artifacts

Protected selection SHA-256:
f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab.
Runtime DB: b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81.
Private Demo bundle: 741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
Selected Goal 73 remains achieved and unchanged. Runtime leases: five historical
released records; queue empty. No standing semantic lease created; transient
supported CLI mutation locks release after commands. All Goal 82 work remains
unstaged and uncommitted. Skill coverage: goal pursuit, pack-first execution,
verification/checkpoint and source-grounded diagnosis. Skill candidates: none.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
