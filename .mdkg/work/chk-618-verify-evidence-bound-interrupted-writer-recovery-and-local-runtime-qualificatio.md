---
id: chk-618
type: checkpoint
title: Verify evidence-bound interrupted-writer recovery and local runtime qualification
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-836]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-836]
created: 2026-09-17
updated: 2026-09-17
---
# Summary

Task836 is locally done. Explicit interrupted-writer recovery now binds exact
checkout/OS ownership, transaction/journal evidence and current file custody;
insufficient, live or changed ownership refuses. Goal86 remains NOT_READY for
publication. Task827 draft metadata and release-critical guidance is next.

# Scope Covered

- Completed node: task-836 (Add evidence-bound interrupted-writer recovery for graph transactions)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-836
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of task-836 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- Full source and separate coverage runs each pass 1,627 tests with no skips.
  Coverage: 91.80% lines,82.80% branches,96.99% functions; floors remain89/77/96.
- Intermediate 228-file tarball SHA256
  50ab8882d49d4db76bf1bf1ec118bb49a0b004a26679d850fa49b01ead64ddc6
  passes11 installed CLI SIGKILL/recovery cases on each of Node24.15.0,
  24.18.0 and26.0.0. Metadata remains0.5.2; not a final0.6.0 artifact.
- Independent bounded source review found two candidate defects. Four failing
  regressions proved them before correction; all pass afterward and the exact
  correction received a second read-only review. This is not Codex Security clearance.
- Build, CLI/contract, docs470examples/63files, workflow, graph and diff pass.
  Full graph preserves three stale imported-bundle warnings; refresh is withheld.
  Changed-only validation has no warnings/errors; SQLite projections are fresh.

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Final0.6.0 metadata/installed matrix, macOS/Linux x86_64+ARM64, fresh Standard,
  independent complete-remediation diff, full release ladder and exact seal remain.
- Incomplete metadata publication and partial cleanup fail closed. No universal
  power-loss, malicious same-user pathname-race or ACL-preservation claim.
- HEAD38205296208c23fcfcc6fc821a295040be05c0bb unchanged; nothing staged/committed.
  Selected Goal73, runtime DB, Demo3 and Git index bytes match protected hashes.
  No remote/provider, canonical migration, bundle refresh or publication action.
- Ownership is task-scoped; no runtime lease acquired and no persistent mutation
  lock remains. Broader documentation/polish stays deferred. Skill candidates:none.

- Inspect the completed node and linked refs for any explicitly recorded residual work.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-836-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
