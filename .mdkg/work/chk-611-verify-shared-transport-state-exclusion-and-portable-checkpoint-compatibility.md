---
id: chk-611
type: checkpoint
title: Verify shared transport state exclusion and portable checkpoint compatibility
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-17-local-verification.json]
relates: [bug-17]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-86, goal-84, dec-96]
evidence_refs: [chk-610]
aliases: []
skills: []
scope: [bug-17]
created: 2026-09-15
updated: 2026-09-15
---
# Summary

Bug17 is locally verified and done. Goal86 remains NOT_READY: final0.6.0 installed
qualification, Linux, fresh Standard, independent diff, full ladder and artifact
seal are not complete. Goal85 remains paused for separate publication approval.

# Scope Covered

- root:bug-17: shared transport state exclusion and private portability.
- Source-bound regression and consumer fixtures; this is implementation-local
  acceptance, not closure of test479 or final security/platform qualification.

## Changed Surfaces

- Source: bundle, graph and subgraph commands; transport_state/transport_policy,
  identity_transport, subgraphs, node_body, workspace_ownership and ZIP helpers.
- Tests: bundle_state, subgraph, node_body, subgraph_containment; installed
  transport-state fixture; bundle and capability smoke setup. Exact paths/hashes
  are in the attached receipt; earlier Bug35/40 overlapping work is preserved.
- Bug17, Goal86/84, linked qualification context, this checkpoint, sanitized
  evidence and required event/index projections. All remain unstaged/uncommitted.

## Boundaries

- Explicit Goal86 Run; mdkg-project-agent is the sole canonical writer.
- Disposable synthetic fixtures only; no recovered Demo3 payload execution.
- No stage/commit, remote Git, provider/deployment, publication, canonical graph
  migration, bundle/subgraph refresh, selection or host/global configuration change.
- Main HEAD38205296208c23fcfcc6fc821a295040be05c0bb remains50ahead/0behind cached
  origin/main. Selected Goal73, runtime DB, Demo3 bundle and Git index hashes match.
- No runtime lease or mutation lock retained; historical five DB leases released.

# Decisions Captured

- Portable declarations bind structural roles and ownership, not authentication,
  public-safety attestation, execution or writer authority.
- Historical policy-less public bundles remain inspect-only. Fresh config-less
  declarations still enforce conventional state boundaries; actual owning config
  is required for nonconventional private checkpoint layouts.
- Bare compact init creates independent root history. Parent-owned workspace
  smoke setup must explicitly use graph-only initialization, preserving the prior
  fixture contract. No historical event was relabeled or deleted. Task827/test477
  retain final qualification of documented setup; independent root re-aliasing
  is not proven by these controls or silently waived.

# Implementation Summary

One shared classifier rejects state/discovery overlap before payload parsing,
consults registered child configurations even when unselected and refuses unknown
descendant custody. Private checkpoints/receipts remain byte-preserving controls;
public omission evidence contains counts, not excluded private names or hashes.
Both manifest validators and transport consumers check roles/owning policy.
Projection/body reads, ZIP receipts and template apply use bound snapshots.
Temporary-name collisions preserve pre-existing files and directories.

One prepatch investigator and one independent candidate-review cycle were used.
Two candidate hypotheses and additional parent representation probes reproduced
before narrow fixes. The final config-less-runtime route copied synthetic live
state before correction; afterward all five installed consumer paths refuse it
without persistent writes, including a changed previously registered source.

# Verification / Testing

## Command Evidence

- Final build/test build pass. Focused source tests118/118; all discovered
  tests1457/1457, zero failures/skips, Node24.18.0/macOS, source unchanged.
- One intermediate223-file package still version0.5.2, SHA256
  e1fd06482cacfdcde46f5b3c7025556853085475c32ca7594eeacf6565192aed,
  passes22 CLI-only scenarios on each Node24.15.0/24.18.0/26.0.0 on macOS.
  Prepack was skipped only for this intermediate fixture, not the release seal.
- Installed bundle/subgraph/visibility smokes pass with the same artifact.
  Capability smoke passes separately using built source; it is not installed proof.
- CLI/docs/workflow parity pass; documentation check63files/470examples/0failures.
  Pre-closeout graph0errors/3preserved stale-import warnings, changed-only clean,
  all five SQLite projections fresh and git diff --check clean.
- Post-checkpoint index regeneration, full/changed-only graph validation, all
  five SQLite checks, CLI/docs/workflow parity and diff checks also pass. Exact
  bookends and dirty custody are recorded in bug-17-closeout-validation.json.

## Pass / Fail Status

- Bug17 local implementation: pass, done. Final launch qualification: NOT_READY.
- Retained published0.5.2 producer includes synthetic live DB bytes in both
  profiles; provenance was previously registry-bound, not freshly downloaded.
- Earlier intermediate packages and failed fixture attempts remain historical;
  their passes are not promoted to current-source or final-artifact acceptance.

## Known Warnings

- Three stale imported-subgraph warnings are deliberately preserved.
- Linux and Windows are not qualified by macOS fixtures; Windows remains explicitly
  unqualified. Fresh Standard/task828 are mandatory and have not been launched.

# Known Issues / Follow-ups

Continue Bug39 early unsupported-option refusal, then Bug41/42 and writer
compatibility/recovery. Finalize metadata/guidance before frozen installed and
security qualification; preserve existing ancestor-swap/ACL and historical
migration-reference limitations until independently dispositioned. No automatic
risk waiver, undocumented compatibility claim or new consumer-specific behavior.

## Follow-up Refs

- bug-39, bug-41, bug-42, task-835, task-836, task-827, test-477, test-479,
  test-487, task-826, task-837, task-828, task-829, task-830 and goal-85.
- Skill coverage reused; new skill candidates: none.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-17-progress.json
- .mdkg/artifacts/goal-86/bug-17-transport-intake.json
- .mdkg/artifacts/goal-86/bug-17-transport-progress.json
- .mdkg/artifacts/goal-86/bug-17-portable-contract-progress.json
- .mdkg/artifacts/goal-86/bug-17-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
