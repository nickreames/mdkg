---
id: goal-86
type: goal
title: Complete mdkg 0.6.0 remediation and launch qualification
status: progress
priority: 1
goal_state: active
goal_condition: Every publication blocker independently verified, complete macOS and Linux installed qualification and fresh security coverage accepted, full release ladder passed and exact 0.6.0 artifact sealed without publication.
scope_refs: [task-834, bug-40, bug-35, bug-17, bug-39, bug-41, bug-42, bug-43, task-835, task-836, task-827, task-838, bug-44, bug-45, bug-46, bug-47, bug-48, bug-49, bug-50, bug-51, bug-52, bug-53, bug-54, bug-55, bug-56, bug-57, bug-58, bug-59, bug-60, task-839, test-488, test-477, test-478, test-479, test-480, test-481, test-482, test-483, test-484, test-486, test-487, task-826, bug-7, task-837, task-828, task-829, task-830]
active_node: bug-54
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run docs:check, npm run ci:workflow:check, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, node dist/cli.js db index verify --json, git diff --check]
max_iterations: 75
blocked_after_attempts: 3
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/planning-receipt.json, .mdkg/artifacts/goal-86/execution-baseline-20260915.json, .mdkg/artifacts/goal-86/requirement-coverage.json, .mdkg/artifacts/goal-86/observational-boundary-verification.json, .mdkg/artifacts/goal-86/bug-17-local-verification.json, .mdkg/artifacts/goal-86/bug-39-local-verification.json, .mdkg/artifacts/goal-86/bug-41-local-verification.json, .mdkg/artifacts/goal-86/changed-warning-intake.json, .mdkg/artifacts/goal-86/bug-42-local-verification.json, .mdkg/artifacts/goal-86/bug-43-local-verification.json]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-83, goal-84, goal-85, goal-75, dec-93, dec-94, dec-95, dec-96, edd-82, task-825, task-833, test-485]
evidence_refs: [chk-608, chk-609, chk-610, chk-611, chk-612, chk-613, chk-614, chk-615, chk-616, chk-617, chk-618, chk-619, chk-620, chk-621, chk-622, chk-623, chk-624, chk-625]
aliases: []
skills: []
created: 2026-09-13
updated: 2026-09-21
---

# Objective

Complete mdkg 0.6.0 remediation and launch qualification as generic OSS project
memory infrastructure. This is the sole future execution lane for the remaining
Goal83/84 work, not a replacement for their accomplishments or acceptance duties.
Goal85 remains the separate paused publication lane.

# End Condition

Return LOCAL_READY_NOT_PUBLISHED only when every required case, macOS/Linux
platform gate, fresh Standard audit, independent remediation diff, full ladder,
and exact artifact seal is complete and chk570 is accepted. Otherwise return
NOT_READY with exact failing or missing gates. No claim of undiscovered-bug absence.
Goal83/84 may close only when their preserved original conditions are actually met.

# Non-Goals

Owner: mdkg-project-agent, one writer in this checkout. The explicit Goal 86 run
on 2026-09-15 authorizes the fully planned bounded implementation, local validation,
evidence and reviewed explicit-path local commits on main. Planning-only labels in
the original package describe its pre-run state, not a continuing implementation
prohibition. Selected state does not authorize or expand this run.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

Keep compact default init with graph-only/--agent compatibility, explicit v2
adoption, stable graph/node identities with numeric aliases and native Git
worktrees. No Git mutation wrappers, product-specific policy, federation, remote
skill distribution or autonomous self-improvement additions. Operational
execution, authentication, scheduling, accounting, reputation and full economic
receipts remain consumer-owned. Do not migrate other projects or rewrite their
instructions. Windows is unqualified, not silently supported or newly blocked.

# Recursive Algorithm

1. Task834 re-inventories branch/HEAD, cached upstream, exact dirty custody,
   locks/leases, source/package/evidence hashes, current graph and preserved state.
   No scan or mutation starts from the historical baseline alone.
2. Finish Bug35's narrowly owned observational Git helpers, preserving the
   overlapping Bug17 patch; then finish Bug17 transport policy and Bug39 refusal.
3. Tasks835/836 implement the accepted writer-admission and evidence-bound
   interrupted-writer recovery portions of Bug7. Their local implementation
   checks precede the final installed families; Bug7 is aggregate acceptance.
