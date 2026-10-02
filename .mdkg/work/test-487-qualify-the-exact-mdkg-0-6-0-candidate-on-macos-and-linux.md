---
id: test-487
type: test
title: Qualify the exact mdkg 0.6.0 candidate on macOS and Linux
status: done
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json, .mdkg/artifacts/goal-86/test-487-linux-arm64-qualification.json, .mdkg/artifacts/goal-86/test-487-local-linux-scope.md, .mdkg/artifacts/goal-86/test-487-docker-isolation.json, .mdkg/artifacts/goal-86/test-487-docker-scope.md, .mdkg/artifacts/goal-86/private/test-487-docker-capsule-manifest.json, .mdkg/artifacts/goal-86/test-487-docker-runtime-downloads.json, .mdkg/artifacts/goal-86/test-487-docker-arm64-families.json, .mdkg/artifacts/goal-86/test-487-docker-arm64-scale.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-disposition.json, .mdkg/artifacts/goal-86/test-487-docker-arm64-runtime.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-runtime.json, .mdkg/artifacts/goal-86/test-487-docker-arm64-supplement.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-supplement.json, .mdkg/artifacts/goal-86/test-487-docker-execution-identities.json, .mdkg/artifacts/goal-86/test-487-docker-runner-controls.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-families.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-partial.json, .mdkg/artifacts/goal-86/test-487-docker-amd64-scale-retry.json, .mdkg/artifacts/goal-86/test-487-local-platform-composition.json, .mdkg/artifacts/goal-86/test-487-macos-capability-umask.json, .mdkg/artifacts/goal-86/test-487-final-executor-identities.json, .mdkg/artifacts/goal-86/test-487-cleanup.json, .mdkg/artifacts/goal-86/private/test-487-docker-supplement-capsule-manifest.json, .mdkg/artifacts/goal-86/private/test-487-docker-scale-retry-capsule-manifest.json, .mdkg/artifacts/goal-86/test-487-local-commit.json, .mdkg/artifacts/goal-86/final-installed-family-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/final-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/candidate-seal-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json]
relates: []
blocked_by: [test-477, test-478, test-479, test-480, test-481, test-482, test-483, test-484, test-486, task-839, task-838, test-489]
blocks: []
refs: [dec-96, test-482, task-828, dec-97, epic-257, dec-98, goal-87, dec-99, chk-662, chk-666]
context_refs: [goal-86, goal-83, goal-84]
evidence_refs: [chk-651]
aliases: []
skills: []
cases: [test-487-case-1, test-487-case-2, test-487-case-3, test-487-case-4, test-487-case-5, test-487-case-6, test-487-case-7, test-487-case-8, test-487-case-9]
created: 2026-09-13
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

Same artifact/input/payload identities on native macOS ARM64, Ubuntu24 ARM64/native and x86_64/emulated; all retained case/runtime/topology/filesystem/scale rows covered. Original fixture failures and corrected supplements retained; minimum and selected Node binaries identical, counted once.

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

## 2026-09-29 completed local platform-family milestone

All18 selected installed family groups now have passing evidence on Ubuntu
24.04.4 userspace: native ARM64 and Rosetta-emulated x86_64, Node24.18.0.
The exact6154e4ea candidate and269 package inputs did not change. The platform
composition receipt binds every selected family, original failures, corrected
runtime image and strengthened read-only/capability supplements separately.
Matching28 installed capability/umask controls also pass on native macOS ARM64.

The x86_64 retry completed11 cases in718362ms; its SQLite migration completed
in593517ms under the explicitly reviewed900000ms harness allowance. Four JSON
rows from the first run plus these11 rows give15 unique scale/history/routing
cases; two repeated original SQLite legacy rows are excluded. The original
600064ms timeout remains evidence, not erased or relabeled a pass. No smaller
graph, product change, new performance SLA or native-x64 performance claim.

All nine owned containers/anonymous fixture volumes, seven temporary image
tags and three scratch roots were removed after preserving sanitized results,
failure diagnostics, stream hashes, capsule manifests and reproduction inputs.
Shared base images/build cache and unrelated Docker/Lima resources were untouched.

Linux availability and selected case execution are no longer missing gates.
Keep this aggregate open for explicit family/contract acceptance and consume
the existing results without blanket reruns. Independent Task828 acceptance,
Task829 full37-smoke package ladder/coverage, Task830 seal and reviewed final
custody remain unfinished. Goal85 stays paused; Bugs46/47 stay deferred and
unresolved. Earlier in-progress statements below are historical observations.

