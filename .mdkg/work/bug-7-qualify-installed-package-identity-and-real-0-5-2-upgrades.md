---
id: bug-7
type: bug
title: Qualify installed package identity and real 0.5.2 upgrades
status: progress
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-progress.json, .mdkg/artifacts/goal-84/bug-7-recovery-runtime.json, .mdkg/artifacts/goal-84/bug-7-legacy-writer-barrier.json, .mdkg/artifacts/goal-84/bug-7-graph-recovery.json, .mdkg/artifacts/goal-84/bug-7-mcp-read-parity.json, .mdkg/artifacts/goal-84/bug-7-work-archive.json, .mdkg/artifacts/goal-84/bug-34-verification.json, .mdkg/artifacts/goal-84/bug-7-scale-goal.json, .mdkg/artifacts/goal-84/bug-7-nullable-read.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-progress.json, .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json, .mdkg/artifacts/goal-84/bug-7-init-discovery.json]
relates: [task-826]
blocked_by: [task-824]
blocks: []
refs: [chk-586, chk-587, chk-588, chk-589, chk-590, chk-591, bug-33, bug-34, test-481, test-482, chk-595, chk-596]
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-09
---

# Overview

Current source/unit tests do not establish installed-package identity behavior or a real published 0.5.2 upgrade. Missing required compatibility evidence blocks publication.

Owner and qualified execution scope: goal-84. Source evidence: Goal 82 installed-package qualification absent from current smoke manifest.

# Reproduction Steps

Reproduce the stated gap against the frozen baseline, then the installed candidate; preserve exact source and package identity.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the known defect/evidence gap remains unresolved at intake.

# Suspected Cause

Current source/unit tests do not establish installed-package identity behavior or a real published 0.5.2 upgrade. Missing required compatibility evidence blocks publication.

# Fix Plan

Add manifest-backed installed tarball fixtures covering actual 0.5.2 upgrade and complete identity/reconciliation/legacy semantics across approved runtimes.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Actual published 0.5.2 tarball integrity and installed upgrade, not a mock legacy seed
2. Default compact init, --graph-only and --agent compatibility
3. Customized AGENTS/CLAUDE and project README/LICENSE preserved
4. Repeated preview/apply, stale plan, interrupted upgrade and recovery
5. Native skill mirrors, resource links and rollback compatibility
6. Two offline local branches create colliding numeric aliases and cross-linked stable identities
7. Ordinary commands work on uncommitted, staged and unstaged authored nodes
8. Different identities remap deterministically; same-identity changes use real ancestry
9. Lifecycle/evidence conflict, delete/modify, repeated integration and explicit reintroduction
10. Cherry-pick/revert and newer ancestry preserve immutable external receipt bytes

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

## Fresh Nullable Read Optimization

Chk595 and bug-7-nullable-read.json verify a bounded source improvement: graph
transaction value reads no longer repeat existence-check containment traversal.
All per-write custody and fresh byte/dependency/control checks remain. Initial
absence alone returns null; disappearance after presence remains an error.
The 1368-test runtime suite passes; final regression-only refinements pass 25
focused checks and eight installed reader tests on each required runtime.

The installed Node26/JSON 2000-node migration completes and validates in 272214 ms
versus 329196 ms in the preceding isolated profile, with identical authored input
bodies and event streams. This 17.31% paired reduction is not a universal speedup,
new product SLA or full scale-matrix acceptance. Keep the representative graph
size; plan the remaining runtime/backend qualification using explicit measured
execution allowances, never weaker custody checks or silently reduced coverage.
No pending compatibility policy, final security review or release gate is waived.

## 2026-09-09 Installed Goal Routing and Scale Gap

The reusable installed-scale-goal harness passes 15 control cases (262 commands)
on each of Node 24.15.0, 24.18.0 and 26.0.0 with 100-node graphs and 20000 events.
JSON/SQLite and legacy/v2 reads are observational. Both publication gate orders,
reopened gates, task/checkpoint/goal completion, stable last-active identity and
unchanged Git index/selection pass. Default node/event size limits and actual
2049-commit history reject oversized input with exact diagnostics and no writes.
Goal routing is not an artifact verifier or publication authority enforcer.

