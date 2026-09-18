---
id: task-836
type: task
title: Add evidence-bound interrupted-writer recovery for graph transactions
status: done
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-836-local-verification.json]
relates: []
blocked_by: [task-835]
blocks: []
refs: [bug-7, dec-94, dec-96, test-479, test-478]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-13
updated: 2026-09-17
---

# Overview

Goal: Make graph transaction recovery explicitly usable after a proven interrupted writer without stealing authority.

Context: Bug7 caught-error recovery passes but SIGKILL leaves the mutation lock and blocks resume. Dec94 permits explicit evidence-bound recovery, not age/PID-only takeover.

# Acceptance Criteria

- Extend the existing graph recovery/lock contract, not a new generic lease CLI.
  Inspection stays read-only; any recovery mutation names and binds the exact
  checkout, transaction/plan, lock owner and journal plus current owned file states.
- Newly recorded provenance must support reliable local liveness/ownership proof;
  old weak lock metadata is not upgraded by inference. Live, suspended, PID-reused,
  ambiguous or insufficiently evidenced owners refuse; age/PID alone is never enough.
- Preserve fresh byte/dependency custody checks during resume/rollback. Changes
  to evidence, unknown files, locks, journals or plans invalidate approval.
- Distinct worktrees share graph identity but never checkout authority. Recovery
  in A cannot remove B's lock/journal, change shared Git administration or stage files.
- Preserve diagnostic/recovery evidence and original receipt identities; do not
  delete canonical locks during qualification. Only owned killed fixture workers.

# Files Affected

Existing mutation-lock, graph recover and identity transaction helpers; direct/fault-injection fixtures; mdkg evidence and exact owned command guidance.

# Implementation Notes

Owner: mdkg-project-agent, one writer in this checkout. The explicit Goal86 Run
and Nick's continuation after chk616 authorize this planned bounded task.
Task835 is locally done under chk617; fresh main/dirty/protected-state custody
matches its closeout. This run authorizes bounded implementation, local validation, evidence
and reviewed explicit-path local commits on main; selected state does not authorize it.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

# Test Plan

Real abrupt termination and successful explicitly reviewed resume/rollback; same-checkout writer refusal, live/ambiguous/legacy owner refusal, cross-worktree isolation, stale-file and interrupted-recovery tests on required runtimes/platforms.

# Links / Artifacts

Local implementation verification is recorded in
`.mdkg/artifacts/goal-86/task-836-local-verification.json`.

## 2026-09-18 Local Implementation Acceptance

Versioned immutable ownership binds checkout identity, boot/user/namespace proof,
transaction hash and complete journal epochs. Explicit mode-specific recovery
approval preserves the original lock and appends an exclusive claim; live,
ambiguous, legacy, changed or insufficient evidence refuses. Age/PID alone is
not authority. Journal inventory and owned bytes are rechecked through writes,
resume/rollback and terminal cleanup. Ordinary commands do not require OS proof.

Full discovered source suite and coverage run each pass 1,627 tests. Coverage is
91.80% lines / 82.80% branches / 96.99% functions, above unchanged 89/77/96 floors.
The identical 228-file intermediate package passes 11 installed SIGKILL/recovery
cases on each of Node 24.15.0, 24.18.0 and 26.0.0 (33 total). Two independently
found candidate defects were reproduced by four regressions, fixed and reviewed.
CLI/docs/workflow, full/changed graph, SQLite and diff checks pass locally.

This is macOS arm64 intermediate proof, not final 0.6.0 release qualification.
Incomplete metadata publication and partial cleanup fail closed; no universal
power-loss, hostile same-user pathname-race or ACL-preservation claim is made.
Linux x86_64/ARM64, final installed matrix and both security gates remain open.
Protected selection/runtime DB/Demo3/Git-index bytes are unchanged. No staging,
commit, remote/provider action, canonical migration or bundle refresh occurred.
Task827 is next; Bug7 aggregate and Goal86 remain incomplete. Skill candidates:none.
