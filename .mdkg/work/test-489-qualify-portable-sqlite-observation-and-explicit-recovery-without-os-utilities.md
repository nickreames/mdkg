---
id: test-489
type: test
title: Qualify portable SQLite observation and explicit recovery without OS utilities
status: done
priority: 1
tags: [nodejs, portability, release-0.6.0]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/installed-qualification.json]
relates: []
blocked_by: [task-841, task-842]
blocks: []
refs: [goal-86, bug-60, test-487, test-488, chk-655]
context_refs: [goal-86, dec-98, bug-60]
evidence_refs: [chk-655]
aliases: []
skills: []
cases: []
created: 2026-09-28
updated: 2026-09-28
---
# Overview

Qualify the portable observation/recovery slice with installed candidate bytes.
Bug60's implementation precedes this test; its final aggregate closure must
not be an upstream dependency that creates a cycle. No source imports count
as installed proof. Owner mdkg-project-agent under Goal86's local run.

# Target / Scope

Bug60, Tasks841/842, SQLite-backed creation/status/index/DB/snapshot readers,
ordinary writers, interrupted migration/reconciliation, package capability
admission and absence of required OS utility invocations.

# Preconditions / Environment

Freeze candidate inputs and use one hash-bound tarball. Run only synthetic,
owned disposable repositories under /private/tmp. Record exact Node/platform
versions; detect capabilities directly. No canonical DB/selection/bundle
mutation, OS helper installation, remote action or blocked scan context.

# Test Cases

1. Closed SQLite positive reads agree with existing JSON/SQLite semantics;
   missing/corrupt/WAL/hot-journal/raced inputs refuse without project writes.
2. In-memory observation never opens a project path with SQLite, creates no
   project sidecar or temp artifact, and blocks unintended SQL writes/ATTACH.
3. Measure copies, peak memory and timings at representative DB sizes; preserve
   established resource limits and diagnose unsupported sizes honestly.
4. Ordinary node allocation, index rebuild, queue writes and snapshot sealing
   retain positive controls; capability refusal happens before effects.
5. Explicit operator-confirmed recovery succeeds only on reviewed stable
   evidence; missing assertion, stale approval, live/ambiguous custody and
   unknown files refuse. Repeated/competing recovery preserves original proof.
6. Trap sysctl/procfs/descriptor-path dependencies and confirm no OS-name
   restriction in the shipped observation/recovery path.
7. Native Git/worktree fixtures preserve per-checkout state, staging and
   integration semantics. Platform-sensitive cases are reported separately.

# Results / Evidence

LOCAL INSTALLED PASS. Chk655 and installed-qualification.json bind all seven
case families to one234-file candidate, SHA256
9b312e91815bee8651b5c76bb24d6730ac041ce3153277166563b393888df2df:
86 SQLite cases,29 recovery cases, three resource samples and two actual linked
worktrees. Complete refusal inventories, ordinary queue/index/snapshot writers,
reviewed reconciliation/native merge ancestry and repeated integration pass.
OS dependency traps record no attempts. All disposable fixtures were removed;
four corrected harness failures remain recorded. The targeted supplement binds
identical tarball bytes without rerunning unaffected passing families.

Local Node24.18/macOSarm64 scope is complete, not final release/platform
acceptance. Chk653/654 retain their own earlier source/runtime/package evidence.
Use the Task842 Node >=24.18.0 <25 contract; missing capabilities and older24/
higher-major runtimes are refusal controls, not successful-runtime claims. Final
platform results belong to Test487, independent acceptance to Test488/Task828,
and final artifact sealing to Task830. No Windows qualification is inferred.

# Notes / Follow-ups

- Bugs46/47 remain deferred under Goal87; these tests do not claim remediation.
- New confirmed defects need a deduplicated bounded blocker and regression.