4. Task827 prepares final draft 0.6.0 metadata, breaking-change/upgrade/native-Git
   guidance and finalized package inputs. Create one frozen candidate tarball
   for qualification. Task830 later seals those same bytes, never repacks them.
5. Execute tests477-481 and483/484/486 using installed bytes; test482 binds all
   runtime results and test487 requires macOS/Linux proof. Task826 accepts this
   matrix, then Bug7 closes its missing-qualification obligation.
6. Task837 conducts a fresh Standard repository audit after known remedies and
   draft metadata. Read-only review can overlap fixture execution only while the
   reviewed source stays frozen. Persist its exact complete or incomplete coverage.
   The completed historical task825/scan remains immutable background evidence.
7. Route every new confirmed blocker to Goal84 and this scope with deduplicated
   bug, affected version, regression, bounded remedy and verification requirement.
   Do not turn pending audit candidates into confirmed defects or alter old counts.
8. Task828 independently reviews the complete remediation range, deleted files
   and supporting behavior; then task829 runs the full unchanged-threshold ladder.
   Any new fix invalidates affected reviews, test evidence and candidate inputs.
9. Task830 seals the exact artifact and chk570 accepts all gates. Record reviewed
   local commits, remaining dirty custody and ownership release. Leave Goal85
   paused for fresh publication approval and task831 artifact/blocker rechecks.

# Required Skills

Use the listed grounding/pursuit/closeout skills. Fresh Standard and later diff
reviews use the installed Codex Security workflows and capability preflight.
Keep source reviewers read-only and offline. Do not start replacement scans for
failed preflight, silently change global Codex configuration, or count incomplete
coverage as clearance. Raw reports stay plugin-owned; repository evidence is
sanitized summaries, hashes, dispositions and regression references only.

# Required Checks

Complete ordinary tests and manifest-backed full local release ladder; floors
remain 89 percent lines,77 percent branches,96 percent functions. Require complete
test discovery, CLI/help/contract/docs/MCP/seed/native-skill/package parity, full
and changed-only graph validation, supported SQLite index verification and diff
checks. Record exact Node24.15.0, supported24 and26 executable versions/hashes.
All six fixture families use installed tarball bytes and isolated caches/config.
MacOS and Linux proof is required before publication; Windows remains unqualified.

# Acceptance Criteria

- Requirements have historical, current-intermediate, final-artifact-pass,
  failure or unverified dispositions; no missing case is counted as pass.
- Actual recorded0.5.2 upgrades preserve customized root instructions, project
  docs and skills; repeat/stale/interrupted/recovered upgrades are verified.
- Two actual linked worktrees preserve shared graph identity, distinct node IDs,
  colliding aliases and uncommitted cross-links; selection/indexes/locks/journals/
  caches/runtime state stay checkout-local. Same-checkout second writers refuse.
- Pin target/incoming/ancestor; review and apply reconciliation before native
  Git merge, explicitly commit the reviewed graph, perform the ancestry-preserving
  merge and resolve graph paths to the exact reviewed result. Never blanket-ours
  .mdkg. Validate combined source plus graph, commit the merge and verify ancestry,
  repeated integration, cherry-picks/reverts, deletion/reintroduction and receipts.
- Qualify submodule/gitdir-indirection separately. Retain clear failure evidence
  rather than weakening guards or declaring unsupported topology proven.
- Stale plans, abrupt termination, malformed inputs, containment, real read-only
  filesystems, JSON/SQLite parity, packs/MCP, work/archive references, scale and
  lifecycle/blocker routing have case-level evidence and untouched Git staging.
- Task309's historical alias-shaped mdkg URI remains evidence-bound: never invent
  identity, rewrite its history or remove a blocker merely to migrate a fixture.
- Independently resolve the ancestor-swap and ACL/ownership preservation limits
  in task828/test487. Documentation alone cannot waive an in-scope security defect.
- Verify task833's extraction manifest and npm exclusion without consumer dispatch
  or adoption claims. Retain generic receipt semantics; local structural proof
  is not external execution/payment/attestation authenticity.
- Preserve measured slow-transaction limitations. Large-transaction redesign is
  post0.6 unless correctness or a mandatory gate fails; no arbitrary weaker limits.
