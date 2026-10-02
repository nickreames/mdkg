---
id: chk-646
type: checkpoint
title: Isolate installed graph workflow fixtures and verify supported routing refusals
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-graph-smoke-caller-progress.json]
relates: [goal-86, task-838]
blocked_by: []
blocks: []
refs: [dec-97, chk-645, goal-85, bug-60, test-487, task-828, task-829, task-830]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Eight installed graph-workflow smoke callers now use owned Node/npm/Git dispatch,
deferred verified installation and cleanup. All eight pass on each local Node
24.15.0,24.18.0,26.0.0 runtime;129 affected checks also pass per runtime.
Goal86 stays active on Task838,26/47 scoped records done,NOT_READY.

# Scope Covered

Partial Task838 implementation and intermediate qualification, not task closure.

## Changed Surfaces

- scripts/smoke-goal.js, smoke-goal-lifecycle.js, smoke-checkpoint-templates.js,
  smoke-cli-ux-polish.js, smoke-id-repair.js, smoke-graph-clone.js,
  smoke-warning-ux.js and smoke-semantic-refs.js.
- tests/qualification-smoke.test.mjs; Task838/Goal86; this checkpoint,
  sanitized case-level evidence and required projections.

## Boundaries

One repository writer mdkg-project-agent and supported explicit goal claim.
No persistent runtime lease, package-input edit, canonical build/repack, Rust/Bun,
native bridge, Linux/service/hosted execution, blocked-context access, remotes,
providers, consumer changes, bundle refresh, staging, commit or publication.
Preserve Bug60's partial source, prior skill changes and all other dirty custody.

# Decisions Captured

Dec97 remains in force. Selective-test skill0.3.0 controls cadence without waiving
full acceptance or coverage floors89/77/96. New skill candidates:none.

# Implementation Summary

- Every original wrapper reproduced ambient Git-index redirection inside an
  owned synthetic sentinel. The original source hashes match current HEAD.
- Migrated callers retain their original goal/lifecycle/checkpoint/CLI UX,
  legacy ID repair, clone/fork/import, warning and semantic-reference scenarios.
- Installed Git add/add repair still preserves the Git index and leaves explicit
  staging to the caller. Child graph/bundle creation occurs only in owned fixtures.
- The first installed run stopped on the pre-existing unsupported next --json
  fixture call. Its assertion consumes text; supported next preserves intent.
- A separate supervised refusal now requires exit1, the exact unsupported-option
  diagnostic and unchanged content/selected metadata across the entire owned
  fixture, including sibling npm/cache/config/install paths. Positive global and
  scoped routing assertions remain. No runtime next behavior was changed.
- Independent review identified the stale call and then the initially narrow
  inventory scope. Both were corrected; final source follow-up found no remaining
  concrete gap in this correction. This is not Standard/Task828 acceptance.

# Test Proof

- 24 final installed runs, all passing:8 callers on each macOS arm64 runtime.
- 129 affected fixture/helper/coverage/CI/ladder checks pass per runtime, no skips.
- Same intermediate tarball SHA256:
  058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951.
  No package-input change or repack; this is not the final sealed artifact.
- Source/artifact/log/runtime hashes and case names are in the durable JSON.
  All sentinel inventories match; all owned execution roots were cleaned after
  supervised work ended. Diagnostic receipts remain in the current private tmp
  graph-smokes directory; failed and superseded evidence is retained explicitly.
- Inventories prove observed equality, not absence of transient effects. Trusted
  child supervision is not an OS sandbox. Actual0.5.2, Linux/Windows and final
  release qualification are not established by this increment.

# Verification / Testing

## Command Evidence

- 15 smoke-helper checks passed before installed execution; syntax and diff checks
  passed. The existing qualify.cjs ran on all three exact local runtimes.
- A single-caller rerun helper was not created after two automatic permission
  review timeouts. The existing eight-caller runner was reused; seven unchanged
  cases were repeated on24.18. No unknown process was restarted or cleaned.
- Final graph/index verification is recorded below after evidence authoring.

## Pass / Fail Status

PARTIAL / NOT_READY. Technical caller qualification passes; Task838 and Goal86
remain incomplete. Full suite/ladder and exact-artifact acceptance remain required.

Full graph validation passed with zero errors and three existing stale-import
warnings; changed-only validation passed without errors or warnings. SQLite
verification passed with all five projections fresh. git diff --check passed.
All protected hashes and prior non-owned source/skill hashes match turn entry.
Final custody is96 dirty paths,zero staged; HEAD unchanged. Only smoke-goal,
Goal86,Task838 and generated SQLite differ from the94-path entry, plus the new
evidence artifact and this checkpoint. No persistent lease or lock remains.

## Known Warnings

Three existing stale imported-graph warnings remain; refresh is excluded.

# Known Issues / Follow-ups

Ten remaining candidates: seven synchronous bundle/archive/matrix/init/spike/
work-invocation/subgraph scripts, the npm-exec consumer, deliberate hostile-Git
boundary fixture and asynchronous MCP fixture. Preserve their distinctive
scenarios; search matches are an inventory, not confirmed vulnerability counts.

Bug60's design question/failing regression, Bugs46/47, unavailable local published
baseline bytes, Linux proof, final guidance/review/ladder/seal remain open.

## Follow-up Refs

Task838; Task839; Bug60; Test487; Task828/829/830. Goal85 remains paused.

# Links / Artifacts

.mdkg/artifacts/goal-86/task-838-graph-smoke-caller-progress.json.
Main c10113489381badf2845fc378c49b317376f953e; cached upstream67 ahead/0 behind,
not remotely verified. Turn entry94 dirty paths,zero staged; no commit this pass.
Selected Goal73/runtime DB/Demo3 and non-owned source bookends must remain equal.

# Raw Content Safety

Sanitized fresh synthetic evidence only. No blocked security context, reconstructed
historical bodies, credentials, operational payloads or raw scan reports.