The 2000-node matrix remains incomplete: migration apply exceeded the explicit
180-second harness timeout on all three runtimes concurrently and on Node26 in
isolation. The isolated process terminated after 1086 of 2000 task headers had
migrated; its journal and fixture remain private. This is a qualification gap,
not an invented product latency limit or proof of data loss. Source confirms a
full custody inventory/content scan before each write, yielding quadratic work.
Next: profile and improve measured cost without weakening containment, dependency,
control, current-byte or unknown-path guarantees; retain the representative scale
target and report any longer diagnostic allowance explicitly. No new policy or
automatic lock recovery was accepted. Exact proof and harness corrections are in
.mdkg/artifacts/goal-84/bug-7-scale-goal.json. Existing compatibility decisions,
task-828 final security, complete release ladder, metadata and seal remain open.

Initial approved plan and chk-563/Goal 82 history.

### Completed Scale Diagnosis

The isolated Node26/JSON 2000-node migration now completes under the explicitly
extended profiling allowance: 329196 ms, followed by passing validation, exact
task count and stable identity inspection. Full scale/runtime acceptance remains
open. Chk594 and bug-7-scale-goal.json bind the unchanged candidate, profile and
canonical bookends. Measurements plus independent source review identify the
duplicated containedPathExists/readContainedFile path traversal in value() as a
bounded optimization target. Implement a fresh nullable authority read with
initial-absence-only handling and race/containment regressions; do not cache
filesystem observations or skip per-write custody checks. No source fix, new
performance threshold or compatibility decision has been adopted in this step.

Disposition: open, not fixed, not publication-ready.

## 2026-09-09 Installed Upgrade and Independent Branch Milestone

Chk-586 and `.mdkg/artifacts/goal-84/bug-7-progress.json` record real published
0.5.2 standard/customized upgrades plus independent-clone v2 collaboration on
Node 24.18.0 and 26.0.0. Existing smoke entries retain prior coverage while adding
natural collisions, cross-links, staged/untracked reads, reviewed mappings,
same-identity decisions, stale plans, replay/revert and reintroduction checks.
User documents, custom skills/mirrors, Git staging and external fixture evidence
retain their required treatment. Full source suite: 1341 passed; CLI/docs,
focused contracts and graph checks pass. Fixture corrections are recorded.

Still open: minimum Node 24.15.0, complete installed recovery/delete-modify and
evidence-conflict cases, legacy/old-client compatibility, remaining task-826
families, final independent task-828 review, full ladder and artifact seal.
This milestone does not close bug-7 or authorize publication. Bug-17 remains
separate custody; selected Goal 73 and runtime/bundle bytes are unchanged.

## 2026-09-09 Recovery, Minimum Runtime and Legacy Writer Finding

Chk-587 and `.mdkg/artifacts/goal-84/bug-7-recovery-runtime.json` extend proof to
Node 24.15.0, 24.18.0 and 26.0.0. Six upgrade interruption/resume/rollback cases
per runtime pass, preserving unknown files, original Git bytes and later user
edits on refusal. Both delete/modify directions and evidence conflicts require
explicit reviewed choices and preserve Git staging. The full 1341-test suite,
CLI/docs and graph checks pass. The minimum runtime is now locally available;
its complete final release matrix remains unqualified.

The actual published 0.5.2 client can create a legacy node and update SQLite in
a v2 graph before returning an unknown-key error. This was reproduced on Node
24.15.0 and 26.0.0. The candidate detects missing identities and refuses further
mutation without writes; it does not prevent a separate old binary from writing.
This is deduplicated here as bug-7/legacy-writer-v2-partial-write, not a new
Standard security finding or a compatibility pass. Existing node destruction
was not observed. No source guard, canonical recovery or risk waiver was applied.

Before closure, evaluate an enforceable compatibility barrier for old writers,
or obtain Nick's explicit acceptance of an all-writers-upgraded/no-mixed-writes
v2-adoption policy with complete migration/recovery guidance. Remaining graph
transaction recovery, legacy compatibility and task-826 families still proceed
within existing scope; final task-828 review, full ladder and seal remain open.

## 2026-09-09 Legacy Configuration Barrier Investigation

Chk-588 records 76 warm-cache probes against published 0.5.2 on Node 24.15.0
and 26.0.0. A fixture-only configuration schema 2 causes all 16 tested non-init
commands to refuse before mutation. Old init still writes its manifest;
init --agent writes before refusal, and init --force overwrites core/config and
removes the version fence. Thus a configuration gate can reduce accidental old
writes but cannot enforce full old-client exclusion.

