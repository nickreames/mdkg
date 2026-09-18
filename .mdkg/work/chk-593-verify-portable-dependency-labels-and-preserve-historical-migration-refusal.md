---
id: chk-593
type: checkpoint
title: Verify portable dependency labels and preserve historical migration refusal
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-34-verification.json]
relates: [bug-34]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, bug-7, test-483, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-34]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Eight regression cases pass on three installed runtimes; 1357 full tests and 271 focused tests pass. Bug-7 historical reference and compatibility gates remain open.

# Scope Covered

- Completed node: bug-34 (Preserve portable dependency labels across identity workflows)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Runtime: src/graph/identity_refs.ts (14-line shared classification correction).
- Regression: tests/graph/identity_dependencies.test.ts (eight cross-workflow cases).
- Owned evidence: bug-34, this checkpoint, bug-34-verification.json, bug-7,
  goal-84, task-828 and test-483. The final commit allowlist is these nine paths.
- Derived index updates remain local and uncommitted; nine baseline dirty paths
  (SQLite plus eight bug-17 source/test/evidence paths) are excluded.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- No new policy decision: this correction follows existing portable dependency
  schema semantics. Explicit mdkg identities and graph-bound subagents stay strict.
- Historical task-309 aliases are preserved with uncertainty, not synthesized.
- Old-writer adoption, killed-writer recovery and old public-bundle compatibility
  decisions remain pending; no release waiver follows from this fix.

# Implementation Summary

- Completion of bug-34 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- Final regression file: seven failures before, eight passes after the fix.
- Eight installed cases pass per Node 24.15.0, 24.18.0 and 26.0.0.
- Focused identity/capability suite: 271 pass, zero fail or skip on Node 26.0.0.
- `npm run test`: 1357 pass, zero fail or skip on Node 24.18.0.
- `npm run cli:check:built`, `npm run docs:check:built`: pass.
- `npm run test:public-release`: 26 pass. This is not the full release ladder.
- Preclosure graph validation: zero errors, three stale-subgraph warnings.
- Index, full/changed-only graph validation, SQLite verification and diff checks
  pass after evidence/lifecycle updates. Full graph has zero errors and the three
  preserved stale-subgraph warnings; SQLite has zero failures/warnings. Recheck
  after this final receipt edit before staging; no source inputs changed.
- Private frozen graph preview: complete 2952139-byte JSON; seven false blockers
  removed, one historical URI blocker remains. Preview is observational and
  safe_to_apply=false; no migration applied and canonical bytes unchanged.
- Independent read-only source/test review found no bounded blocker. Final
  task-828 Codex Security diff review remains required.

## Pass / Fail Status

- status: done

## Known Warnings

- Three stale imported subgraphs remain intentionally unrefreshed. Selected
  achieved Goal73 is preserved, and no selection change is implied.
- A local orchestration overlap between a yielded task update and a manual
  cases-list patch left test-483 without its intended additive bug-34 refs.
  The intended update was reapplied after the prior process completed, then
  source fields and graph validation were rechecked. This was an execution
  sequencing correction, not product regression evidence.

# Known Issues / Follow-ups

- Goal84 has 28/30 bug lanes locally complete; bug7 and bug17 remain open.
- Complete installed scale/lifecycle qualification, settle compatibility and
  recovery decisions, finish release guidance, final security review, coverage
  ladder and exact artifact seal. Goal85 remains paused/unpublished.
- This milestone is LOCAL_FIX_VERIFIED, not LOCAL_READY_NOT_PUBLISHED.

## Custody and Authority

Before source commit: main at a441acca9e8308b7984add71a50e1669c51bdaa8,
35 ahead/0 behind cached origin/main 9652b8558942041cbebe8f444fbc79e16b1a670d.
No live remote verification. Explicit Goal83/84 implementation and local-commit
authority only. Protected selection, runtime DB, Demo3 bundle and eight bug17
paths are hash-bound in the artifact; SQLite remains separate generated custody.
Bug34 claim is complete; goal84's next active node is bug7, owned by the same
mdkg-project-agent. Runtime leases remain released and queues empty. No remote
Git, publication, tag, deployment, provider, bundle refresh, canonical migration,
or root/sibling write. Skills reused: goal pursuit, context grounding, focused
verification and exact-path Git review; no skill authoring or new candidates.

Removed 999 owned disposable fixture/cache directories after all execution handles
completed. Exact target-manifest hash is in the artifact. Candidate package,
installed prefix, scripts/logs/receipts and separate private graph copy remain;
no user-owned paths or canonical evidence were deleted.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-34-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
