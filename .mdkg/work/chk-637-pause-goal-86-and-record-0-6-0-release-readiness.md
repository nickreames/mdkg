---
id: chk-637
type: checkpoint
title: Pause Goal 86 and record 0.6.0 release readiness
status: done
priority: 9
tags: [release-0.6.0, pause, readiness]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, goal-85, bug-46, bug-47, bug-60, task-838, task-839, test-487, test-488, task-828, task-829, task-830]
context_refs: [goal-86, goal-84, goal-85]
evidence_refs: [chk-636]
aliases: []
skills: []
scope: [goal-86, bug-60]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Paused at Nick's explicit request. Release status: NOT_READY. Goal86 is paused;
Goal85 remains paused and publication is separately gated. The app goal was
already paused when checked. No further implementation, scan, qualification
run or commit is authorized by this checkpoint action.

Evidence-based readiness completion: 26 of47 scoped Goal86 items done =55.3%,
reported as55%. Remaining:17 backlog,1 todo,2 progress,1 blocked. This is an
unweighted checklist measure, not remaining effort, elapsed-time progress,
probability of safety or publication approval. Unequal complexity and final
artifact requalification make a more precise overall percentage unjustified.
Most core functionality exists; final release acceptance is materially behind
implementation. Twelve of14 retained security findings have local remedies
(85.7% remediation count), not final independent release clearance.

# Scope Covered

Current main HEAD c10113489381badf2845fc378c49b317376f953e;67 ahead/0 behind
cached origin/main. No remote verification. No staged paths. Bug60 is the
unfinished owned source unit; the generated SQLite index retains separate
dirty custody. This pause makes no source edits, staging, commits or cleanup.

App-reported cumulative goal execution time was69092 seconds, approximately
19h11m32s. It is execution accounting, not a defensible estimate of time remaining.

# Decisions Captured

Continue using retained sanitized mdkg evidence and current source only upon
future resume. Do not access blocked context, recover blocked reports, or rerun
historical blocked findings. No such access occurred in this work or checkpoint.
No security waiver, architecture approval or scope expansion is inferred.

Open decision: Bug46 needs an approved filesystem architecture capable of
preserving mode/owner/group/ACL restrictions. Bug47 requires descriptor-anchored
containment or a demonstrably non-replaceable namespace. Recommend one bounded
joint feasibility/design decision before further broad qualification; an
OS-native layer versus a capability-checked system-tool bridge has packaging,
platform and compatibility consequences. Neither is implemented or approved.
Linux x86_64/ARM64 execution still needs a verified available executor; starting
services, hosted CI or new infrastructure requires specific authority.

# Implementation Summary

Completed recent committed units cover unsafe numeric allocation, seed reads
and budgets, archive ownership, malformed MCP requests and Git-metadata mirror
destinations. Chk636 binds the latest completed unit (Bug59). Earlier retained
receipts cover generic extraction, bootstrap/identity/recovery, transport,
option admission, observational Git and other security remedies.

Bug60 draft separates observational SQLite opens from intentional writers.
Fresh synthetic native evidence showed that readOnly:true alone can create
WAL/SHM or modify SHM bytes. Draft admission rejects WAL/transient/recovery
states before native observational opens; explicit queue mutation and snapshot
sealing retain writer paths. The independent native pathname-race boundary
remains Bug47. This is a partial, uncommitted patch, not a closed finding.

Owned unfinished paths:
- src/commands/db.ts
- src/commands/work.ts
- src/core/project_db_events.ts
- src/core/project_db_migrations.ts
- src/core/project_db_queue.ts
- src/core/project_db_snapshot.ts
- src/graph/sqlite_index.ts
- src/core/sqlite_observation.ts (new)
- tests/core/sqlite_observation.test.ts (new)
- .mdkg/work/bug-60-enforce-read-only-sqlite-opens-for-observational-verification.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- this checkpoint
- .mdkg/index/mdkg.sqlite (required generated projection; preserve/exclude from source commit)

# Verification / Testing

