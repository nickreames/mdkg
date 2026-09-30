---
id: task-838
type: task
title: Bind release fixtures to isolated Git state owned cleanup and immutable candidate bytes
status: done
priority: 1
tags: [release-0.6.0, qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json, .mdkg/artifacts/goal-86/task-838-artifact-custody-progress.json, .mdkg/artifacts/goal-86/task-838-output-custody-progress.json, .mdkg/artifacts/goal-86/task-838-demo-fixture-progress.json, .mdkg/artifacts/goal-86/task-838-git-fixture-progress.json, .mdkg/artifacts/goal-86/task-838-smoke-caller-progress.json, .mdkg/artifacts/goal-86/task-838-six-smoke-caller-progress.json, .mdkg/artifacts/goal-86/task-838-db-smoke-caller-progress.json, .mdkg/artifacts/goal-86/task-838-graph-smoke-caller-progress.json, .mdkg/artifacts/goal-86/task-838-sync-smoke-caller-progress.json, .mdkg/artifacts/goal-86/task-838-consumer-smoke-progress.json, .mdkg/artifacts/goal-86/task-838-git-boundary-progress.json, .mdkg/artifacts/goal-86/task-838-mcp-smoke-progress.json, .mdkg/artifacts/goal-86/task-838-tail-smoke-progress.json, .mdkg/artifacts/goal-86/task-838-local-commit.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, chk-624, chk-647, chk-648, chk-649]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-22
---
# Overview

Goal: make final qualification evidence trustworthy and its destructive fixture
operations confined to independently verified owned roots.

Context: Task837 reviewed all149 current test files and79 executable scripts.
It found correctness/qualification gaps, not additional shipped vulnerabilities:
ambient Git variables can redirect synthetic Git operations, cleanup accepts
overbroad configured paths, and hard-linked candidate delivery does not prove
immutable final bytes. Existing intermediate passes remain historical evidence.

# Acceptance Criteria

2026-09-21 user direction: no blocked-context access, recovery attempts or reruns
of historical blocked findings. Retained mdkg evidence is the remediation basis.
The recovery proposal below is historical and no longer an execution prerequisite.
Implement durable custody for newly produced validation evidence going forward;
never manufacture old receipts or represent missing old bytes as retained.
Task838 closes the fixture and intermediate-candidate custody lane. The fresh
Standard report's plugin-owned raw custody is a separate Task828 gate, and the
final qualified candidate seal is Task830's gate; neither is asserted by
Task838 closure. The private ignored intermediate tarball is local-only custody,
not publication or shared-Git evidence.

- Persist sanitized case-level receipts and source/artifact hashes before
  disposing of temporary execution roots. Exact candidate bytes and canonical
  raw security reports need explicit retained custody in their approved private
  or plugin-owned location; a temporary pathname or digest alone is not custody.
- Chk624 records inaccessible Standard report/manifest/findings/coverage paths
  and the Bug48 intermediate tarball/receipts. Recover exact originals and verify
  recorded hashes where available. Otherwise record the loss and obtain new
  qualification evidence with explicit supersession, never reconstructed bodies
  or silent reuse of an inaccessible artifact. Keep raw reports out of public Git.
- All mutating fixture Git subprocesses clear ambient GIT_DIR, GIT_WORK_TREE,
  GIT_INDEX_FILE and related redirect/config variables, disable configured
  helpers and bind the expected fixture root/gitdir before mutation.
- Cleanup uses created or explicitly accepted owned temporary roots, exact
  paths and safe containment. MDKG_COVERAGE_DIR/config and scratch-prefix
  values never authorize deleting a repository, home, parent or unrelated tree.
- Hash the exact candidate before delivery and again after each relevant
  consumer and at final sealing. Hard-link delivery is not immutability.
  Changed bytes fail the gate and invalidate qualification.
- Preserve inherited-environment behavior only when a test explicitly isolates
  and tests it. Do not silently claim process env filtering is OS network or
  credential isolation; record actual sandbox controls.
- Retain full test discovery and existing coverage thresholds89/77/96; no
  deletion of required tests or fabricated compatibility limits.

# Files Affected