- Seal SHA256, SHA512 integrity, package file/input manifests, source revision,
  runtime/platform identities, both current security reports and validation.
  Evidence-only commits may follow; package-input changes invalidate the seal.

# Definition Of Done

Chk570, task828, task829, task830, task837 and test487 have complete bound evidence,
no Goal84 publication blocker remains and protected bookends match. Report-only
goal evaluate or goal done cannot substitute for artifact or authority checks.
The current planning pass does not satisfy any execution or publication gate.

# Stop Conditions

Unknown dirty ownership, moving baseline, concurrent writer, material new
product/security choice, required global/host configuration or excluded action.
Linux prefers an existing local executor after endpoint/image/isolation checks.
Do not start/reconfigure services; missing local capability or hosted CI needs
precise separate authorization and remains a blocking evidence gap.

# Current State

2026-09-21 Bug54 bounded local remedy verified (chk-631): exact safe-integer
allocation, source-fresh alias admission, prospective validation and reviewed
SQLite batch reservations prevent hangs and duplicate/invalid authored IDs.
Preserved bundled templates, portable IDs and explicit legacy relationship
staging.1816/1816 full tests,147 final compatibility checks and258 installed
cases pass; Node24.15.0/24.18.0/26.0.0 use one230-file intermediate package
7bf5c746dc35a36e6efdee7ce7d6a6a0e2fabdb36c842e112b23abbbbeb1f3e4.
One fresh read-only candidate review identified three addressed admission gaps;
the superseded full run's three compatibility failures remain recorded. Nine
of14 retained findings now have local remedies; Bugs46/47/55-57, adjacent
Bugs58-60, Task828, Linux qualification, full ladder/coverage and final seal
remain open. Protected Goal73/runtime/Demo3 bookends match. No blocked context
accessed, old artifacts recovered or blocked findings rerun. Next: Bug55 loop
seed containment. Goal85 stays paused; release NOT_READY; skill candidates none.

2026-09-21 Bug53 bounded local remedy verified: reject multiply linked init
manifests before initialization and guard descriptor/path custody at the writer;
retain ordinary single-link inode metadata.1730/1730 full,59 focused and111
installed cases pass on macOS arm64. Installed Node24.15.0/24.18.0/26.0.0 use
intermediate tarball166ce48297af02aff57036686e4e343161e99aa6b48a1cf712e96afd17dae10a.
Fresh agent creation hit the session limit; parent separate review fallback is
recorded, not independent acceptance. Eight of14 retained findings now have
bounded local remedies; six remain open plus adjacent Bugs58-60 and final gates.
Native namespace races and general ACL/metadata work remain Bugs46/47. No blocked
context accessed or recovered. Next: Bug54 numeric-ID safety. Goal85 paused;
release NOT_READY.

2026-09-21 Bug52 local verification complete: complete canonical approved-plan
binding before recovery effects; unbound legacy journals refuse automatic
continuation without alteration.1718/1718 full tests,82 independent focused and
219 installed cases pass. Installed Node24.15.0/24.18.0/26.0.0 on macOS arm64
share intermediate tarball2e31963463aeb550272a5204a4b90cda93fa172d06f399ef1a526191fd82ade3.
One independent source-only review found no concrete surviving in-scope bypass
or new regression. Seven of14 retained findings now have local remedies; seven
remain open, plus adjacent Bugs58-60 and platform/security/ladder/seal gates.
No blocked context accessed or recovered. Native filesystem architecture remains
Bugs46/47. Next independent remedy: Bug53 hard-linked init manifest peers.
Goal85 remains paused; release NOT_READY.

2026-09-21 Bug51 local verification complete: contained regular-file admission
for snapshot/manifest/runtime and implicit SQLite sidecars; bounded manifests,
streamed DB hashes and explicitly read-only observational opens. Frozen-source
1670/1670 full,117 focused,237 installed and9 staged/unstaged custody cases pass
on macOS arm64. Installed Node24.15.0/24.18.0/26.0.0 share exact intermediate
tarball b734379203b4887daea7ba1a45b8a38fcd89675a294ec5b2d72bbe854fbbf681.
One independent source-only candidate review found no concrete surviving in-scope
bypass. Six of14 retained findings now have local remedies; eight remain open,
plus adjacent Bugs58-60 and final platform/security/ladder/seal gates. No blocked
context accessed or recovered. Native SQLite pathname races and metadata/ACLs
remain Bugs47/46; other observational SQLite paths remain Bug60. Next independent
remedy: Bug52 upgrade-journal plan binding. Goal85 paused; release NOT_READY.