Last completed committed candidate: Bug59 full suite2040/2040 passing on
macOS arm64/Node24.18.0;285 installed cases total across24.15.0/24.18.0/26.0.0.
Those passes do not qualify the newer Bug60 working tree or final0.6.0 artifact.

Bug60 source build and test compilation passed. First regression baseline:
32 tests,7 pass/25 fail. Initial remedy:31/32. Expanded latest run completed
before pause:55 tests,53 pass/2 fail,0 skips,53533.548625ms. Both failures show
the new CLI harness invoking db queue list without its required queue argument.
The assertion stops later positive-control commands in those two tests; do not
count the unexecuted remainder as covered. The WAL CLI inventory case did not
require success, so its invalid queue invocation also needs correction before
claiming command-path coverage. No correction or rerun was done after pause.

Real live/orphan WAL, hot-journal, malformed/nonregular inputs, missing DBs,
explicit read-only opens and writer controls passed the recorded focused cases.
The candidate read-only reviewer was interrupted, not accepted as a completed
review. Full suite, installed runtime matrix, Linux and independent final review
have not run against the current patch. The running exec session43264 completed
exit1; no continuation test was launched.

Synthetic scratch remains /private/tmp/mdkg-bug60.K6SPx0; it is not durable
artifact custody. Log hashes permit comparison, not reconstruction:
- baseline.tap SHA256 aa81a59cb1acae0f78395435edd481194eab75aebb7d779ec64d7c0145c594f3
- focused-expanded.tap SHA256 88b539dbfc0ba681ae84976b1226d5569aa77835f1ad4e7e643700c0f2404792
- native-proof.jsonl SHA256 e731e48ce3530aa176a78c03b3d3ff3e35cfa5450232064a0389fc5a2b549a11

Protected pre-checkpoint bookends match the prior run:
- selected Goal73 SHA256 f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab
- runtime project.sqlite SHA256 b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81
- private Demo3 bundle SHA256 741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b
No Git index.lock or mdkg mutation write.lock found at inventory. No persistent
writer lease was acquired. Active_node retains bug60 as resume context, not a
running lease.

Pause-boundary validation: index regeneration, full graph validation and
changed-only validation passed; full validation retains the same three stale
imported-bundle warnings, changed-only has none. git diff --check passed.
After-checkpoint selected/runtime/Demo3 hashes equal the values above. HEAD
unchanged, nothing staged, no mutation/Git index lock present. Checkpoint,
pause metadata, Bug60 draft and required projections are unstaged/uncommitted.

# Known Issues / Follow-ups

- Bug46: permission/ACL/ownership preservation, architecture decision required.
- Bug47: concurrent ancestor replacement containment, unremediated.
- Bug60: finish harness corrections, review and qualify the current draft.
- Task838: durable qualification isolation, owned cleanup and artifact custody.
- Task839: release-critical guidance truth corrections; broad polish deferred.
- Tests477-484/486-488 and Task826/Bug7: final installed, worktree, compatibility,
  recovery and macOS/Linux matrix against exact candidate bytes.
- Task828: independent current-remediation review, without reopening blocked context.
- Task829: final full manifest ladder and coverage floors89/77/96.
- Task830: exact artifact seal. No final qualified tarball exists.

Why duration grew: each completed remedy received reproduction, regression,
full-suite and three-runtime installed checks; additional adjacent correctness
gaps emerged. This produced useful local evidence but repeated broad checks
before the shared filesystem decision was settled. Recommended resumption:
resolve that decision first, complete the remaining bounded fixes, then freeze
and batch final qualification. No estimate is given for unresolved architecture.

# Links / Artifacts

- root:chk-636 and its three committed Bug59 receipts.
- Current bug60 pack: /private/tmp/mdkg-bug60.K6SPx0/bug60-pack.md.
- Existing skills reused: pursue-mdkg-goal, source-grounded-diagnose-and-fix,
  build-pack-and-execute-task, verify-close-and-checkpoint. Skill candidates:none.
- No push, publication, tag, provider, deployment, bundle refresh, canonical
  migration, global configuration or sibling/root write occurred.