- scripts/npm-smoke-proxy.js
- scripts/release-ladder.js
- scripts/coverage-contract.js and its configuration/contract tests
- scripts/smoke-demo-graph.js and directly affected owned fixture helpers
- Existing installed-* and smoke-* scripts and tests that perform synthetic
  native Git mutation; prefer a shared small helper over duplicated policy.
- Sanitized Goal86 qualification evidence; no production/root/consumer state.

# Implementation Notes

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

Inventory actual call sites before implementation. Separate package-affecting
changes from validation-only inputs; both invalidate the relevant evidence.
Do not execute an unsafe cleanup probe outside a created disposable tree.
Missing host/platform capabilities remain explicit gates, not source fixes.

# Test Plan

- Poison inherited Git variables toward an outside sentinel repository; verify
  the helper refuses or isolates them and every sentinel byte/index is preserved.
- Unsafe coverage/scratch paths refuse before deletion; exact owned roots clean
  successfully. Link/ancestor replacement follows the shared filesystem policy.
- Deliberately alter a delivered synthetic candidate and require final hash
  rejection, including same-size changes and hard-linked delivery.
- Execute the existing proxy/ladder/coverage contracts and installed positive
  controls with exact outputs; Task828 reviews affected trust boundaries.
- Task829's full ladder and Task830's final seal depend on this work, not vice versa.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:test-488; root:task-828; root:task-829; root:task-830

## Current State

2026-09-25 source-only local commit: Task838's 62 fixture/qualification script
and test paths were staged explicitly after their patch matched an isolated
copy of committed HEAD. That exact isolated snapshot passed 2163/2163 tests
on Node24.18.0/macOS arm64, CLI/docs/CI checks, the existing remediation
matrix, and staged diff checks. Commit
1143e31ac4f153bfa4c7f543c01b93a1692271fb contains no mdkg graph,
Bug60 source, protected state, bundle or public-copy path. The sanitized
Task838 graph receipts remain unstaged/uncommitted for later evidence custody.
The final candidate seal, independent security review and Linux qualification
remain separate. See task-838-local-commit.json for the exact path manifest.

2026-09-22 Task838 local fixture/candidate-custody acceptance: all identified
release-manifest caller groups now use bounded owned execution or an intentional
hostile-Git control; the last three callers passed corrected three-runtime
qualification and narrow independent follow-up review. The exact intermediate
candidate is retained as a verified ignored private local copy. Chk649 and the
Task838 artifact series bind source/candidate hashes, local case results and
limits. Full and changed-only graph validation, five index checks, and diff
check pass. Fresh raw Standard-report custody and independent diff review stay
with Task828; final artifact sealing stays with Task830. Neither is claimed
complete here. No remote, publication, staging or commit action occurred.

2026-09-22 remaining three release-manifest smoke callers now use owned local
fixtures and supervised execution. Capability registry/cache scenarios,
installed-package visibility refusals, and 32-SQLite/16-JSON parallel writer
scenarios remain intact. Parallel fixture roots now clean only after the worker
and its children close. Each caller emits a machine-readable cleanup receipt.
The release-manifest smoke scan finds no raw spawnSync/mkdtempSync outside the
intentional hostile-Git shim source, already qualified under chk648.

Initial runs of all three callers and 100 affected tests passed on each local
Node24.15.0, 24.18.0, and26.0.0 runtime. Candidate and source hashes, ambient Git sentinel,
and nested cleanup bookends pass. Evidence is task-838-tail-smoke-progress.json
under Goal86 artifacts. This finishes the caller migration inventory, not a
final package seal, current security acceptance, full ladder, or publication
claim. A hash-matched local copy of the intermediate tarball is retained at
`.mdkg/artifacts/goal-86/private/candidate-0.6.0-intermediate-058e981a.tgz`
under the repository's ignored `*.tgz` policy. It is local custody, not a
shared Git artifact or Task830's final seal. The complete-contract check is
recorded in the closeout entry above.

Independent bounded source review then found that direct invocation of the
parallel smoke's internal worker could write inside an unrelated temporary
directory. It now requires the supervisor marker and a per-run owner token,
with a pre-write direct/refused regression. The corrected three-runtime runs
pass 101 affected checks each and supersede the earlier 100-check passes.
The reviewer also bounded visibility qualification: immutable-candidate and
no-canonical-repack claims apply to the proxy-qualified release run, not a
standalone direct invocation that may trigger package prepack.

