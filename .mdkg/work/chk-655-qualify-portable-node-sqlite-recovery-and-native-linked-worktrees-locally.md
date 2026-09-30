---
id: chk-655
type: checkpoint
title: Qualify portable Node SQLite recovery and native linked worktrees locally
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/installed-qualification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, bug-60, task-841, task-842, test-489, dec-98, goal-87]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-489, bug-60]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Test489's local installed portability slice passes on Node24.18.0/macOSarm64.
Bug60 has local implementation and installed acceptance evidence; final
independent/platform/release acceptance remains separate. Goal86 is NOT_READY.
Bugs46/47 remain DEFERRED / UNRESOLVED under paused Goal87, never accepted or
fixed. Goal85 remains paused and unpublished.

# Scope Covered

One writer, mdkg-project-agent, under Goal86/Dec98. Main/HEAD remains
6d23981e70bc68798def73c81b9cd5fa7bc9f3df,69 ahead of cached origin/main.
Test489 adds only owned fixture drivers/evidence and required graph projections;
no further product source fix was needed. The receipt binds57 input hashes,
exact dirty custody and protected state. Nothing is staged.

# Decisions Captured

Dec98: built-in Node APIs, explicit operator-confirmed recovery, supported
Node >=24.18.0 <25, deferred unresolved hardening and retained final platform
gates. No native helper, implicit takeover or OS proof claim.

# Implementation Summary

One normally packed/installed234-file intermediate candidate, SHA256
9b312e91815bee8651b5c76bb24d6730ac041ce3153277166563b393888df2df,
binds every case. The narrow recovery-admission supplement refuses any other
tarball hash; unaffected passing families are reused only for identical bytes.
Tests use installed modules/CLI, not canonical source imports as consumer proof.

Two actual linked worktrees share graph ancestry but have separate SQLite
indexes, selection, runtime DBs and locks. A held writer excludes another in
the same checkout while the peer succeeds. Colliding aliases and cross-links
are reconciled before an explicit semantic commit and native merge. Exact
reviewed graph paths, incoming source and external evidence survive, both
ancestries remain, and repeated integration is byte-preserving. No blanket
ours treatment is used; this fixture's native merge has no textual conflicts.

# Verification / Testing

- Installed SQLite:25 memory cases and61 caller/CLI/WAL/hot-journal/malformed/
  permission/writer cases pass, zero failures/skips (209.499333ms/60,928.32325ms).
- Installed recovery:12 caught-error and11 real-kill cases pass in143,158.074875ms;
  six more cases cover actual live/suspended owners, synthetic ambiguous PID,
  unknown lock/authored files and competing opposite modes with one exact
  terminal outcome. Refusal inventories and repeated terminal reads are intact.
- Normal prepack/postinstall pass. SHA512 integrity and234 installed file hashes
  are recorded; product OS-utility/UID/procfs/descriptor traps see zero attempts.
- 1/16/64MiB samples:2.645208/5.645708/21.360041ms, one JavaScript image and one
  deserialize call each.64MiB adds136,855,552 resident bytes. These are local
  single samples, not every native copy, a fixed size limit or an OOM guarantee.
- Four corrected fixture failures are preserved: worktree db init ordering,
  unsupported index --json, a fixture Git flag, and exact bodies being absent
  from the sanitized public preview. Compare the original private journal.
- All owned temporary roots were removed after children exited. No recovered
  Demo3 application or blocked scan context was accessed. Final graph/index/
  diff checks and protected bookends are recorded in the receipt.

# Known Issues / Follow-ups

- Task839 release-critical guidance, final installed/macOS/Linux acceptance,
  independent review, full tests/coverage/ladder, seal and reviewed commits
  remain. Windows remains unqualified. No final artifact clearance is claimed.
- Selection Goal73, runtime DB and private Demo3 bundle hashes match. No
  persistent lease/mutation lock remains. All work is unstaged/uncommitted;
  no remote Git, provider, deployment, publication or bundle refresh occurred.
- Skills reused: goal pursuit, pack-first execution and selective verification.
  New skill candidates:none.

# Links / Artifacts

- .mdkg/artifacts/goal-86/node-portability/installed-qualification.json
- Combined and targeted admission drivers in the same directory.
- Chk653/654; Bug60; Test489; Tasks841/842; Goal86; Dec98; Goals85/87.