2026-09-21 Bug50 local verification complete: regular-file input admission and
mandatory-check aggregation prevent false-valid snapshot receipts. Frozen-source
1664/1664 full tests,71 focused and78 installed cases pass on macOS arm64;
26 cases each use Node24.15.0/24.18.0/26.0.0 and exact intermediate tarball
d520a0c1f94e439765091eaeebe60569d1ee60f263ccb5aff1ca6f0b0568e531.
One independent candidate review found no concrete surviving bypass in this
bounded control. Five of14 retained findings now have local remedies; nine
remain open plus adjacent Bugs58-60 and final qualification. This does not
resolve linked-input authority (Bug51), metadata/ACLs (Bug46), or ancestor races
(Bug47). No blocked context accessed or recovered. Next independent remedy:
Bug51 snapshot input containment. Goal85 stays paused; release NOT_READY.

2026-09-21 Bug49 local verification complete: contained registry admission before
skill effects and at refresh, plus preflighted UTF8 output bounds. One completed
candidate review found a reproduced/corrected budget regression. Frozen-source
1658/1658 full tests,164 focused and57 installed cases pass on macOS arm64;
installed Node24.15.0/24.18.0/26.0.0 share exact tarball
da3b71ff1f10992272f18c1044b07a261dda807795e1f4b7c380507d8d8a56cd.
Earlier interrupted/build-collision/harness attempts remain explicitly recorded,
not counted as passes. Four of14 retained findings now have local remedies;
ten remain open, plus adjacent Bugs58-60 and final qualification gates. No blocked
context accessed or recovered. Next independent remedy: Bug50 snapshot validity.
Bug46/47 filesystem architecture and final platform/security/ladder/seal remain
open. Goal85 remains paused; release NOT_READY.

2026-09-21 Bug48 local verification complete: bounded config/source/ZIP reads,
164 focused passes and90 installed CLI/MCP cases across the three required Node
versions on macOS arm64. Complete1647-test discovery had1614 passes/33 failures
from unavailable sandbox OS ownership proof; all38 tests in the unchanged
affected family then passed with approved native evidence. Receipts retain both
outcomes. No blocked context was opened and no old scan evidence was recovered.
Local completion is not Linux, Task828, full-ladder or final-artifact acceptance.
Goal85 stays paused; remaining security/adjacent remedies and native-filesystem
design remain in scope. Protected selection, runtime and Demo3 bytes match.

2026-09-21 RESUMED by Nick: continue fixes from retained mdkg evidence. Do not
access blocked scan context, recover its artifacts, or rerun that historical
scan/findings. This supersedes chk624's proposed recovery prerequisite; missing
original files remain a disclosed limitation, not a reason to stop independent
source remedies. Current local regression tests verify new fixes; they do not
reconstruct or re-finalize the old scan. Final release acceptance stays separate.
Nick also approves bounded native-filesystem feasibility/design planning for
Bugs46/47, not dependency adoption or a packaging choice. Preserve current main,
accepted partial custody, selected Goal73, runtime DB and Demo3 bundle. No remote
Git, publication, provider, canonical migration or bundle/subgraph refresh.

2026-09-18 findings-capture checkpoint624: Nick requested a durable inventory and
remediation planning, so no further functional change is being made in this pass.
The completed Standard scan recorded14 confirmed findings (5medium/9low):
Bugs44/45 locally done, Bug46 blocked, Bug48 partial, and10 in backlog. Bugs58-60
remain separately classified correctness/custody/platform gaps. No new duplicate
goal or finding is needed. Goal86 remains the existing execution lane; this
checkpoint does not activate new work or approve native dependencies.

Bug48 independent review plus a bounded parent reproduction confirmed the
selected ZIP reader still admits a blocking final-leaf substitution. Keep its
two-source/three-test partial patch unstaged and unfinished. Earlier155 focused
and69 installed passes are intermediate only; no terminal full-suite result was
recovered. Exact current hashes and observed outcomes are in
.mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json.

