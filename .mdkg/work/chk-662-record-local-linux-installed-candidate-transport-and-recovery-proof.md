---
id: chk-662
type: checkpoint
title: Record local Linux installed-candidate transport and recovery proof
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-487-linux-arm64-qualification.json, .mdkg/artifacts/goal-86/test-487-local-linux-scope.md, .mdkg/artifacts/goal-86/test-487-linux-capsule.cjs, .mdkg/artifacts/goal-86/test-487-linux-runner.cjs]
relates: [test-487, test-479, goal-86, task-826, task-828, task-830, goal-87, dec-98]
blocked_by: []
blocks: []
refs: [dec-99]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-487]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

The unchanged6154e4ea candidate passes49 selected installed scenario rows on
Node24.18.0 / Ubuntu24.04.4 ARM64 / ext4 in a disposable local AppleVZ guest.
This is the first current-candidate Linux subset, not final platform acceptance.
Test487 remains progress; Goal86 remains NOT_READY and Goal85 stays paused.

# Scope Covered

Entry: main6d23981e70bc68798def73c81b9cd5fa7bc9f3df,69 ahead/0 behind
cached origin/main,178 inherited dirty paths, nothing staged, no writer lock.
Goal86 claimed and started Test487 with mdkg-project-agent as sole writer.
Selected Goal73, runtime DB, Demo3 bundle and draft release bookends preserved.
Only private test infrastructure, mdkg decision/work/evidence and projections
changed. No product/package input changed, repack or Git mutation occurred.

# Decisions Captured

Dec99 records Nick's clarification that local Linux testing is permitted and
required, not a dropped release gate. It also records the approved fresh
independent current-source/remediation-diff evidence contract with retained
findings and explicit historical-report loss. No blocked context access,
recovery, historical rerun or new scan occurred. Dec98's Bugs46/47 remain
DEFERRED / UNRESOLVED under paused Goal87, not fixed or accepted findings.

# Implementation Summary

Two private harnesses construct an explicit281-file capsule and verify every
file hash/mode before/after the unchanged Test479 drivers. The exact candidate
is installed offline with normal package postinstall. The VM has no host mounts,
host SSH keys, agent forwarding, container service or propagated proxy state.
Node runtime and Ubuntu image hashes match pinned inputs. No new host package,
native mdkg helper, global configuration or persistent service was installed.

# Verification / Testing

- 22 portable-state/malformed-transport cases:3897.658ms.
- 12 sampled migration/reconciliation recovery cases:18640.834ms.
- Nine actual leased-runtime/selected-goal/private-snapshot cases:1727.509ms.
- Six live/suspended/ambiguous/unknown-entry/opposite-recovery cases:1491.818ms.
- Total driver wall time:26565.330ms; both exit0. Node24.18.0, npm11.16.0,
  Git2.43.0, Linux6.8.0-117-generic, native ARM64 ext4; not emulated x86_64.
- The new private launcher had a syntax error caught before execution and
  corrected; unchanged product bytes required no fix. Tar ignored macOS
  provenance headers; explicit byte/mode verification passed.
- Both owned guest fixture roots removed, no remaining fixture processes,
  VM stopped/deleted; existing unrelated VM remains stopped and untouched.
- Scoped graph/index/diff and final protected bookends are recorded in the
  attached receipt. No unnecessary full source suite was run for mdkg-only
  evidence/private-harness changes; Task829 still owns full readiness gates.

# Known Issues / Follow-ups

- Remaining installed families and Linux x86_64 are unqualified; Windows is
  explicitly unqualified. No final review, full ladder, artifact seal or hosted
  result follows from this subset. The fail-closed CI stub remains unchanged.
- The12 recovery cases are caught-error first/middle/last samples, not every
  operation or power-loss durability. EPERM is synthetic; competing recovery
  has no simultaneous-start barrier. Actual killed-writer worktree evidence is
  separate macOS proof and is not counted as Linux proof here.
- Current per-finding/containment and actual read-only filesystem controls,
  platform/independent acceptance and remaining Goal86 aggregation stay open.
- Review complete attributable commit units later; this milestone leaves all
  current work unstaged/uncommitted. No push or publication authority used.

# Links / Artifacts

- `.mdkg/artifacts/goal-86/test-487-linux-arm64-qualification.json`.
- `.mdkg/artifacts/goal-86/private/test-487-linux-arm64-capsule-manifest.json`.
- Test479 immutable drivers and Chk661 supply prior macOS comparison evidence.
- No persistent writer lease acquired. Transient locks released; Test487 stays
  owned progress, not completed or unclaimed by this receipt.
- Skills: pursue-mdkg-goal, verify-close-and-checkpoint. Candidates: none.