## 2026-09-29 authorized local Docker execution

Nick approved the existing local Ubuntu executor for these final readiness
gates. Test487 is explicitly claimed by mdkg-project-agent under Goal86;
selected Goal73 is unchanged. Earlier unclaimed/no-executor statements below
are historical. The verified Docker Desktop Unix endpoint runs Ubuntu24.04.4
userspace on LinuxKit, native ARM64 and Rosetta-emulated x86_64, without host
mounts, credentials, privileged containers or test-time networking.

Current retained6154e4ea bytes and package-input digest are unchanged. ARM64
installed families and all15 representative scale/routing cases pass after an
executor-only Node26 loader correction. Both architectures pass strengthened
46-case real-read-only semantic checks plus28 installed capability/umask
regressions and actual unsupported-runtime controls. Count19 expected safe
runtime controls separately from two known unsupported old-init observations.
Original failures, old capsule identities and later supplements remain separate.

The x86_64 scale family remains failed/incomplete: JSON migration completed
in574818ms; SQLite migration reached the existing600000ms command timeout
(600064ms, SIGTERM/ETIMEDOUT). Six earlier observation rows completed, not
the entire15-case family. Remaining x86_64 scale/history/routing proof must be
resolved without silently raising the allowance, shrinking the fixture or
assuming native performance. Observed Rosetta processes inject `--no-opt`;
no executor configuration was changed. This is not yet a confirmed product
defect. Unaffected x86_64 families are separately recorded by their receipts.

Keep this aggregate open. Final family acceptance, independent current-source
and complete remediation-diff review,37-smoke package ladder/coverage and exact
seal are still required. Bugs46/47 remain deferred/unresolved. Windows, hosted
CI, native x86_64 performance and the cold-cache/read-only cross-product remain
unqualified. Goal85 stays paused; no publication or remote Git action.

Require local macOS plus Linux ARM64/x86_64 using identical bytes. Chk662 proves49 Linux ARM64 subset rows, not complete matrix/x64. Keep real read-only, worktree, runtime and regression obligations. Hosted stub implementation now belongs to Epic257 and no longer blocks this test. Windows remains unqualified.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Overview

## Current local Linux authorization and evidence - 2026-09-28

Dec99 records Nick's clarification: Linux remains required and isolated local
Linux testing is authorized. The earlier no-new-VM limitation below is historical;
this authority permits disposable local qualification, not persistent/hosted
infrastructure, host dependency installation or provider activity.

Chk662 records49 selected installed Test479 scenario rows passing on the retained
6154e4ea candidate under Node24.18.0/Ubuntu24.04.4 ARM64/ext4, native AppleVZ.
The VM had no host mounts or forwarded credentials and was stopped/deleted;
the unrelated stopped Lima instance was untouched. All281 transferred file
hash/mode bookends matched, with offline candidate installation. This test is
owned progress, not backlog or final acceptance. Other installed families,
Linux x86_64, complete platform/release validation and final seal remain open.
The original unexecuted statement below is historical, not the current result.

## Current scope amendment - 2026-09-28 Dec98

Qualify the Node-only candidate, not a new native filesystem helper. Bugs46/47
are DEFERRED and unresolved under Goal87; record their limitations accurately
without treating platform execution or documentation as a fix. Their complete
hardening cases move to that follow-up. Keep all other read-only, link/type,
ownership, staging and single-writer controls and the exact macOS/Linux gate.
Windows remains explicitly unqualified until its own evidence exists.

Test489 and Tasks841/842 are prerequisites for the portable observation and
explicit recovery contract. Replace the historical unconditional Node24.15/
26.0 success expectation with the final capability/range proved by Task842,
including clear pre-effect refusal on unsupported runtimes. Do not manufacture
passes from version numbers. The current deliberately failing CI stub remains
unqualified until real installed candidate checks replace it under the owned
release task; this node update does not dispatch or waive hosted execution.

2026-09-28 current routing: Nick permitted an isolated local Ubuntu ARM64
filesystem experiment and a local-only, fail-closed GitHub Actions gate stub.
The experiment tested native primitives, not an installed mdkg candidate; the
stub exits unsuccessfully if an explicit future full workflow dispatch occurs.
Neither is Linux qualification. No hosted dispatch, exact-artifact platform
case, or release acceptance was performed. Dec97's former no-VM/no-workflow-edit
limit is superseded only for this narrow local feasibility/stub scope. The
complete macOS/Linux acceptance matrix below remains required and this test
remains backlog/unqualified.

