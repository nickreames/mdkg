---
id: chk-639
type: checkpoint
title: Resume Goal86 with SQLite race evidence and artifact custody progress
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json, .mdkg/artifacts/goal-86/task-838-artifact-custody-progress.json]
relates: [goal-86, bug-60, task-838, dec-97]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-60, task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Goal86 resumed under Dec97's Node.js-only/local-only boundary. Bug60's harness
issues are corrected, but independent review and a fresh deterministic fixture
exposed an unresolved same-inode journal-transition race. Bug60 is blocked with
a retained failing regression. Task838 is active: its first artifact-custody
unit has27 focused passing checks. Neither work item nor Goal86 is complete.

# Scope Covered

Owner mdkg-project-agent, one repository writer. Supported goal resume, explicit
Bug60 claim/update, then Task838 claim/start. Selected Goal73 was not changed.
The previous verification-only turn did not execute the goal; this turn makes
source/test and durable-evidence progress, not a repeated readiness restatement.

## Changed Surfaces

- tests/core/sqlite_observation.test.ts: valid CLI controls, cleanup order,
  materializer/work-trigger coverage and a failing concurrent-mode regression.
- scripts/qualification-artifact.js; scripts/npm-smoke-proxy.js;
  scripts/release-ladder.js; tests/qualification-artifact.test.mjs.
- Goal86, Bug60, Task838, this checkpoint, two evidence JSON files and required
  mdkg index/event projections. No current-turn edits to the preserved runtime
  source draft, prior Task840 skills or Dec97/epic planning unit.

## Boundaries

- In scope: generic mdkg fixes and qualification infrastructure in this checkout,
  owned synthetic local fixtures, selective checks and sanitized evidence.
- Out of scope: blocked context, historical scan recovery/reruns, native bridges,
  Rust/Bun, Linux execution/hosted CI, remotes, publication, providers, deployment,
  canonical migration, bundles/subgraphs, history changes and sibling/root edits.
- Raw security reports, operational payloads and credentials were not accessed.

# Decisions Captured

Dec97 remains controlling. Private temporary-copy SQLite observation is a design
question raised for Nick, not implemented or approved here. No weaker concurrency
guarantee, immutable live-DB shortcut or security/platform waiver was substituted.

# Implementation Summary

Bug60:59/60 focused checks pass. After admission, a scheduled second SQLite
connection switches the same database inode to WAL and closes. Compared with
the baseline taken after that writer closes, the observational readOnly open
creates a32768-byte SHM file and empty WAL. No main-DB byte change is needed.
This is not merely an ancestor-directory swap and is not a new entry in the
retained fourteen-finding security inventory. Keep the source draft uncommitted.

Task838: independent exclusive artifact copies replace hard links; canonical
self-delivery and unrelated destination overwrites refuse. Regular independent
file admission and hashes bind delivery, install consumption, each smoke and
final ladder acceptance. Installer tampering and same-size changes invalidate
qualification. These are integrity bookends, not OS immutability or a sandbox.

# Implementation Details

- Four Task838 validation-only paths above; npm runtime allowlist is unchanged.
- Artifact usage records now identify independent delivery; install-consumption
  records retain before/after hashes and consumer status. Existing usage fields
  remain available to the ladder. Unknown existing files are not replaced.
- Actual installed-candidate/full-ladder behavior still requires qualification;
  current installer positive/negative controls use a synthetic local executable.

# Verification / Testing

## Command Evidence

- Test compilation passed. Reused the matching prior runtime build for Bug60;
  source hashes are checked in bug-60-local-resume-evidence.json.
- node --test --test-reporter=tap dist/tests/core/sqlite_observation.test.js:
  60 tests,59 pass,1 fail,0 skip/cancel,61.6s on Node24.18.0/macOS arm64.
  All previous harness failures and added writer controls pass; the concurrency
  regression genuinely fails and remains in full test discovery.
- node --test tests/qualification-artifact.test.mjs dist/tests/release-ladder.test.js:
  27/27 pass,0 skip/cancel,2.36s; three destructive baseline cases failed before
  correction in owned disposable fixtures only. A rename error during iteration
  was corrected and the entire affected selection rerun.
- JavaScript syntax and git diff --check pass. Source hashes in both JSON receipts
  match current files. Full discovery includes the new MJS file (168 test files).
- Required index refresh, full graph validation and changed-only validation pass
  with0 errors; full validation retains the three known stale-import warnings,
  changed-only has0 warnings. git diff --check passes. No full runtime suite,
  installed matrix or release ladder is represented by these graph checks.

## Pass / Fail Status

PARTIAL / NOT_READY. No task completion, pre-merge readiness, final artifact seal
or publication readiness claimed. Full runtime rerun is deferred while the
deterministic Bug60 failure remains; it is not hidden by the focused selection.

## Known Warnings

Three preserved stale imported-bundle warnings and the known goal-next chk616
routing warning remain. No bundle refresh or unrelated routing repair performed.

# Known Issues / Follow-ups

- Bug60: unresolved same-inode journal transition; Node-only design decision and
  subsequent regression/installed qualification remain. Bugs46/47 stay open.
- Task838: Git environment/root admission, owned cleanup, durable evidence
  retention, real installed controls and independent acceptance remain required.
- Linux/Test487, Task839 final truth, Task828 review, Task829 ladder, Task830 seal
  and separately approved Goal85 publication remain outstanding.
- Fresh synthetic diagnostics remain under /private/tmp/mdkg-bug60-current.AkZP17;
  the durable JSON includes the source/log hashes and the committed-source-form
  reproduction. The test source is currently uncommitted, not a claimed commit.

## Follow-up Refs

Task838 is the next active local work item. Goal86 remains active; Goal85 paused.

# Links / Artifacts

- Both frontmatter evidence files; dry-run concise Bug60 and Task838 packs.
- HEAD remains c10113489381badf2845fc378c49b317376f953e on main, nothing staged;
  cached upstream last measured67 ahead/0 behind, no remote verification.
- No commit: Bug60 deliberately retains a failing regression and Task838 remains
  partial. Prior source, skills, planning and SQLite projection custody preserved.
- Protected bookends match: selected-goal f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
- No persistent runtime writer lease acquired; before/after stats show0 active
  and5 released leases. Task838 ownership remains with this active lane, not a
  standing checkout lease. Mutation and Git index locks are absent at handoff.
- Skills: pursue-mdkg-goal, build-pack-and-execute-task,
  source-grounded-diagnose-and-fix, verify-close-and-checkpoint. Candidates:none.

# Raw Content Safety

Sanitized current-source summaries and synthetic fixture hashes only. No blocked
report context or external operational data was opened, reconstructed or exported.
