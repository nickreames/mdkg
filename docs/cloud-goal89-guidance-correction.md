# Goal89 release-guidance correction — 2026-10-03

PR12 stays draft, based on cloud/goal88-minimal-init ce53ea56629af23ecd10d6e58a393db1235fda79.
This is a normal correction after945ee4434b50b21861e8fff300450cca39769937.
The cloud source checkout is /workspace/mdkg-cloud-goal89 (nickreames/mdkg);
native Linux x86_64, Node24.19.0/npm11.9.0/Git2.52.0, supported Node>=24.18<25.
Main d9b74c3, plan eb4daec and Goal88 ce53 remain unchanged and unmerged.

## Concrete failure and change

Hosted run37109564106 was terminal failure. Minimum Node 24.18 reported
2449pass/2fail/2452total, with successful collection/upload. Both failures were
existing release-guidance assertions at lines104/110: the two install guides and
the docs changelog retained 0.6.1 labels while the package was 0.6.2. The same
mismatch exists at4c and945; static ce53 version inputs match. This is a concrete
Goal89 document projection regression, not an environment-only explanation.
The three prior runtime corrections passed the minimum hosted working suite.
Floating Node 24.21 was cancelled without a coverage log; collector tar exited2
on disappearing coverage files, upload succeeded. Its test outcome/cancellation
cause remains inconclusive. The four full-tier jobs were expected skips.

Only three behavior-facing documents change: both install guides identify the
unpublished 0.6.2 candidate, and the docs changelog adds its current candidate
boundary/link while preserving0.6.1 notes and published history. No source,
tests, dependencies, engine, package version, workflow, reporter, coverage floor,
timeout or smoke partitions change. No broad CI remediation or rerun.

## Bounded exact evidence

See .mdkg/artifacts/goal-89/guidance-correction/checks.json, reused-inputs.json,
product-inputs.json, commands/logs, baseline failures and prior-hosted-run.json.
The unchanged 11-case release-guidance suite passes on each native
Node 24.18/24.19/24.21. The unchanged two affected cases pass on each runtime
using exact installed package metadata/contract with an explicit repository-doc
overlay:39pass/0fail/0skip. These repository documents are not npm payload;
this installed check is not a claim that docs were published inside the package.
Installed CLI version checks report0.6.2 on all three runtimes. Source baseline
reproduced9pass/2fail; installed-metadata baseline reproduced0pass/2fail.

Docs/generated references, CLI parity/contract, graph validation and affected
local docs-site build pass. Product/built/installed/artifact drift during frozen
checks is zero. The retained build and installed manifests match945 exactly.
All npm payload file bytes remain unchanged; exact retained tar SHA256 remains
1ad72ba366c93c28f98c3ee2eacbf3368aec8a09b249f3043bf18e37805a4df4.
No new pack, installation or publication is necessary to test unchanged bytes.
Original945 runtime672pass/1skip remains evidence for its unchanged runtime and
artifact; it is not rebound as a new full-head or prepublication pass.

## Recovery, review and readiness

Authorized resumption attempt3of5 connected: selected saved environment became
ready and the single harmless pwd returned `/workspace`, exit0. All four owned
worktrees were freshly verified clean at their saved heads before edits. Two
confirmed transient failures since the rule remain; successful attempt3 adds no
failure. The preceding offline409 blocked local receipt/fresh custody checks;
no environment recreation, machine switch or authorization bypass occurred.

Chk675 exact independent review/GO, Chk676 owner/local acceptance and Chk677
complete prepublication/platform/coverage gates remain pending. Goal90 is held;
Goal89 is not achieved and release/adoption is NOT_READY. Required new-head CI
will be watched to terminal separately, without dispatch/rerun or inferred pass.
No main/plan/PR merge, publication, tags, deployment, company/Mac/unrelated repo
or provider/billing/auth writes are included.

Final durable graph validation has zero errors and one retained stale demo-bundle
age warning. Excluded bundle/subgraph refresh remains untouched.
