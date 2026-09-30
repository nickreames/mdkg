---
id: chk-661
type: checkpoint
title: Qualify installed transport authority and sampled recovery admission
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-479-local-ownership-qualification.json, .mdkg/artifacts/goal-86/test-479-installed-ownership.cjs, .mdkg/artifacts/goal-86/test-479-state-admission.cjs]
relates: [test-479, goal-86, task-826, test-487, task-828, task-830, goal-87, dec-98]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-479]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Four focused installed families pass 49 scenario rows against the unchanged
6154e4ea candidate on Node24.18.0/macOS arm64. Test479 remains progress and
Goal86 remains NOT_READY. This is current-intermediate evidence, not a final
artifact seal, full per-finding security acceptance or cross-platform clearance.

# Scope Covered

Entry: main6d23981e70bc68798def73c81b9cd5fa7bc9f3df,69 ahead/0 behind
cached origin/main,174 inherited dirty paths, nothing staged and no lock.
Protected selected Goal73/runtime/Demo3/release bytes matched. Goal86 claimed
Test479 without changing selection. Owner:mdkg-project-agent, sole writer.

Changes are two private qualification drivers, Test479/Goal86 evidence, this
checkpoint, one sanitized receipt, requirement coverage and required projections.
No product/package input change, repack, canonical migration or Git mutation.

# Decisions Captured

Dec98: Bugs46/47 stay DEFERRED / UNRESOLVED under paused/unclaimed Goal87,
not accepted/fixed/done. Goal85 stays paused. Node-only portability does not
waive macOS/Linux evidence or qualify Windows. No native product helper added.

# Implementation Summary

The drivers install retained tarball bytes offline in supervised owned temporary
roots, verify bound source/package inputs before/after, preserve failure
diagnostics and remove only owned fixtures after terminal/process checks.
The supplement exercises a real runtime DB, selected-goal file and leased queue;
these never become portable execution authority. Explicit private snapshots
remain byte-identical across clone/fork; public exports exclude them.

# Verification / Testing

- 22 portable-state/malformed-policy cases:8493.920ms.
- 12 sampled migration/reconciliation resume/rollback cases:74310.651ms.
- Nine actual runtime/selection/private-snapshot transport cases:4796.557ms.
- Six live/suspended/ambiguous/unknown-entry/opposite-recovery controls:3434.913ms.
- The12 interruption cases use caught errors after actual filesystem writes,
  not SIGKILL. Chk660 separately binds actual killed-writer linked-topology proof
  on the same candidate; it is not counted again here.
- Independent bounded static review identified a weak claim-result assertion;
  exact message/status/owner and leased=1 refusal assertions now pass.
- A first supplement attempt refused an invalid absolute clone target. Only
  the harness changed; corrected relative targets passed both affected families.
  The unchanged original22/12 families were not rerun.
- Full/changed graph, SQLite index, diff and protected bookends are recorded in
  the receipt after batched evidence writes. No full suite was rerun for these
  non-shipping evidence-only additions; pre-publish full gates remain mandatory.

# Known Issues / Follow-ups

Current per-finding aggregation, remaining containment/malformed-input families,
actual read-only mounts, platform/independent acceptance, full ladder and seal
remain open. First/middle/last sampling is not every interruption boundary;
EPERM is injected and competing recovery has no simultaneous-start barrier.
No power-loss, OS-level abandonment or later explicit DB-restore claim is made.
Older Test489 proof used different9b312e91 bytes and is not current final proof.

# Links / Artifacts

- .mdkg/artifacts/goal-86/test-479-local-ownership-qualification.json
- .mdkg/artifacts/goal-86/test-479-installed-ownership.cjs
- .mdkg/artifacts/goal-86/test-479-state-admission.cjs
- No staging/commit/push, provider, publication, blocked context access or
  canonical bundle/subgraph refresh. No persistent writer lease acquired;
  transient locks released. Test479 remains owned progress, not task completion.
- Skills:pursue-mdkg-goal,verify-close-and-checkpoint. Candidates:none.