The canonical Standard reports and Bug48 temporary receipts/tarball are now
inaccessible at recorded paths in this environment. Sanitized committed findings
survive; report completion is historical, not evidence availability or clearance.
Task838 now covers retained custody and Task828 requires verified originals or
explicitly superseding qualification. Do not infer deletion, provider action,
security-policy rejection or permission to change host/global configuration.
Live workbench context subsequently confirms all14 findings survive and the
actual remediation guardrail is revision mismatch (scanned e42f1d9 versus
current85226b5), with reportAvailable=false. Preserve current main; no rollback,
old-scan re-finalization or new scan is authorized by this findings checkpoint.
The separate Bug46/47 filesystem architecture decision remains unresolved.
Protected Goal73/runtime/Demo3 hashes match; Goal85 remains paused, NOT_READY.

Earlier decision checkpoint (preserved history):

2026-09-18 decision gate: Bugs44/45 are locally verified and committed in
d44831b6/754710c7. Fourteen scoped nodes are done, including the fresh Standard
audit; audit completion is not clearance. Bug46 now has seven reproduced
mode/ACL/group failures and six passing hardlink controls on macOS arm64,
built-source Node26. No Bug46 source patch has been applied. Chk623 preserves
the pending native-filesystem architecture decision and alternatives. The
existing goal remains incomplete, not newly user-paused or achieved. Stop this
execution pass for Nick's decision before adding native/runtime dependencies.
Selected Goal73, runtime DB and Demo3 bundle remain unchanged; Goal85 paused.

2026-09-18: Fresh Task837 Standard scan9d6a2ca2 is complete against frozen
maine42f1d9/draft0.6.0:14confirmed findings,5medium/9low,567fully reviewed files
with explicit exclusions. Bugs44-57 own those remedies; Bugs58-60 separately
own MCP robustness, Git-metadata mirror refusal and observational SQLite
qualification. Tasks838/839 correct harness custody and final release-critical
truth; test488 binds the fresh regression map. Source audit completion is not
clearance. Candidate6957f918 remains unqualified and must be replaced after
package-input changes. Raw reports remain plugin-owned; sanitized hashes and
dispositions are in task-837-standard-security-audit.json. Broader documentation
polish stays deferred, Goal85 paused, and protected selection/runtime/Demo3
hashes are unchanged. Existing completed milestones below remain historical.

Task827 draft metadata and release-critical guidance are locally verified:
package0.6.0, public release draft/unpublished,1,628 source tests,95 focused and
27 release/contract checks pass. Independent bounded guidance review is clear;
CLI/docs/generated parity, local docs smoke and graph/SQLite checks pass. Eleven
scoped nodes are locally done. Final installed/platform/security/full-ladder/seal
gates remain open. Proceed with reviewed local commit and frozen-candidate
qualification; no remote or publication authority. Broader docs polish is later.

Prior local implementation milestone:

Tasks835/836 are locally verified and done under chk617/618: explicit reviewed
schema2 writer fencing plus evidence-bound interrupted graph-writer recovery.
All1,627 source tests pass; coverage91.80/82.80/96.99 exceeds unchanged floors.
The Task836 intermediate package passes11 installed abrupt-termination cases on
each of Node24.15.0/24.18.0/26.0.0. Two independent candidate-review findings were
reproduced and corrected. Task827 draft metadata and release-critical guidance is
next. Ten scoped nodes are locally done; final0.6.0 platform, installed, security,
full-ladder and artifact-seal gates remain incomplete. No release waiver.

RESUMED by Nick on 2026-09-15 after chk616. Fresh custody matches the checkpoint:
125dirty paths, unchanged HEAD, Git index, selected goal, runtime DB and Demo3.
Continue task835 then task836 and core qualification. Linux x86_64 and ARM64
qualification are accepted, with native versus emulated execution identified.
Consumer adoption of unreleased v2 graphs is unknown; this is public alpha, not
a reason to expand into consumer investigation or delay the bounded core fixes.
Broader documentation audit and polish belong in a later goal set. Keep only
release-critical correctness, breaking-change and qualification guidance here.

Historical pause:

