---
id: chk-612
type: checkpoint
title: Verify early CLI option admission and installed compatibility
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-39-local-verification.json]
relates: [bug-39]
blocked_by: []
blocks: []
refs: [test-486, task-828, bug-41]
context_refs: [goal-86, goal-84, dec-96]
evidence_refs: [chk-611]
aliases: []
skills: []
scope: [bug-39]
created: 2026-09-15
updated: 2026-09-15
---
# Summary

Bug 39 is locally verified and done. Goal 86 remains NOT_READY: final 0.6.0
installed qualification, Linux, fresh Standard, independent remediation diff,
full release ladder and artifact seal remain open. Goal 85 stays paused.

# Scope Covered

- root:bug-39: command/type-specific early option admission in both entrypoints.
- Local source and intermediate installed-package acceptance, not final test486
  or security/platform qualification. Normal task-done allocation created this
  checkpoint; historical findings and receipts were not replaced.

## Changed Surfaces

- Fifteen source/test/generated-reference paths are individually named and
  hashed in the attached receipt: parser, CLI, option contract, reference
  generators, option/compatibility/containment tests and installed fixture.
- Bug39, test486, Goals84/86, requirement matrix, this checkpoint, sanitized
  evidence and required event/index projections. Existing Bug17/35/40 work is
  preserved. All work remains unstaged and uncommitted at this checkpoint.

## Boundaries

- Explicit Goal86 Run; one canonical writer, mdkg-project-agent. Temporary
  synthetic graphs and local Git fixtures only; no recovered Demo3 payloads.
- No staging/commit, remote Git, publication, provider/deployment, canonical
  graph migration, selection, bundle/subgraph refresh or global configuration.
- Main HEAD38205296208c23fcfcc6fc821a295040be05c0bb is unchanged,50ahead/0behind
  cached origin/main. No current remote verification or hosted-CI claim.
- Selected Goal73, runtime DB, Demo3 bundle and Git index hashes match the
  accepted bookends. All five recorded runtime leases remain released; queues
  are empty. Supported transient mutation locks are released after each write.

# Decisions Captured

- Early admission covers unsupported/wrong-command flags, missing values and
  Boolean/integer syntax. Supported-option domain, mode, positional and graph
  semantics retain existing validation; there is no universal pre-config
  zero-effect claim for every invalid invocation.
- Preserve actual init/event agent overloads, aliases and ordinary mutation
  behavior. Do not add ignored options as compatibility shims.
- This is generic enforced CLI behavior; skill candidates: none.

# Implementation Summary

One pure contract describes151 concrete command paths, including22 new-node
type variants, and drives synchronous/asynchronous admission plus machine/help
discovery. Every option occurrence is checked; malformed earlier duplicates
cannot hide behind later valid values. Two independent candidate hypotheses
were reproduced and corrected: explicit init-help agent parsing and creation
type restrictions occurring after cache/ID effects. Follow-up source review
accepted both and the subsequent test-alignment changes. This was not a scan.

# Verification / Testing

## Command Evidence

- Build/test-build pass;126 focused tests and all1,463 discovered tests pass,
  zero failures/skips, Node24.18.0/macOS.454 source/test/reference hashes remained
  stable through the full run. CLI, command-contract, docs and workflow parity pass.
- One intermediate224-file package, still version0.5.2, SHA256
  0a08f31c0bda67674a4acca7fce30c2ab01f00e8799deeaf17ae33a41cb52d20,
  passes194 process refusals,388 direct-entrypoint checks,41 unindexed-graph
  refusals and seven positive controls on each Node24.15.0/24.18.0/26.0.0.
  Complete inventories show unchanged files, metadata, staging and sentinels;
  Git/SSH/gh/curl traps recorded zero calls. Installed bytes supplied the CLI
  and module APIs. Prepack bypass was intermediate-only, not a final release gate.
- The first full run failed13 tests: ten older diagnostic assertions and three
  fixtures relying on ignored unsupported flags. Corrected fixtures still prove
  the intended archive, metadata, containment and no-effect paths. The failures
  and their dispositions remain in the receipt; no safety requirement was waived.
- Pre-closeout graph validation:0errors/3preserved stale-import warnings;
  changed-only0errors/0warnings; all five index checks fresh; git diff --check clean.
- Normal task-done/checkpoint commands recorded local completion. Post-checkpoint
  graph/index/bookend verification is recorded in the attached local receipt,
  not inferred from task-done success.

## Pass / Fail Status

- Local implementation: PASS. Final artifact/platform/security qualification:
  UNVERIFIED. Overall Goal86: NOT_READY.

## Known Warnings

- Three preserved stale imported bundles; no refresh authority used.
- Windows remains unqualified. Linux and fresh security evidence are still
  required. Source test success is not full release-ladder or coverage-floor proof.

# Known Issues / Follow-ups

- Bug41 is the next bounded implementation lane, followed by Bug42 and writer
  compatibility/recovery. Test486 remains todo for the exact final0.6.0 artifact.
- Task837 Standard, task828 independent diff, test487 platforms, task829 full
  ladder and task830 seal remain mandatory. Publication needs fresh authority.

## Follow-up Refs

- root:bug-41, root:test-486, root:task-828, root:goal-86, root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json
- .mdkg/artifacts/goal-86/bug-39-local-verification.json

# Raw Content Safety

This checkpoint stores sanitized conclusions and artifact refs, not raw security
reports, secrets, provider payloads or operational execution data.