Bind complete macOS and Linux qualification to one exact0.6.0 tarball. Windows
is explicitly unqualified; engine metadata alone is not platform proof.

# Target / Scope

Nick confirmed Linux x86_64 and ARM64 qualification on2026-09-15. Record the
host and guest architectures and native versus emulated execution explicitly.
Emulation is not evidence of native performance or host filesystem equivalence.
Existing isolation/endpoint/image checks and infrastructure authority gates apply.

The installed family/runtime matrix, native worktrees, filesystem/ownership and
release validation environment. Existing tests retain their evidence and current
case contracts, including the explicit test-480 old-client limitation. This test
verifies platform identity/completeness rather than treating old counts as passes.

# Preconditions / Environment

Owner: mdkg-project-agent, one writer in this checkout. Goal86 has an explicit
run authorization; this aggregate test is still unclaimed and incomplete.
The run authorizes bounded implementation, local validation, evidence and
reviewed explicit-path local commits on main; selected state does not authorize it.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

For final qualification, verify the Linux executor and record endpoint,
OS/kernel, architecture, pinned image identity when applicable, runtime/npm/Git
versions and filesystem semantics. Mount only owned fixtures and required
read-only candidate inputs, not credentials, Docker sockets, or unrelated/
canonical writable paths. Unauthenticated public runtime downloads may use
isolated local caches under the run contract. Nick's 2026-09-28 local experiment
authorization covered only the now-deleted isolated VM; future hosted execution
or new persistent infrastructure still requires specific authority. Missing
exact-artifact platform proof remains a blocking gap.

# Test Cases

1. Same tarball SHA256/SHA512 and file manifest on macOS/Linux; no source-import
   substitution, platform repacking or missing-runtime pass.
2. Node24.18.0 and the selected supported Node24 line execute all required
   installed families on both macOS and Linux, with exact versions and case
   coverage. If they resolve to identical bytes, record one execution rather
   than count it twice. Older24 patches and higher majors are unsupported:
   qualify early no-effect refusal instead of demanding successful operations.
   Missing capabilities refuse independently of version. Smoke-only results
   do not satisfy this final gate; Dec98/Task842 supersede the old24.15/26 matrix.
3. Actual0.5.2 upgrade, compact init and customized instruction/document preservation.
4. Two real linked worktrees, concurrent offline creation, per-checkout state,
   same-checkout exclusion, native reviewed ancestry-preserving source-plus-graph merge.
5. Separate submodule/gitdir indirection, staged/unstaged input and exact Git index
   resolution via Git, not assumptions about root/.git/index.
6. Actual read-only filesystem refusal, link/type and hardlink controls,
   rwx/umask behavior and source-custody checks; explicitly disclose the
   deferred ACL/owner and adversarial ancestor-replacement limitations under
   Goal87. Neither a passing platform case nor documentation fixes those bugs.
7. Real abrupt termination and evidence-bound recovery; live/ambiguous owners,
   modified evidence and cross-worktree recovery refuse without side effects.
8. JSON/SQLite parity, MCP/packs/archive/work, scale and goal/blocker routing;
   removed/unknown invocations have complete zero-write/subprocess proofs.
9. Full test-discovery and manifest-backed ladder results identify macOS/Linux
   source/runtime/environment. Final ladder refresh lives in task829, not an
   upstream prerequisite of this platform test. Coverage floors never decrease.

# Results / Evidence

FINAL-ARTIFACT CASES PLANNED / UNEXECUTED. No hosted runner or Windows result
is inferred from installed client tools or the local primitive experiment. Each
case records pass/fail/unverified, exact bytes and environment. This gate cannot
pass from macOS-only evidence or the Ubuntu primitive probe.

2026-09-28 limited evidence: an isolated Ubuntu 24.04.4 ARM64/ext4 guest ran
the experimental C filesystem primitive fixture and was deleted afterward.
The exact results and limitations are in
`.mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json`. The manifest-
generated workflow now contains a deliberately failing Test487 x64/ARM64 job
in the manual full tier, required by the aggregate. No GitHub job ran; the
stub must be replaced by real installed-artifact cases before this test can pass.

# Notes / Follow-ups

Qualify filesystem security limitations independently in task828; documentation
cannot waive confirmed in-scope defects. Missing platform proof blocks task826,
task828, task829, chk570 and publication. Retain compact sanitized diagnostics.