PAUSED by Nick on 2026-09-15, with task835 retained as the unfinished resume node.
Chk616 and .mdkg/artifacts/goal-86/pause-checkpoint-20260915.json capture exact
123-path pause-entry custody, completed local remedies, reproduced writer gaps
and remaining qualification gates. No Task835 functional patch has been made.
The app goal is also paused. Supported mdkg pause serializes status blocked plus
goal_state paused; this is a user pause, not a claim that all scope is externally
blocked. No further implementation, fixture execution, scan or Git action is
authorized by an automatic continuation of this paused run.

Prior execution state (preserved history):

RUNNING since the explicit Goal 86 run on 2026-09-15. The fresh inventory matches
all 40 paths left by the completed planning pass, at unchanged main HEAD
38205296208c23fcfcc6fc821a295040be05c0bb. No unknown path, active runtime lease,
queue item or writer lock was found. Task834 completed initial custody and
requirement grounding; Bug35/40 now have narrow local verification and are done.
Bug42 records the wider mounted metadata failure, not a qualification waiver.
Bug17's local remedy is verified:118 focused and1,457 full source tests pass,
plus22 installed transport scenarios per required runtime on the same intermediate
artifact. Final platform and independent security qualification remain open.
Bug39 is done under chk612 with local source, independent candidate-review and
three-runtime installed verification. Its final test486 and security/platform
gates remain open. Bug41 is locally done under chk613 with1,474 source tests and
726 installed cases per required runtime on one unchanged intermediate package.
Bug42 is locally done under chk614 with1,515 source tests and242 installed plus84
actual read-only checks per required runtime on one unchanged intermediate package.
Bug43 is locally done under chk615 with1,521 source tests and16 installed cases
per required runtime on one unchanged intermediate package. Exact changed-warning
paths and read-only state pass; Task835 is next. No release
readiness is inferred from local implementation acceptance.
Selected Goal73, runtime DB, Demo3 bundle and Git index are preserved.
The execution baseline and requirement matrix are in .mdkg/artifacts/goal-86/.
Goal 85 stays paused; publication, remote Git and all other exclusions remain.

Historical planning state:

PLANNED / PAUSED / UNCLAIMED. User approved mdkg-only plan authoring on2026-09-13.
Only a later explicit Run authorizes scoped implementation and reviewed local
commits. Main38205296208c23fcfcc6fc821a295040be05c0bb is50ahead/0behind cached
origin/main;11preserved dirty paths include partial Bug17 source, Bug7/35/17
evidence and a derived SQLite index. Package version is still0.5.2; no live remote
verification. Selected achieved Goal73, released runtime leases, empty queues and
Demo3 bundle remain protected. Baseline/custody are bound in the planning receipt.

# Iteration Log

- 2026-09-18: Task837 current-source Standard audit completed without changing
  frozen source/package bytes. Main e42f1d9 contains the reviewed171-path core
  commit;51ahead/0behind cached origin/main, no remote action. Fourteen fresh
  findings and three adjacent correctness/contract gaps are separately routed,
  with new fixes blocking final test families, task828/829 and publication.
  No finding is waived or earlier achievement reopened. Skills reused; none new.

- 2026-09-17: Task827 local preparation is accepted with draft0.6.0 metadata,
  source-grounded breaking guidance and preserved user customization. All1,628
  source tests pass against unchanged input hashes; independent bounded guidance
  and169-path custody reviews found no unknown implementation. Receipt:
  .mdkg/artifacts/goal-86/task-827-local-verification.json. Final qualification
  remains incomplete. No staging/commit/remote action at this checkpoint.

- 2026-09-18: Task836 local acceptance under chk618 and
  .mdkg/artifacts/goal-86/task-836-local-verification.json. Exact OS/checkout,
  lock-chain, journal-inventory and current-file evidence gates recovery; live or
  insufficient ownership refuses. Full source and coverage each1,627pass;
  33installed SIGKILL cases pass across required runtimes on macOS arm64.
  Final0.6.0/Linux/security gates remain open. No staging, commit, remote action,
  canonical migration or bundle refresh. Task827 next; broad docs polish later.

- 2026-09-15: Task835 local acceptance recorded under chk617 and
  .mdkg/artifacts/goal-86/task-835-local-verification.json. Known old-init limits
  remain explicit; no unsupported mixed-writer claim. Protected bookends and
  canonical schema1 remain unchanged. Three owned installed fixture trees were
  removed after preserving reproducible receipts/package/log evidence. No
  staging, commit, remote/provider action, canonical migration or bundle refresh.
  Task836 next; wider docs audit/polish stays outside the current core pass.

