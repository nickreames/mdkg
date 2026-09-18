---
id: bug-17
type: bug
title: Public graph bundles include ignored live queue databases and checkout-local state
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-17-progress.json, .mdkg/artifacts/goal-86/bug-17-transport-intake.json, .mdkg/artifacts/goal-86/bug-17-transport-progress.json, .mdkg/artifacts/goal-86/bug-17-portable-contract-progress.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json]
relates: [test-479]
blocked_by: [task-834, bug-35]
blocks: []
refs: [dec-94]
context_refs: [goal-84, goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-15
---

# Local Implementation Result - 2026-09-15

Current disposition: locally verified implementation, not final launch acceptance.
`.mdkg/artifacts/goal-86/bug-17-local-verification.json` binds the current source,
affected-version probe, parent reproductions, single candidate-review cycle,
positive compatibility controls and exact intermediate installed artifact.
This supersedes current-status claims below; all historical evidence is retained.

The shared classifier covers producer and consumer state, included configurations,
unselected child policy, nested ownership, spelling variants and alternate index
representations. A fresh manifest-bound declaration cannot override conventional
runtime exclusions merely because its owning config is absent. Actual config
still permits explicit private checkpoints, including runtime-directory siblings.
Held snapshots bind projection/body use, ZIP receipts and template application.
Historical policy-less public snapshots remain bounded inspection-only.

All 118 focused and 1,457 discovered tests pass on Node24.18.0/macOS, with zero
failures/skips and unchanged source during the full run. One immutable 223-file
intermediate package passes22 CLI-only transport scenarios on Node24.15.0,
24.18.0 and26.0.0. Installed bundle/subgraph/visibility smokes and the separate
built-source capability smoke pass. CLI/docs/workflow, graph and SQLite checks
pass. The package still says0.5.2; it is not the final0.6.0 artifact or seal.

The original live-payload inclusion reproduces against the retained historically
verified published0.5.2 installation. New portable-contract bypasses are specific
to the unreleased candidate. No fresh registry verification or advisory is claimed.

Final test479/platform qualification, fresh Standard and task828 independent
acceptance remain open under Goal86. Local bug closure must not create a dependency
cycle with those gates or count as security clearance. Task827/test477 retain the
separate parent-workspace versus independent-root event-history qualification
observation; no history was relabeled to repair old smoke setup.

Protected selection, runtime DB, Demo3 bundle and Git index match their bookends.
No staging, commit, scan, remote/provider action or canonical bundle refresh.
Skill candidates: none. Next bounded implementation lane: Bug39.

# Current Successor Contract - 2026-09-13

Finish the accepted transport contract after Bug35's narrow overlapping helper
work. Dec94/95 policy choices are resolved: omit live checkout state in both
profiles; public omission receipts distinguish private DB payloads; preserve
intentional private portability. Old policy-less public bundles are inspect-only
until a fresh safe export exists. Preserve the partial patch, never rebuild
canonical bundles or guess a historical materialization policy.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Current decision: dec-94 accepts inspection-only preservation of historical
config-less public bundles until a fresh safe export is available. Source absence
does not authorize guessed materialization. The previous policy blocker is
resolved; this bug is in progress, not fixed. Preserve the partial transport patch and
finish the shared producer/consumer contract and independent verification.

Bundle exclusions omit the configured live DB runtime and most checkout-local state. A public workspace's .mdkg/db/runtime/project.sqlite, journals and queue payloads are recursively packaged as authored public files despite runtime policy explicitly marking them local and ignored by Git.

Severity: medium. Private local task payloads, errors and execution ownership may be included in an artifact meant to contain public project memory. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/bundle.ts:368.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Bundle collection treats all remaining .mdkg files as authored knowledge, relying on a short fixed exclusion list rather than configured runtime/transport policy.

# Fix Plan

Exclude configured live runtime DBs, sidecars, locks, local selection and transient execution state using one transport classification contract. Keep intentionally sealed portable snapshots/evidence distinct from live runtime files.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Synthetic queue secret markers never occur in public or portable bundle contents.
2. Configured nondefault runtime paths and SQLite sidecars are excluded.
3. Intentionally sealed portable DB snapshots retain explicit supported behavior.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key db-runtime-public-bundle; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.

## 2026-09-15 Portable Contract and Candidate Review

The current snapshot and remaining gates are bound in
`.mdkg/artifacts/goal-86/bug-17-portable-contract-progress.json`. This supersedes
only the current-status statements in the earlier progress receipt; all earlier
evidence remains historical and unchanged.

Fresh exports now carry a versioned, manifest-bound portable-state declaration.
Both validators and consumers check file roles, profile, included configuration,
workspace ownership and projections. Public declarations expose no excluded
private names or payload hashes. Selected private checkpoints remain portable;
live state and checkout authority do not. Historical policy-less public bundles
remain inspection-only. The declaration is structural, not authentication or
authority to execute or write a graph.

Body/capability projections, ZIP hash receipts and template apply now bind to the
same validated source snapshot. One independent read-only candidate review found
two parent-reproduced bypasses: unselected-child custom state leakage and ignored
child-only owning configuration. Both have narrow corrections and regression
coverage, including positive private-portability controls.

Post-review evidence: 106 focused tests and all 1,445 discovered tests pass on
Node24.18.0/macOS, without skipped tests or source movement. The earlier 1,440-test
run predates the review corrections and is retained as intermediate history.
Bug17 remains progress pending bounded representation checks and current installed
qualification. Final macOS/Linux, fresh Standard and task828 acceptance remain
mandatory; this review is not security clearance or a 0.6.0 artifact seal.

Main HEAD, selected Goal73, runtime DB, protected Demo3 bundle and Git index remain
unchanged. No staging, commit, scan, canonical bundle refresh or external action.
Skill candidates: none.

## 2026-09-15 Goal86 Intermediate Remediation

Explicit Goal86 Run and completed task834 custody authorize this continuation.
The fresh read-only investigation and parent reproductions are bound in
`.mdkg/artifacts/goal-86/bug-17-transport-intake.json` and
`.mdkg/artifacts/goal-86/bug-17-transport-progress.json`. They do not replace the
historical Standard report or constitute fresh security clearance.

The shared classifier now covers configured/relocated caches and custom graph
roots, state-contained child discovery, filesystem spelling, public omission
reasons and private portable siblings while retaining deepest ownership and
deterministic output. Historical consumer admission, actual profile enforcement,
expected-profile rechecks and pre-existing temporary-directory preservation are
under passing source regression. Bounded old public inspection is preserved.

Current evidence: build/test build pass; final focused snapshot67/67 tests pass.
A preceding broader95/95 run includes graph/subgraph and the288-case observational
Git fixture; it predates the final conventional nested-cache regression correction.
These are built-source macOS intermediate results, not final installed qualification.

This bug remains progress, not done. Fresh public exports do not yet carry their
required portable-state contract and currently remain inspect-only. Next complete
that producer/consumer contract without exposing excluded private paths or treating
self-reported hashes as trust/execution authority. Qualify selected-child private
portability, contradictory/malformed policies, both manifest validators, alternate
representations and projection/body snapshot candidates. Then conduct the single
fresh read-only candidate review, installed/runtime/platform qualification and
independent task828 acceptance. No policy waiver or new publication authority.

All changes remain unstaged/uncommitted on unchanged main HEAD3820529620.
Selected Goal73, runtime DB, Demo3 bundle and Git index hashes match. No lease,
scan, remote Git, provider, publication or canonical bundle refresh occurred.
Skill candidates: none.

## 2026-09-08 Prepatch Investigation and Public Export Decision

Parent and one independent source-only investigator confirm the producer and
legacy/versioned ZIP clone/fork/materialization paths need shared transport
classification. Exclude configured live DB files, sidecars and checkout state
before payload reads, independently of graph version. Runtime paths may share a
parent with portable files; do not exclude that entire directory blindly. Check
alternate generated-index representations when runtime paths overlap graph roots.

EDD-12 permits deliberate portable schema/manifests/receipts/snapshots. EDD-13
explicitly defers public DB export/redaction. Sealing copies the complete DB and
does not establish public safety; paused/settled queues and receipt details may
retain private payloads. Nick has been asked to choose public omission with an
explicit exclusion receipt (recommended) or rejection when DB payloads exist.
Private portable snapshot/receipt compatibility remains required; no redaction,
provider action, canonical bundle rebuild or payload inspection is authorized.

No source implementation or reproduction yet. Await this material policy choice
for the affected lane, while independent bugs 5–7 can continue. Final task-828
verification is still required. No new skill candidate.

## Accepted State and Export Alignment

Nick approved public omission of private DB snapshots and DB receipt payloads
with explicit exclusion receipts. Preserve deliberate private portable snapshots
and receipts; exclude live runtime databases, sidecars and checkout authority in
both profiles. No automatic redaction or authority restoration is implied.

Git-native memory centers on distilled intent, decisions and accepted project
evidence. Full operational work receipts, accounting and reputation belong to
consumer-owned stores, not new mdkg business schemas. Agent-owned graphs each
have one writer; parent agents may read authorized descendant graph nodes without
inheriting write authority. Registered subgraph projections remain snapshots,
not proof of current descendant state. This consumer mapping does not make agent
scheduling or dynamic federation part of the bounded export fix.

The export policy question is resolved. Continue the existing bug and final
qualification under the accepted local-only authority; no consumer changes or
coordination dispatch, canonical bundles or live DB contents are authorized.

## 2026-09-08 Partial Transport Remediation

The initial producer fix and configuration-bearing consumer fixes are implemented,
but this bug is not closed. Evidence is `.mdkg/artifacts/goal-84/bug-17-progress.json`:
18 focused regressions, 78 installed-package cases, and 1036 source plus 26
release/security-contract tests pass on Node 26.0.0. CLI/docs checks pass. Source
hashes and the intermediate package integrity are recorded; neither constitutes
the final 0.6.0 seal. All changes remain unstaged/uncommitted on main.

Legacy clone/fork previously bypassed state exclusions before the v2 branch.
Private materialization also restored configured runtime files. Both are now
covered by reproductions and passing controls. Changed owning-config bytes in a
ZIP previously bypassed manifest integrity verification; consumers now verify
before interpreting policy or creating the graph target. Custom DB-root remnants,
portable checkpoint siblings, nested configuration, and graph-authority overlaps
are covered. Intentionally private portable bytes remain unchanged.

One new compatibility decision remains: public bundles intentionally omit owning
configuration, so old config-less snapshots cannot identify arbitrary configured
runtime paths. Recommendation sent to Nick: preserve inspection, but require a
fresh export with an explicit portable-state contract before materialization.
No new public-bundle compatibility behavior is implemented yet. Do not infer
execution authority from the future contract, a self-hash, or graph selection.
Finish alternate-representation review and the one independent candidate review
after this boundary is resolved; task-828 remains a separate final gate.

The full qualification goal is not globally blocked by this decision: task-824
has completed prerequisites and can proceed read-only against a frozen candidate.
Protected selection, runtime DB, and Demo 3 bundle hashes remain unchanged.
No new skill candidate, writer lease, commit, push or publication.
