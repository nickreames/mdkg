---
id: test-486
type: test
title: Verify unsupported CLI options fail before side effects and supported flags remain compatible
status: done
priority: 1
parent: bug-39
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json, .mdkg/artifacts/goal-86/bug-39-local-verification.json, .mdkg/artifacts/goal-86/test-486-local-option-qualification.json, .mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/final-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json]
relates: []
blocked_by: [bug-39, task-827, task-839, task-838]
blocks: []
refs: [task-828, chk-657]
context_refs: [goal-86, dec-96, goal-84]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-12
updated: 2026-09-30
---

# Current sealed successor acceptance - 2026-09-30

This record's final acceptance now consumes b5497c5f5e5f022e candidate bytes
at source b10870355b264355af2be4fc53bb4640851f747b, not the earlier f7/6154
candidate. The successor-installed-case-acceptance and successor-installed-platform-
qualification receipts bind this QID's actual bounded cases, three exact platforms,
source/package/harness hashes and limitations. The exact artifact is sealed in
candidate-seal-20260930.json; Chk570 records complete local acceptance.

All20 retained installed families are accounted on native macOS ARM64 and Ubuntu24
ARM64-native/x86_64-emulated; minimum/supported Node24.18.0 operation is counted
once, with actual24.15/26 early refusal/discovery controls. No Windows, native x64
performance, hosted/website or consumer-adoption proof is claimed. Earlier failures
and intermediate passes below remain historical and are not relabeled. Bugs46/47
remain deferred/unresolved. Goal85 remains paused; no publication authority follows.

# Historical family contracts and intermediate candidate evidence


# Final installed family acceptance - 2026-09-30

Invalid/wrong-command/missing/retired options reject pre-effect with full inventories and subprocess traps; supported flags/aliases/values/positionals and writer controls; full suite/generated/help/docs parity. macOS options use exact package ladder, Linux matrices include explicit options family.

The retained f7cbdc1d tarball passes all amended package cases on native macOS
ARM64 and Ubuntu24 ARM64/native and x86_64/emulated. Exact SHA256/SHA512,
package inputs, case ownership and platform/failed-run/supplement provenance are
recorded in `.mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json`
and `final-installed-platform-qualification-20260930.json` in that directory.
Earlier candidates remain historical. Bugs46/47 are deferred/unresolved, not
fixed or accepted. Windows/hosted CI and native-x64 performance are unqualified.
Family completion is not Task828 independent security acceptance, Task830 seal
or publication authority. No package input or protected canonical state changed.

# Current accepted package closeout contract - 2026-09-28 Dec100

Reuse Chk657 current-candidate process/direct-entrypoint/unindexed-graph refusals and positives with inventory/index/subprocess proof. Missing: required Linux rows and final input-bound acceptance, not new CLI behavior.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

2026-09-28 execution amendment under Goal86/Dec98: use supported Node24.18.0
and the approved24.x capability contract; earlier24.15/26 execution expectations
below are historical and not a current support claim. Local macOS evidence is
separate from final Test487 macOS/Linux qualification and the exact artifact seal.
The legacy installed-option fixture is being bound to existing owned process/Git
controllers and the manifest-backed command-matrix smoke, retaining all refusal
and positive cases. No shipped CLI behavior change is intended in this test lane.

Goal: prove current installed option admission without filesystem, Git-index,
authentication or subprocess effects on rejected inputs. Context: completed
Bug39 and Tasks838/839, current150-path accepted dirty baseline on main6d23981e.
Boundaries: test harness, required mdkg evidence/projections and isolated fixtures
only; no canonical Git mutation, external action or blocked-context access.
Local milestone done when: current installed cases and harness regression pass, exact bytes and
inventories are bound, and final platform/artifact obligations remain explicit.
Test486 itself cannot close until its final-candidate/platform requirements below
are satisfied; this local milestone does not redefine the complete acceptance.
Evidence: failing-before controller regression, installed process/API refusal
counts, positive controls, unchanged package/source/protected-state hashes.

