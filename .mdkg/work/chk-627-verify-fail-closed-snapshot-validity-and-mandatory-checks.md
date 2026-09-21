---
id: chk-627
type: checkpoint
title: Verify fail-closed snapshot validity and mandatory checks
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-50-baseline.json, .mdkg/artifacts/goal-86/bug-50-current-validation.json, .mdkg/artifacts/goal-86/bug-50-installed-verification.json]
relates: [bug-50]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, test-487, task-828, bug-51, bug-46, bug-47]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-626]
aliases: []
skills: []
scope: [bug-50]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Local remedy verified:1664 full tests,71 focused and78 installed cases pass on macOS arm64 across required Node runtimes. One source-only candidate review found no concrete surviving Bug50 bypass. No blocked context accessed; linked-input authority and final independent Linux ladder seal gates remain open.

# Scope Covered

- Completed node: bug-50 (Snapshot verification reports directories as valid checkpoints)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-50
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-50 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Require regular snapshot and manifest inputs before content readers. Fail
  closed when required checks are missing or failed checks lack diagnostics.
  Preserve diagnostic-count failure_count and status command exit0 semantics.
- No linked-regular-file rejection, descriptor-bound ancestor-race protection,
  runtime-input admission or SQLite read-only-mode change is claimed. Those
  contracts remain separately owned by Bugs51/46/47/60.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- Fresh prepatch synthetic baseline:26 cases,18 pass/8 fail. False-valid directory
  receipts and FIFO timeouts reproduced. Incorrect harness expectations and
  temporary TypeScript/Array-mock failures are retained, not qualification passes.
- Final focused71/71 and manifest-backed full1664/1664 tests pass with no skips,
  failures or cancellations on Node26.0.0/macOS arm64. Reviewed source/test
  hashes remain unchanged. One independent source-only candidate review found
  no concrete surviving Bug50 bypass or new regression in the bounded control.
- Installed intermediate tarball SHA256
  d520a0c1f94e439765091eaeebe60569d1ee60f263ccb5aff1ca6f0b0568e531:
  26 cases each pass on Node24.15.0/24.18.0/26.0.0. All230 source/installed
  hashes match before/after. Offline installation skips lifecycle scripts.
  Fixture inventories include authored files, Git index, runtime, snapshot and
  manifest bytes/modes. These are not Linux or final release qualification.
- Build/build:test, CLI/docs/CI parity and pre-close full/changed-only graph
  validation pass. Post-checkpoint reindex, full/changed-only validation, all five
  index projection checks and git diff --check pass. Three preserved imported
  freshness warnings remain. No bundle refresh is authorized.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale imported-bundle warnings remain; no refresh authority.
- Intermediate source/package proof is not the full release ladder or seal.

# Known Issues / Follow-ups

- Five of14 retained findings have local remedies; nine remain open plus
  adjacent Bugs58-60 and final acceptance gates. Goal86 remains active and
  NOT_READY; Goal85 remains paused. Next remedy: Bug51 snapshot containment.
- No blocked context accessed, recovered or rerun; current-source synthetic
  regressions do not reconstruct the old scan. Published0.5.2 impact unassessed.
- Accepted one-writer custody on mainc0a51fbb,57 ahead/0 behind cached
  origin/main. No remote verification/action, publication, provider, canonical
  migration or bundle/subgraph refresh. No runtime lease acquired; supported
  mutation commands release their transient locks. Active_node is routing only.
- Protected selected Goal73 SHA256
  f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
  Final bookends match all three hashes. All five runtime leases remain released
  and no mutation lock remains. Generated .mdkg/index/mdkg.sqlite stays excluded
  from the local commit.

## Exact Local Commit Allowlist

- src/core/project_db_snapshot.ts
- tests/core/snapshot_verification.test.ts
- tests/fixtures/snapshot-verification.cjs
- .mdkg/artifacts/goal-86/bug-50-baseline.json
- .mdkg/artifacts/goal-86/bug-50-current-validation.json
- .mdkg/artifacts/goal-86/bug-50-installed-verification.json
- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/work/bug-50-snapshot-verification-reports-directories-as-valid-checkpoints.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- .mdkg/work/test-488-verify-fresh-standard-security-remedies-and-adjacent-qualification-corrections.md
- .mdkg/work/chk-627-verify-fail-closed-snapshot-validity-and-mandatory-checks.md

Skill coverage: pursue-mdkg-goal, fix-finding, source-grounded-diagnose-and-fix,
verify-close-and-checkpoint and local Git preflight. New skill candidates: none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-50-baseline.json
- .mdkg/artifacts/goal-86/bug-50-current-validation.json
- .mdkg/artifacts/goal-86/bug-50-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
