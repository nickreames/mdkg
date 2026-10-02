---
id: chk-641
type: checkpoint
title: Isolate demo qualification and bind cleanup to owned roots and child shutdown
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-demo-fixture-progress.json]
relates: [goal-86, task-838, dec-97]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Task838's demo fixture increment is locally verified. Mutable bootstrap/graph
operations now run in private copied inputs, cleanup uses exact created roots,
and source errors or surviving descendants cannot silently bypass cleanup
admission. All80 affected checks and the actual demo smoke pass on each required
local Node runtime. Task838 and Goal86 remain active/incomplete; no release claim.

# Scope Covered

Goal86 continuation under Dec97, current owner mdkg-project-agent. The preceding
turn was read-only revalidation/no implementation progress. This turn reproduced
and corrected the remaining bounded demo-harness review findings. No new goal,
implementation node, runtime lease or selected-goal change was needed.

## Changed Surfaces

- scripts/qualification-fixture.js (new owned root/process/finalization helper)
- scripts/demo-graph-fixture.js (new explicit input-copy helper)
- scripts/smoke-demo-graph.js
- tests/qualification-fixture.test.mjs (19 checks, including negative subcases)
- Task838, Goal86, this checkpoint, sanitized JSON and required mdkg projections.

## Boundaries

- In scope: Node.js local qualification infrastructure, disposable synthetic
  fixtures, focused subsystem checks and one independent read-only reviewer.
- Out of scope: native/Rust/Bun work, hosted/Linux execution, remote Git,
  publication/providers/deployment, blocked security context, canonical graph
  migration, protected bundles and root/consumer/sibling changes.
- No credentials, raw security reports, private operational payloads or recovered
  Demo3 application payloads were copied or executed.

# Decisions Captured

Dec97 and Task840 selective validation remain in force. Bug60's Node-only
observation design question and failing regression remain untouched. Deferral
of Rust/Linux is not a waiver of Bugs46/47 or required platform acceptance.

# Implementation Summary

The old prefix-cleanup defect and three review gaps were reproduced in owned
fixtures before correction. A follow-up macOS case-alias bypass was also
reproduced and corrected. Canonical source/index bookends remain unchanged.

# Implementation Details

- Copy only runtime, example graphs and released hash-checked operator inputs.
  Validate source paths before copying; protected names are case-insensitive.
  Unlisted website files, dependencies and canonical private root work stay out.
- Source verification and cleanup run independently; AggregateError preserves
  original execution, source and cleanup failures. No success receipt precedes
  successful cleanup. Uncertain ownership or shutdown retains and names the root.
- Node child execution uses tracked POSIX groups; timeout or surviving children
  trigger group termination. Cleanup independently checks disappearance. EPERM
  means unverified, not absent. Deliberately detached descendants and OS-level
  sandboxing are outside this trusted-child-tree guarantee; Windows is unqualified.
- Existing bootstrap code and semantic source-release/operator manifests remain
  byte-identical. Canonical read-only checks use explicit --root; all process cwd
  and mutable graph operations use the copied fixture. No npm runtime payload change.

# Verification / Testing

## Command Evidence

- node --test --test-reporter=tap with the six recorded fixture/artifact/output,
  coverage-contract, CI-topology and release-ladder test files:80/80 on each
  Node24.15.0,24.18.0,26.0.0/macOS arm64. Durations2.446s,2.453s,2.514s.
- Each runtime executed scripts/smoke-demo-graph.js successfully in7.009s,
  8.914s,8.359s. Four graph examples, two distinct bootstrap+repeat pairs,
  19-node packs and all nine negative classifications remain asserted. Exact
  owned roots removed; no retained successful run trees.
- Input copy:588 files,4,441,411 bytes, exact hash in JSON. Do not infer a measured
  performance improvement solely from reduced copy size.
- The first expanded focused run was18/19; a transient process-group EPERM
  exposed incomplete failure classification. Fixed fail-closed handling and
  reran all affected cases; no skipped regression. Intermediate results are not
  reused as final evidence after the case-alias correction.
- One read-only reviewer rechecked corrections, including the reproduced
  case-alias edge. Final narrow source follow-up found that edge addressed;
  reviewer did not independently execute tests or grant broad security clearance.
- Full test discovery includes170 files. No TS/runtime source changed, so the
  previously verified build/test compilation was reused, not rebuilt blindly.
- Exact commands, source/log hashes, limitations and protected hashes are in
  the attached JSON. Required index refresh and full graph validation pass with
  zero errors and three preserved stale-import warnings. Changed-only validation
  is zero errors/warnings; SQLite verification reports all five projections fresh.
  git diff --check passes. All six final log hashes and source/protected hashes
  match; no mutation/Git-index lock remains and no runtime sidecar appeared.

## Pass / Fail Status

PARTIAL / NOT_READY. This is a verified qualification-infrastructure increment,
not Task838 completion, installed-final-artifact proof or pre-merge acceptance.
Goal86 retains26/47 done nodes; subtask progress does not inflate that checklist.

## Known Warnings

Preserve existing stale-subgraph and non-actionable checkpoint routing warnings.
Do not refresh bundles or change graph selection to make them disappear.

# Known Issues / Follow-ups

- Complete Task838 Git environment/helper/root admission across remaining
  mutating fixture callers, including native worktrees and gitdir indirection.
- Complete durable final evidence and installed qualification. Task839's
  release-critical truth, Task828 review, Task829 full ladder and Task830 seal
  remain. Bug60, Bugs46/47 and Test487 Linux proof remain unresolved.

## Follow-up Refs

Task838 remains the next independent local lane. Goal85 stays paused. Chk639,
Chk640 and their evidence retain earlier identities; no historical receipt rewritten.

# Links / Artifacts

- Concise Task838 dry-run pack selected Task838/Chk640 without writes.
- Main c10113489381badf2845fc378c49b317376f953e,67ahead/0behind cached origin;
  no remote verification. Nothing staged or committed in this increment.
- 52 entry file hashes outside the four owned script/test changes were unchanged
  before recording evidence. Protected selection/runtime/Demo3 hashes match JSON.
- Final logs: /private/tmp/mdkg-task838-demo-final-vDI273 and
  /private/tmp/mdkg-task838-demo-smoke-final-3XSxVm. Local temporary log custody;
  sanitized graph evidence and reproducible tests are retained, not a final seal.
- No persistent lease acquired. Task838 owner retained for continuation; transient
  mdkg locks must be released before closeout. No standing exclusive lease implied.
- Skills: pursue-mdkg-goal, build-pack-and-execute-task,
  source-grounded-diagnose-and-fix, verify-close-and-checkpoint. Candidates:none.

# Raw Content Safety

Only current-source summaries, synthetic outcomes and hashes. No blocked context
was opened/recovered/reconstructed; no external acceptance is inferred.