Warm-cache controls also show old task update changes existing-node priority
before failure (identity values survive), and old checkpoint creates legacy
evidence successfully. These extend the existing compatibility finding rather
than duplicate it. Cold-cache refusal is insufficient proof of safety.

Recommend an explicit, journal-bound v2 configuration capability gate plus an
all-writers-upgraded/no-mixed-version adoption requirement, with old-init limits
clearly documented. Nick's policy acceptance is still required. No source guard,
canonical migration or risk waiver was implemented. Continue independent
qualification while that decision is pending.

## 2026-09-09 Installed Graph Recovery Milestone

Chk-589 adds 36 installed migration/reconciliation caught-error recovery cases
across Node 24.15.0, 24.18.0 and 26.0.0, plus 118 focused passing regressions.
Exact resume/rollback, interrupted rollback, dependency/user/control refusal,
Git-index preservation and observational terminal replay are verified. Existing
branch-smoke coverage remains intact; no runtime implementation changed.

A separate abrupt-termination probe confirms an open operational limit:
SIGKILL leaves the writer lock after one authored write. Journal inspection is
observational; resume times out and preserves all files. The owned child was
confirmed terminated on both tested runtimes. No canonical lock was removed,
no automatic takeover was added, and this is not crash-recovery clearance.
Keep this as bug-7/killed-writer-lock-recovery pending a safe supported route;
do not infer abandonment from elapsed time or weaken live-writer exclusion.

Legacy writer adoption policy, remaining installed families/private rehearsal,
bug-17, final security review, release ladder and artifact seal remain open.

## 2026-09-09 Installed MCP and Observational Cache Parity

Chk-590 and `.mdkg/artifacts/goal-84/bug-7-mcp-read-parity.json` record 30
installed v2 scenarios across Node 24.15.0, 24.18.0 and 26.0.0. Stale, warm,
absent and permission-read-only caches preserve current authored content,
stable parent/child identities and all fixture/Git bytes. Switching the same
graph between JSON and SQLite yields identical semantic MCP responses.
The existing legacy MCP workflow remains covered. Fresh full suite: 1341 pass;
CLI/docs parity and diff checks pass. No shipped runtime implementation changed.

This closes a bounded installed-read coverage gap, not bug-7 or task-826.
Work/archive flows, private migration rehearsal, scale, legacy-writer policy,
killed-writer recovery, bug-17 and final independent/release gates remain open.
No permission policy, canonical migration, bundle refresh or publication assumed.

## 2026-09-09 Installed Work and Archive Qualification

Chk-591 and `.mdkg/artifacts/goal-84/bug-7-work-archive.json` record complete
archive/work and direct/queued invocation flows in legacy, v2 JSON and v2 SQLite
on Node 24.15.0, 24.18.0 and 26.0.0. Twenty-four v2 warm/cold checks verify stable
contract/order/receipt/archive links, observational reads and preserved Git/evidence
bytes. Fresh Node 24.18.0 full suite passes 1341 tests; CLI/docs checks pass.
One fixture-only expectation was corrected: source attachments use input_refs,
not artifacts. No new shipped defect or policy approval was established.

Remaining: private migration rehearsal, scale and other installed-family gaps,
legacy-writer and killed-writer treatment, bug-17, independent security review,
draft release guidance/metadata, complete release ladder and exact artifact seal.

## 2026-09-09 Portable Dependency Classification

Bug-34 fixes seven false blockers from MANIFEST/WORK portable skill and tool
labels using the shared identity mapper. The frozen graph hash remains
e6d7aefa52c08983a18150653f445c6efd7c922c83c153379af60f043587f000.
The complete installed preview has 2490 mappings, 2492 proposed writes and one
remaining strict-candidate refusal: task-309 artifacts contains mdkg://goal-10.
That node also contains mdkg://epic-64; both alias-shaped URIs occur in its original
commit 2a8ed49d24e89e92d912968092539f1a53d9effb. No exact stable identity is inferred
from these historical locators. Neither private copy nor canonical graph was
migrated, and no historical body was changed. The unsupported condition remains
explicit here; this is not a release waiver. Evidence is bug-34-verification.json.
Old-writer adoption, killed-writer recovery, remaining scale/lifecycle fixtures,
independent security and final release qualification remain open.

## 2026-09-09 Frozen Private Graph Preview and Output Defect