- 2026-09-15: Nick resumed the accepted core implementation scope, confirmed
  Linux x86_64 plus ARM64 coverage and left prerelease consumer adoption unknown.
  Preserve the alpha compatibility policy and release-critical guidance; defer
  a broader documentation/polish goal set. No architecture or publication waiver.

- 2026-09-15: User-requested pause recorded under chk616. Eight scoped nodes are
  locally done (task834 and Bugs17/35/39/40/41/42/43); nineteen remain incomplete.
  Latest1,521-test pass and three-runtime installed results are intermediate,
  not final0.6 acceptance. Task835 has exact old-writer/event-enable reproductions
  but no source fix; task836 recovery is not started. Package stays0.5.2, main
  HEAD3820529 and protected bookends match. No staging/commits during this run.
  Checkpoint-only changes preserve all64non-mdkg dirty paths. Fresh Standard,
  independent diff, macOS/Linux artifact qualification, full ladder and seal are
  still mandatory. Goal85 remains paused. Resume only on explicit instruction.

- 2026-09-15: Bug43 exact changed-warning paths locally verified under chk615.
  All1,521 discovered tests and the three-runtime installed16-case matrix pass;
  candidate review found no blocking defect and coverage distinctions remain
  explicit. Native Git copies/renames, missing caches and global errors are
  preserved. Eleven owned fixture roots removed; package/logs retained. No commit,
  fresh security clearance, Linux pass, final seal or publication. Task835 next.

- 2026-09-15: Bug42 local closure binds authored cache inputs and archive admission,
  fixes both independently reproduced review findings and preserves explicit
  compression/no-reindex behavior. All1,515 source tests and three-runtime
  installed/APFS matrices pass; prior failed runs are retained and invalidated.
  Chk614 and bug-42-local-verification.json record exact bytes, cleanup and limits.
  Linux executor presence alone is not qualification. No staging, commit, scan,
  final seal or external publication; Bug43 remains next.

- 2026-09-15: Bug41 local acceptance covers helper execution, sanitized fail-closed
  observations and exact provenance across native Git topologies. Three reviewed
  hypotheses and the missing-HEAD question were reproduced and corrected; full
  source and all three installed runtime matrices pass. New Bug43 is planned,
  unclaimed and a mandatory prerequisite, not a waived regression. All final
  0.6.0 platform/security/ladder/seal gates remain. No commit or external action.

- 2026-09-15: Bug39's early command/type option contract passes1,463 full and126
  focused tests, complete CLI/docs/contract/workflow checks and three-runtime
  installed proof against one unchanged intermediate tarball. Both candidate
  review findings were reproduced and corrected. Thirteen initial full-suite
  failures were old diagnostic expectations or ignored unsupported fixture flags;
  the aligned tests retain their safety assertions and pass. Evidence is
  bug-39-local-verification.json. No scan, final0.6.0 qualification, Linux pass,
  seal, staging/commit or external action is inferred. Goal85 remains paused.

- 2026-09-15: Bug17 local verification completes the shared transport contract,
  candidate-review corrections and additional parent-reproduced representation
  gaps, including config-less private runtime admission. All118 focused and1,457
  discovered tests pass; the same223-file intermediate tarball passes22 installed
  cases on each Node24.15.0/24.18.0/26.0.0, installed bundle/subgraph/visibility
  smokes and separate built-source capability smoke. Evidence is
  bug-17-local-verification.json. Prior artifacts remain historical; final0.6.0,
  Linux, Standard, independent diff and full-ladder gates remain unqualified.
  Parent-workspace smoke setup now uses explicit graph-only init without event
  rewriting; independent-root re-aliasing is not qualified by those controls.

- 2026-09-15: Bug17 fresh portable contract, held-snapshot consumers and two
  parent-reproduced candidate-review fixes pass106 focused and1,445 full tests
  on Node24.18.0/macOS with unchanged source hashes. The new
  bug-17-portable-contract-progress.json preserves earlier receipts and explicitly
  leaves current installed, macOS/Linux final-artifact and security gates open.
  No source clearance, final seal, commit or publication is claimed.