Unknown/wrong-command options, missing values and malformed Boolean/integer syntax
fail in both entrypoints before config, files, Git index, cache, events,
authentication or subprocess effects. Preserve valid flags/aliases/positionals
and real mutation controls. Supported-option domain, mode and graph-semantic
validation remain separate; no universal pre-config guarantee is inferred for
every invalid invocation.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Verify Bug39 rejects unsupported or wrong-command options before side effects
while retaining all supported CLI options and native Git boundaries.

# Target / Scope

CLI/parser/command-contract dispatch, synchronous and asynchronous entrypoints,
installed help, genuine mutation controls and read-only verification controls.
Owner mdkg-project-agent; Goal84 publication blocker verification.

# Preconditions / Environment

Owned synthetic graphs and subprocess traps under /private/tmp, exact installed
candidate hash, Node24.15.0/24.18.0/26.0.0. Current reproduction also binds actual
published0.5.2. No canonical graph migration, remote Git or provider action.

# Test Cases

- `index --verify --json` rejects without creating/updating any index file.
- Unsupported options on `new`, `task`, `goal`, `work`, `upgrade` and graph
  mutation paths reject before source, lifecycle, events, locks or output writes.
- Wrong-command known flags do not silently turn validation/preview into action.
- Documented global and command aliases, inline/separate values, argument order,
  Boolean forms, help and ordinary positional text remain compatible.
- Missing values and retired options fail explicitly; an adjacent option cannot
  be swallowed and accidentally become an output path or command argument.
- Subprocess traps prove no Git/auth/remote execution on rejected arguments;
  full path/mode/hash inventories cover source, indexes and staged bytes.
- Supported `db index verify` stays observational; explicit `index` still
  rebuilds derived state. Real authorized mutations remain functional.
- Complete tests, CLI contract/help, docs and installed smoke checks pass;
  task828 binds independent acceptance of the actual fix range.

# Results / Evidence

Current-intermediate milestone on2026-09-28, Chk657: the installed option
fixture now runs inside the manifest-backed command-matrix smoke with owned
process/Git controllers. All151 concrete commands are covered by194 process
refusals,388 direct-entrypoint refusals,41 unindexed-graph refusals and seven
positive controls. The166-entry fixture inventory, native Git index and
unknown-file sentinel are preserved. Four PATH traps record zero hits; this
is not universal subprocess instrumentation or a host-wide filesystem inventory.

The normally packed/installed0.6.0 candidate SHA256 is
6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca,
identical to Task839's guidance-tested bytes. No package input changed in this
lane. Node24.18.0/macOSarm64:107 focused controller/artifact/Git/cleanup tests
pass in7,757.713375ms. A bounded independent static review found the mismatched
fixture-controller admission gap; it was corrected with mismatch/released
controller regressions, reviewed again and followed by a passing installed
rerun. The receipt retains failing-before evidence and scope limitations.

Local milestone only: the temporary tarball was removed during owned cleanup.
This node remains progress until final retained-candidate, required platform,
complete test and independent acceptance gates are satisfied. No source fix,
final artifact seal, blocked-context recovery or publication is implied.

Current-intermediate evidence on2026-09-15: Bug39's local remedy passes1,463
discovered source tests and126 focused tests, with CLI/contract/docs/workflow
parity. The exact intermediate0.5.2 tarball with SHA256
0a08f31c0bda67674a4acca7fce30c2ab01f00e8799deeaf17ae33a41cb52d20
passes194 process refusals,388 direct-entrypoint refusals,41 unindexed-graph
refusals and seven positive controls on each required Node runtime on macOS.
Complete inventories and subprocess traps show no rejected-input effects.
The attached bug-39-local-verification.json binds source/package/runtime hashes,
review corrections and full-suite failure dispositions. This test remains todo
until the finalized0.6.0 artifact and required platform matrix are qualified.

Historical initial state: reproduction confirmed only; the older reproduction
artifact was not a fix receipt and remains unchanged.

# Notes / Follow-ups

- No automatic compatibility waiver. Do not treat the incomplete global parser
  flag registry as the full command contract without inspecting handlers.
- Future source changes invalidate the final package qualification seal.