2026-09-22 MCP installed smoke now uses deferred candidate admission, an owned
supervised worker, fixture-bound Git, selected-Node server launch, bounded
shutdown, and complete protocol/exit/stderr failure reporting. Independent
read-only source review found four concrete gaps during iteration; all were
corrected with focused regressions. Final installed runs pass on local
Node24.15.0/24.18.0/26.0.0 with ten JSON/SQLite read states and99 affected
checks per runtime. Source/candidate/sentinel hashes and nested cleanup pass.
Evidence: task-838-mcp-smoke-progress.json under Goal86 artifacts. The
intermediate tarball is unsealed; no final package/platform/security clearance.

Before Task838 closure, classify three additional release-manifest smoke
callers: smoke-capabilities (built CLI, no direct native Git), smoke-parallel
(built CLI, asynchronous workers, missing cleanup), and smoke-visibility
(installed package, raw process/cleanup). Preserve their current scenarios and
explicitly route each to Task838 or another owner; do not call the caller
inventory complete merely because the earlier list ended at MCP.

2026-09-22 chk647 also qualifies the native npm-exec consumer on all three local
runtimes. Each of five lazy executions verifies exact candidate bytes before and
after, and records the actual installed mdkg Node path/version. The reviewed
whole-exercise-only custody gap reproduced and is corrected;149 affected checks
pass per runtime. Evidence: task-838-consumer-smoke-progress.json under Goal86
artifacts. Two distinct callers remain: hostile-Git boundary and asynchronous
MCP with their transitive helpers. No package-input edit, full ladder or seal.

2026-09-22 chk647 qualifies seven synchronous installed callers and three
transitive helpers:21 selected installed passes and147 affected checks per
local runtime. Shared diagnostics and imported init-controller regressions were
reproduced/corrected after independent review. Stale contract-node sequencing and
synthetic bundle-policy hash binding were corrected without changing runtime
validation. Composite receipts retain failed attempts and explicitly bind reused
passes to unchanged dependent inputs. All sentinel/artifact/cleanup checks pass.

Evidence: .mdkg/artifacts/goal-86/task-838-sync-smoke-caller-progress.json.
Three distinct callers remain: npm-exec consumer, hostile-Git boundary and async
MCP. Preserve their native workflow and negative controls. No package-input
change, full ladder, seal, staging or commit; Goal86 remains26/47 done,NOT_READY.

2026-09-22 chk646 qualifies eight more installed graph-workflow callers on local
Node24.15.0/24.18.0/26.0.0:24 installed runs and129 affected checks per runtime
pass. Original scenario coverage, child graphs and unchanged Git-stage repair
checks remain. The stale next --json fixture call is replaced by supported next
plus explicit supervised refusal/whole-owned-fixture equality and routing controls.
Independent narrow review corrections are accepted; not final security clearance.

All source/candidate/sentinel hashes and owned cleanup checks pass. Same
intermediate tarball; no package-input edit, rebuild, seal, full ladder or commit.
Evidence: .mdkg/artifacts/goal-86/task-838-graph-smoke-caller-progress.json.
Ten candidates remain: seven synchronous transport/general scripts, npm-exec
consumer, deliberate hostile-Git controls and asynchronous MCP. Continue those
distinct fixture shapes without dropping scenarios. Goal86 stays26/47 done;
Bug60 and existing security/platform/final release gaps are unchanged.

2026-09-22 chk645 qualifies seven DB/SQLite callers using shared owned execution,
private npm state, deferred verified installation and cleanup. All original
scenarios remain; unignored assertions now require exact Git exit1. All seven
legacy wrappers reproduced ambient index redirection in owned synthetic fixtures.
The reviewer also found ambient ignore defaults/overrides affecting check-ignore;
three owned XDG/HOME/local-config cases reproduced it. Fixed fixture
core.excludesFile=os.devNull, preserving .gitignore/info-exclude, index inventories
and SQL staging. Narrow source follow-up found no remaining concrete correction gap.

