---
id: chk-647
type: checkpoint
title: Isolate synchronous installed smoke callers and preserve diagnostic evidence
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-sync-smoke-caller-progress.json, .mdkg/artifacts/goal-86/task-838-consumer-smoke-progress.json]
relates: [goal-86, task-838]
blocked_by: []
blocks: []
refs: [dec-97, chk-646, goal-85, bug-60, test-487, task-828, task-829, task-830]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Eight installed smoke callers now use owned execution and artifact custody:
seven synchronous general callers plus the native npm-exec consumer. All eight
have passing evidence on each local Node24.15.0/24.18.0/26.0.0 runtime; the latest
149 affected checks pass per runtime. Task838 remains progress and
Goal86 remains active,26/47 scoped records done,NOT_READY.

# Scope Covered

Partial Task838 implementation and intermediate qualification, not task closure.

## Changed Surfaces

- scripts/smoke-bundle.js, smoke-archive-work.js, smoke-command-matrix.js,
  smoke-init.js, smoke-spike.js, smoke-work-invocation.js and smoke-subgraph.js.
- scripts/smoke-consumer.js retains native npm-exec lazy installation.
- scripts/installed-work-identity.js, installed-generic-boundary.js and
  tests/fixtures/transport-state.cjs.
- Shared qualification-smoke/qualification-fixture helpers and their tests.
- Task838/Goal86, this checkpoint, sanitized evidence and required projections.

## Boundaries

One writer mdkg-project-agent under the explicit Goal86 run. No package-input
change, canonical build/repack, blocked-context access, historical scan rerun,
Rust/Bun, native bridge, Linux/service/hosted execution, remotes, providers,
consumer changes, bundle refresh, staging, commit or publication. Protected
selected Goal73, runtime DB and Demo3 bundle remain unchanged.

# Decisions Captured

Dec97 remains in force. Selective-testing skill0.3.0 reuses verified unchanged
dependent inputs without dropping full acceptance gates or coverage floors.
New skill candidates:none.

# Implementation Summary

All seven original wrappers plus the installed-work-identity wrapper reproduced
ambient index redirection in owned disposable fixtures. Migrated callers defer
installation until artifact admission, use private npm state and supervised
Node/Git execution, preserve original scenarios and report success after cleanup.

Independent review found lost primary error diagnostics and an imported init API
that depended on uninitialized controller state. Both reproduced and were fixed:
shared finalization preserves nested failures; imported exercises require an
explicit controller. Regression tests cover refusals and positive controls.

Installed execution exposed two stale fixtures: contract nodes were allocated
before placeholder references were wired, and a synthetic bundle rehash omitted
its transport policy hash. Corrected fixture sequencing/binding retains all
runtime validation and scenario assertions. Narrow review found no remaining
concrete correction gap; it is not Task828 or Standard security acceptance.

The following npm-exec migration reproduced the same old ambient Git-index
redirection. Review found that its whole-exercise hash check was insufficient
for repeated lazy execution. An injected mutation reached the second consumer
before final rejection; per-execution verification now stops after the first.
All five native executions produce matching before/after hashes and actual
installed mdkg Node path/version records. Original consumer assertions remain.
Correction review found no remaining concrete gap in that bounded change.

# Test Proof

- 24 selected installed passes across three macOS arm64 runtimes.
- General group:147 affected checks per runtime; final consumer group:149.
  Zero failures/skips in accepted focused runs; initial consumer148-check passes
  are superseded by the per-execution custody correction, not final acceptance.
- Source-aware composition: prior passing callers are reused only when all
  recorded inputs match except the generic-boundary helper they do not import.
  Work-invocation was rerun after that helper changed. Earlier failed receipts
  remain failed; their passing prefixes are not blanket acceptance.
- Same unsealed intermediate tarball SHA256:
  058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951.
- Artifact contains source/runtime/log hashes, case-level outcomes, failures,
  fixes and evidence-composition rationale. Owned execution roots were removed
  only after supervised work ended; compact diagnostics remain in private tmp.
- Sentinel equality is observed persistent-state proof, not an OS sandbox or
  guarantee against all transient effects. No final package/platform clearance.

# Verification / Testing

## Command Evidence

- qualify.cjs under the three exact local Node binaries, scoped caller labels
  and nine affected test files recorded in the artifact.
- Syntax checks and git diff --check passed; graph/index results are appended
  after the durable milestone is present.

## Pass / Fail Status

PARTIAL / NOT_READY. Caller qualification passes; full suite, release ladder,
platform/security acceptance and final artifact sealing remain required.

Combined milestone validation passed: full graph zero errors with three existing
stale-import warnings; changed-only zero errors/warnings; SQLite verification
reports all five projections fresh. git diff --check passes. Goal evaluation
is report-only and does not replace executed checks.

Bookends: main HEAD c10113489381badf2845fc378c49b317376f953e unchanged,
67 ahead/0 behind cached origin/main; no remote verification.110 dirty paths,
zero staged. All prior non-owned dirty hashes match the96-path group entry;
only the15 implementation/test paths, Task838/Goal86, this checkpoint, two new
evidence files and generated SQLite belong to this increment. No Git/mdkg
mutation lock remains; no persistent runtime lease was acquired. Task838 remains
owned progress, not released as completed work.

Protected SHA256 bookends match:
- selected Goal73: f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab
- runtime DB: b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81
- private Demo3 bundle: 741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b

## Known Warnings

Existing stale imported-graph warnings remain; refresh is outside this scope.

# Known Issues / Follow-ups

Two distinct Task838 callers remain: hostile-Git boundary and asynchronous MCP,
including transitive helpers. Preserve deliberate hostile inputs and bounded
server shutdown; do not sanitize away tests or treat nested cleanup as ownership.

Bug60's pending Node-only observation design, Bugs46/47, missing local published
0.5.2 bytes, Linux proof and final guidance/review/ladder/seal remain unresolved.

## Follow-up Refs

Task838;Task839;Bug60;Test487;Task828/829/830. Goal85 remains paused.

# Links / Artifacts

.mdkg/artifacts/goal-86/task-838-sync-smoke-caller-progress.json.
.mdkg/artifacts/goal-86/task-838-consumer-smoke-progress.json.
No local commit or external action.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
