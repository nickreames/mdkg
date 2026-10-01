---
id: chk-628
type: checkpoint
title: Verify contained snapshot inputs and bounded observation
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-51-baseline.json, .mdkg/artifacts/goal-86/bug-51-current-validation.json, .mdkg/artifacts/goal-86/bug-51-installed-verification.json]
relates: [bug-51]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, test-487, task-828, bug-46, bug-47, bug-52, bug-60]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-627]
aliases: []
skills: []
scope: [bug-51]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Local remedy verified:1670 full tests,117 focused,237 installed cases and9 Git-custody controls pass on macOS arm64. One independent candidate review found no concrete in-scope bypass. No blocked context accessed; native pathname races metadata ACLs Linux final review ladder and seal remain open.

# Scope Covered

- Completed node: bug-51 (Snapshot inspection can disclose hashes of files outside the repository)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-51
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-51 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Admit snapshot, manifest, optional runtime and implicit SQLite sidecars before
  reads; seal admits before runtime verification/checkpoint and replacement.
  Reject visible links and non-regular inputs. Reuse contained bounded manifest
  reads and descriptor-checked streaming database hashes. Manifest output obeys
  the configured index file-size budget so seal cannot emit an unreadable pair.
- Snapshot observations and seal preflight use explicit read-only options;
  checkpoint/VACUUM remains writable. Queue and DB helper defaults remain intact.
  No metadata/ACL, native pathname race or blanket physical read-only claim.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- Fresh source-bound prepatch baseline79 cases:26 pass/53 fail. Initial candidate
  nine regressions arose from an undefined SQLite options argument; corrected
  empty options preserve ordinary queue callers. These failures remain recorded.
- Build/build:test,42 narrow,117 focused and1670 manifest-backed full tests pass.
  Full run uses Node26.0.0/macOS arm64, zero failures/skips,397892ms. Candidate
  source/test hashes remain unchanged. One independent prepatch investigation
  and one independent source-only candidate review completed; no concrete
  in-scope bypass or legitimate-workflow regression found by candidate review.
- Installed intermediate tarball SHA256
  b734379203b4887daea7ba1a45b8a38fcd89675a294ec5b2d72bbe854fbbf681:
  79 cases each on Node24.15.0/24.18.0/26.0.0 pass (237 total); all230 source and
  installed file hashes unchanged. Offline pack/install, lifecycle scripts off.
- Nine source-level unsafe-input refusals preserve exact Git index, staged and
  unstaged authored bytes and external sentinels. Synthetic source checks cover
  actual manifest read limits, large streamed DBs, explicit readonly native
  options and output-budget refusal. Regular first/reseal, portable, stale,
  custom-path and queue workflows remain covered by the combined tests.
- CLI/docs/CI parity, pre-close full and changed-only graph checks pass.
  Post-checkpoint reindex, full/changed-only validation, all five index checks
  and git diff --check pass. No final coverage ladder, Linux, final artifact
  seal or publication proof claimed.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale imported-bundle warnings remain; no refresh authority.

# Known Issues / Follow-ups

- Goal86 active/NOT_READY; Goal85 paused. Six of14 retained findings have local
  remedies; eight remain open, plus adjacent58-60 and final release gates.
  Next independent remedy: Bug52 upgrade-journal binding. Bugs46/47 filesystem
  feasibility remains distinct from dependency/distribution implementation.
- No blocked context accessed, recovered or rerun; no raw Security reports
  imported. Current regressions do not reconstruct the historical scan. Earlier
  published0.5.2 impact unassessed; Windows and Linux not qualified by this pass.
- One-writer custody accepted on main8c5a6113,58 ahead/0 behind cached origin/main.
  No remote verification/action, publication, provider, canonical migration or
  bundle/subgraph refresh. No runtime lease acquired. Transient command locks
  release normally; durable active_node routing is not execution ownership.
- Protected selected Goal73 SHA256
  f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
  Final bookends match; all five runtime leases are released, queues/messages
  empty and no mutation lock remains. Generated .mdkg/index/mdkg.sqlite stays
  excluded from the local commit.

## Exact Local Commit Allowlist

- src/core/project_db_snapshot.ts
- src/core/project_db_queue.ts
- src/core/project_db_migrations.ts
- tests/core/snapshot_containment.test.ts
- tests/core/snapshot_verification.test.ts
- tests/fixtures/snapshot-containment.cjs
- .mdkg/artifacts/goal-86/bug-51-baseline.json
- .mdkg/artifacts/goal-86/bug-51-current-validation.json
- .mdkg/artifacts/goal-86/bug-51-installed-verification.json
- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/work/bug-51-snapshot-inspection-can-disclose-hashes-of-files-outside-the-repository.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- .mdkg/work/test-488-verify-fresh-standard-security-remedies-and-adjacent-qualification-corrections.md
- .mdkg/work/chk-628-verify-contained-snapshot-inputs-and-bounded-observation.md

Skills reused: pursue-mdkg-goal, build-pack-and-execute-task, fix-finding,
source-grounded-diagnose-and-fix, verify-close-and-checkpoint, local Git preflight.
New skill candidates: none. No skill authoring performed.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-51-baseline.json
- .mdkg/artifacts/goal-86/bug-51-current-validation.json
- .mdkg/artifacts/goal-86/bug-51-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