Final installed runs pass7/7 and affected checks128/128 on each macOS arm64
Node24.15.0/24.18.0/26.0.0 runtime. Every candidate/source/sentinel hash and owned
cleanup check passes. Internal DB helper cases use installed-package exports,
not canonical source imports; final public/runtime/platform qualification remains
separate. Same intermediate tarball, no package-input edit/repack/full ladder/seal.
Evidence: .mdkg/artifacts/goal-86/task-838-db-smoke-caller-progress.json.

Continue the eighteen remaining caller candidates, grouping simple synchronous
graph workflows separately from archive/subgraph/MCP and deliberate hostile Git
controls. Retain complete scenario coverage and finite subprocess supervision;
the inventory is not a vulnerability count. Task838 stays active and Goal86
stays26/47 done, NOT_READY. Bug60 and existing release gates are unchanged.

2026-09-22 chk644 completes another six caller migrations: fix-plan, loop,
handoff, command-docs, integration-ux and operator-health. All six legacy wrappers
reproduced ambient Git-index redirection inside owned synthetic fixtures. Shared
Node/Git/npm dispatch and deferred installation now preserve original scenarios,
private configuration, artifact verification and cleanup/error evidence.

One read-only review found installation before initial artifact admission in the
new standalone runner. The parent reproduced and corrected it; installation and
exercise now follow exact packed-byte admission and before/after verification.
The correction follow-up found no remaining concrete defect in its bounded scope.
All six installed smokes pass on each local Node24.15.0/24.18.0/26.0.0 runtime,
and all122 affected checks pass per runtime with zero failures/skips. The same
intermediate tarball was reused; no canonical build, repack or full ladder.
Evidence: .mdkg/artifacts/goal-86/task-838-six-smoke-caller-progress.json.

Continue DB/SQLite and the remaining fixture caller inventory. No Task838 final
closure, package seal, actual0.5.2 upgrade, Linux or publication proof is inferred.
Bug60 and Bugs46/47 remain unchanged. Goal86 stays active with26/47 records done.

2026-09-22 chk643 migrates direct branch/upgrade smoke callers and all three
installed collaboration/recovery Node helpers to owned Git/environment/process
admission. Private npm config/cache and separate source-pinned baseline
consumption preserve candidate provenance; extra packages/offline overrides
refuse. One independent read-only reviewer and bounded corrections are recorded.

Final affected checks pass117/117 per local Node24.15.0/24.18.0/26.0.0. Installed
branch/collaboration plus12 recovery cases and seven current-upgrade scenarios
pass per runtime against the same intermediate tarball. Actual published0.5.2
upgrade is explicitly unverified, stopping at an absent local baseline without
network. Final parser-only correction has current focused/real-proxy synthetic
coverage, not real published-package installation. No full suite/ladder or seal.

Continue remaining fixture callers, starting fix-plan/loop/handoff/command-docs/
integration-ux/operator-health; DB/SQLite smoke callers also remain. Do not count
the search inventory as vulnerabilities or silently drop hostile-env controls.
Task838 remains active. Bug60, Bugs46/47, Linux and final gates remain unchanged.
Evidence: .mdkg/artifacts/goal-86/task-838-smoke-caller-progress.json.

2026-09-22 Git/process increment under chk642: explicit owned Git metadata/index
admission, mutable-hardlink refusal, helper/option/recursion controls and native
worktree-config identity semantics are covered by current regressions. Shared
Node/Git supervision preserves one outer group through instrumented nested workers;
cleanup belongs to the external owner and requires shutdown proof. Upgrade fixture
creation/finalization is owned and error-preserving, including macOS temp aliases.

Current affected selection passes105/105 on each local Node24.15.0/24.18.0/26.0.0.
The demo smoke and installed collaboration plus12 graph-recovery cases per runtime
pass; one intermediate tarball's bytes are unchanged. The JSON records the precise
installed-harness snapshot and typed-Boolean-only follow-up evidence boundary.
No final package seal, full-suite/coverage result or published0.5.2 upgrade rerun.

Task838 remains active: classify/migrate surrounding smoke-branch-conflicts.js,
legacy smoke-upgrade.js Git calls and the remaining fixture inventory; preserve
intentionally poisoned cases under explicit isolation. Full installed/final
acceptance and durable final artifact custody are still required. No public Git
wrapper, runtime feature, Bug60 edit, blocked-context access or remote action.
Evidence: .mdkg/artifacts/goal-86/task-838-git-fixture-progress.json.