- 2026-09-15: Bug17 intermediate remediation has67/67 current focused tests and
  a preceding95/95 broader run including288 observational Git cases. Five
  historical-consumer gaps and two temporary-name cleanup failures reproduced
  before their local corrections. Fresh public portable-state contract, remaining
  projection candidates, single candidate review and installed/final qualification
  remain open; Bug17 stays owned progress. Exact source hashes and limitations are
  in bug-17-transport-progress.json. Protected bookends and main HEAD unchanged;
  no staging, commit, scan or external action.

- 2026-09-15: Bug35/40 narrow source remedies pass 1,409 tests and the same
  installed tarball passes 288 Git-observation cases on each required runtime.
  Actual read-only APFS inventories and preview writes are preserved across36
  mounted variants. The wider semantic matrix nevertheless fails12 show/search
  checks because copied legacy caches hide current titles; new Bug42 owns this
  blocker after Bug41 and before finalized package inputs. No blanket mounted
  qualification, Linux pass, security clearance or final artifact seal is claimed.

- 2026-09-15: Current-source Bug35 reproduces 14 of16 index-custody failures;
  git inspect already passes. Four optional-lock helper corrections are under
  regression. Separate published0.5.2/current reproductions confirm Bug40 dry-run
  mutation locking and Bug41 configured-helper execution. Both are bounded
  functional blockers under this run and Goal84, not new Standard findings.
  Bug40 precedes completion of Bug35's absent-cache worktree regression; Bug41
  follows Bug39 and precedes writer compatibility/draft inputs. Final independent
  and installed platform gates must reverify both. No accepted product boundary changes.
- 2026-09-15: Explicit run accepted. Resumed this goal without selection mutation,
  claimed task-834, reverified 40-path custody, bound 1,855 source paths and 254
  package-input paths, checked 152 extraction payloads, and mapped 25 requirement
  groups plus 23 work contracts and 55 historical receipts. Release remains NOT_READY.
- 2026-09-13: Approved plan authored; no source fix, scan, test qualification,
  release metadata change, execution claim, staging, commit or publication.

# Skill Improvement Candidates

None. Reuse existing skills; no skill authoring or consumer-specific candidate.

# Completion Evidence

Chk623 and bug-46-investigation.json record a verified defect, NOT a remedy.
They retain the source-bound reproduction, native metadata evidence and the
architecture decision required before altering the pure-Node runtime contract.
Bug46 remains a publication blocker. This does not waive remaining independent
remedies, platform coverage, Task828, full ladder or exact artifact sealing.

Chk622 and bug-45-local-verification.json bind the transport-admission remedy:
complete path/ownership checks and configured cache-output admission precede
import writes; supported historical/private transport is retained. One fresh
candidate review exposed the derived-output route, which the parent reproduced
and corrected. Final154 focused tests and167 installed cases on each required
Node runtime pass on macOS arm64. Linux and final release gates remain open.

Chk620 binds completed fresh Standard coverage and fourteen confirmed findings;
this is not a clean security bill. Chk621 and bug-44-local-verification.json bind
the first new finding's local remedy, one candidate-review cycle with two
reproduced/corrected gaps,67 focused source tests and49 installed scenarios each
on Node24.15.0/24.18.0/26 macOS arm64. Remaining remedies, Linux, test488/Task828,
full ladder and final artifact qualification/seal remain open. Broad docs polish
is deferred; release-critical truth correction remains Task839. Goal85 stays paused.

Chk608 proves planning only; chk609 and the execution baseline prove task834's
accepted custody. Chk610 binds Bug35/40's local verification and Bug42's failing
qualification. Chk611 binds Bug17's local transport verification. Chk612 binds
Bug39's local option admission and intermediate installed verification. Chk613
binds Bug41 helper-free observations; chk614 binds Bug42 cache-content/archival
admission and intermediate installed verification. Chk615 binds Bug43 exact paths,
review and intermediate installed qualification. Chk617 binds Task835's explicit
writer fence, recovery custody, independent candidate review and intermediate
installed proof. Chk570 remains
incomplete. Chk618 binds Task836 interrupted-writer implementation; Task827's
local-verification receipt and chk619 bind draft0.6.0 metadata and release-critical guidance.
Final installed/platform/security and artifact acceptance remain
incomplete. No final artifact, Linux acceptance,
fresh security clearance or publication is claimed.