The exact private graph snapshot at 2be35035 (2,863 files, inventory SHA-256
e6d7aefa52c08983a18150653f445c6efd7c922c83c153379af60f043587f000) validates
as legacy. Its installed migration preview originally exited zero with 65,536
bytes of invalid JSON. A smaller synthetic reproduction confirms stdout and
stderr truncation in both published 0.5.2 and the candidate; route to bug-33.

With the bounded CLI shutdown fix, the same frozen preview returns 2,952,912
bytes of valid JSON, 2,490 mappings and 2,492 proposed writes. It fails closed
with eight explicit blockers: MANIFEST/WORK skill_refs for pursue-mdkg-goal and
verify-close-and-checkpoint and tool_refs for tool.node/tool.npm lack proven
identity bindings (seven diagnostics); task-309 artifacts contains an unresolved
or ambiguous mdkg://goal-10 reference. These require source-grounded classification
before migration qualification can close. Do not invent identities, silently
remove references, or modify canonical nodes to make the rehearsal pass.

No migration was applied, even in the private fixture. Preview preserves the
frozen graph, fixture Git index and contemporaneous canonical graph/Git bytes.
This snapshot predates bug-33 intake and is not a current-canonical migration
approval. Private bodies remain under /private/tmp; durable summaries contain
only counts, diagnostic references and hashes. Bug-7 remains incomplete.

## 2026-09-09 Strengthened Installed Scale Evidence

The earlier 2000-task matrix now passes 15 cases/262 commands on Node24.15.0
and24.18.0 under an explicit bounded test-only allowance. Independent evidence
review identified missing persisted-identity and across-migration event-history
assertions; those receipts remain supplemental rather than complete acceptance.

The harness now verifies the public plan after-hashes, applied state/plan hash,
persisted v2 manifest, complete unique identity inventory and task-only count,
and exact original event bytes. A failed 100-task control exposed an internal
versus public plan-shape assumption; the corrected installed control passes
15 cases/266 commands. Fifteen harness tests pass on each required runtime;
fresh Node24.18.0 full suite passes1383 with no failures/skips. CLI/docs pass.
Read-only review has no remaining bounded finding; it is not task828 clearance.

Evidence: .mdkg/artifacts/goal-84/bug-7-scale-identity-progress.json. Fresh
strengthened 2000-task runs on all three runtimes remain required. Do not close
Bug7, test481, task826 or Goal83 from the small control or older receipts.
Pending compatibility/recovery/public-bundle decisions remain unaccepted.
Selected Goal73, runtime DB, protected Demo3 bundle and separate Bug17 bytes
are preserved. No new product change, skill candidate, commit or publication.

## 2026-09-09 Representative Scale Matrix Verified

Chk-596 and .mdkg/artifacts/goal-84/bug-7-scale-identity-verification.json record
45 strengthened cases and 798 commands passing on Node 24.15.0, 24.18.0 and
26.0.0. Six 2000-task migrations verify every persisted identity/plan hash and
unchanged event history. All 27 successful graph fixtures were removed. This
supersedes the pending strengthened-runtime execution gap above; older control
and 262-command evidence remains historical, not the basis for this milestone.

The full suite passes 1383; CLI/docs/graph/SQLite checks pass. No shipped runtime
change or compatibility policy acceptance occurred. Bug7 stays in progress for
old-writer and killed-writer treatment, historical migration evidence and remaining
installed-family aggregation. Bug17, final task828 review, release metadata,
complete release ladder and artifact seal remain open. No publication readiness.

## 2026-09-09 Installed Compact Init and Discovery

Chk-597 records 24 installed scenario groups and 231 commands across Node
24.15.0, 24.18.0 and 26.0.0. Existing smoke:init coverage is extended, not
replaced: fresh explicit-agent/default/graph-only contracts, user-owned
instructions/docs, complete native resources and observational skill discovery.
One stale removed-flag test expectation was corrected to match current CLI
guidance. Review strengthened canonical resource preservation independently of
mirror equality; twelve verifier controls and the final 1395-test suite pass.

The initial minimum-runtime custody-invalidated run is retained and excluded;
all final runtime runs were serialized with identical bookends. No product
source or accepted compatibility policy changed. The artifact includes the
case-level coverage map and actual remaining gaps. Bug7 remains in progress;
no final security/release clearance, skill candidate or publication action.