2026-09-22 demo-fixture increment under chk641: mutable demo graph/bootstrap
work runs from private copies, with exact owned-root cleanup and POSIX Node
child-group shutdown admission. Source and cleanup errors are independently
aggregated. Website operator inputs are manifest-bound, hash-verified and
case-alias protected. All80 affected checks plus the actual demo smoke pass on
each local Node24.15.0/24.18.0/26.0.0 runtime. No canonical bootstrap/source-release,
example index, selected goal, runtime DB or Demo3 bundle change. One read-only
reviewer's three initial gaps and case-alias follow-up were reproduced/fixed.
Evidence: .mdkg/artifacts/goal-86/task-838-demo-fixture-progress.json.

Task838 stays active for shared Git environment/helper/root admission across
remaining fixture callers, durable final evidence and installed/final acceptance.
This Node-only trusted-process-tree guard is not an OS sandbox or a Bug46/47
remedy. Bug60 source and its failing regression remain preserved. No new runtime
design, full suite/ladder, Linux/hosted run, commit or publication is claimed.

2026-09-22 output-custody increment: coverage and full-context preparation no
longer recursively delete configured destinations; context restore preserves
different existing dist and reuses matching content without inode replacement.
Standalone coverage retains fresh run directories. Explicit coverage output
keeps the exact ladder layout and refuses populated destinations. Release
receipt overrides now name collections containing a fresh run child; previous
receipts and CI startup evidence are retained. Configured paths must be physical,
not symlink aliases. Context manifest/package leaf checks precede content reads.

Three new destructive baseline cases failed in owned synthetic roots; final
affected checks pass61/61 on each of Node24.15.0,24.18.0 and26.0.0/macOS arm64.
This includes22 new checks, real synthetic coverage reporting, FIFO refusal,
existing CI contracts and artifact controls. One read-only reviewer identified
pre-read/receipt gaps; corrections received a bounded source follow-up. These
are validation-infrastructure results, not installed-package or release coverage.
See .mdkg/artifacts/goal-86/task-838-output-custody-progress.json for hashes,
run evidence and limits. Earlier artifact-custody evidence remains intermediate;
its release-ladder source hash is superseded by this new exact snapshot.

Task838 stays active: Git fixture environment/root admission, demo scratch
isolation/cleanup, durable final evidence custody and installed/final acceptance
remain. Bug60's source and failing regression are untouched; its design choice
is still pending. No full suite/ladder, native/Linux/hosted work or commit.

2026-09-22 active local Node.js execution. First bounded artifact-custody unit:
reproduced hard-linked candidate mutation risk, canonical self-delivery deletion
and unrelated destination overwrite in three synthetic cases. Added a shared
verification/copy helper; proxy delivery now uses independent exclusive copies,
preserves existing paths, and verifies delivered/canonical hashes around install
consumption. The ladder verifies canonical bytes before/after each smoke and
again at final acceptance. No stronger OS sandbox or race guarantee is claimed.

All27 focused artifact/release-harness checks pass on Node24.18.0/macOS arm64
in2.36s (14 new,13 existing). New tests are included by full discovery. Syntax
and diff checks pass. One intermediate variable-rename error was corrected and
the complete affected selection rerun. No real installed candidate, full ladder,
Linux or independent final acceptance is claimed by these synthetic controls.
Evidence: .mdkg/artifacts/goal-86/task-838-artifact-custody-progress.json.

Remaining Task838 scope is still required: ambient Git/root isolation across
mutating fixtures, safe owned coverage/context/scratch cleanup, durable evidence
retention, actual installed controls and independent final qualification. Source
and test changes remain unstaged/uncommitted. Preserve the independent blocked
Bug60 draft and its deliberate failing journal-transition regression.

2026-09-18 planning addendum: evidence retention is a demonstrated gate, not
just future cleanup hygiene. The committed sanitized scan intake and findings
remain available, but four canonical scan files and Bug48 temporary evidence
are absent at their recorded paths in this environment. Cause and availability
on the original host are unknown; no deletion or host inspection is inferred.
See chk624 and .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json.
This addendum does not authorize new storage, external access or another scan.
