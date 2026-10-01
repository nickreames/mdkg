---
id: chk-636
type: checkpoint
title: Verify native Git metadata exclusion from skill mirrors
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-59-baseline.json, .mdkg/artifacts/goal-86/bug-59-full-verification.json, .mdkg/artifacts/goal-86/bug-59-installed-verification.json]
relates: [bug-59]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-60]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-635]
aliases: []
skills: []
scope: [bug-59]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

2040 full tests,47 focused cases and285 installed cases pass; blocked context untouched; release NOT_READY

# Scope Covered

- Completed node: bug-59 (Refuse native Git metadata as a skill mirror destination even with force)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Shared native-Git metadata admission, all mirror entrypoints and upgrade
  replay;47 focused regression cases and real-Git staging-sentinel fixtures.
- Required Bug59/Goal86/checkpoint evidence only; SQLite index stays separate
  preserved dirty custody, excluded from the local commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Goal86 authorizes this generic remedy and reviewed local commit on main.
  No blocked context, raw report recovery, scans, remote Git, publication,
  providers, canonical migration or bundle/subgraph refresh.
- Adjacent custody blocker, not another retained security finding. One bounded
  reviewer identified corrections before final qualification; not final Security
  acceptance. No skill authoring; existing skills reused; candidates:none.

# Implementation Summary

- All target admission precedes source/mirror/manifest/prune writes and initial
  lock-directory creation. Force and empty-slug paths cannot bypass it.
- Natural and redirected Gitdir/common/index/hooks/objects, chained alternates,
  nested repositories and old approved upgrade replay are covered. Read-only
  native rev-parse observations use the existing helper-free primitive.
- Target selectors normalize portable separators; resource filenames retain
  literal native bytes. Ordinary custom mirrors and user ownership remain.

# Verification / Testing

## Command Evidence

- Build/build:test;47 focused cases;2040 full manifest-discovered tests pass,
  0 failures/skips,458423ms, Node24.18.0/macOS arm64.
- Exact installed tarball:95 cases each on Node24.15.0/24.18.0/26.0.0;
  285 total,0 failures/skips. All232 installed files match the frozen build.
- Intermediate tarball SHA256:
  fc64644615b253f77a5a4866b9653d1c09612ac714d920ef82eaa08bb8b07c80.
- CLI/docs/workflow parity, graph validation, SQLite and diff checks pass.
- Superseded pre-BOM-correction run was stopped and not counted as a pass.

## Pass / Fail Status

- status: done

## Known Warnings

- Three preserved stale imported-bundle warnings; refresh is outside authority.
- macOS case-insensitive filesystem does not prove distinct Linux case-spelling
  traversal. Linux, final coverage/security acceptance and release seal remain.

# Known Issues / Follow-ups

- Twelve of14 retained security findings have local remedies; Bugs46/47 and
  adjacent Bug60 remain. Goal86 active, Goal85 paused; release NOT_READY.
- Selected Goal73/runtime DB/Demo3 hashes match baseline. Five released runtime
  leases, zero queues/messages; no persistent lease acquired or left active.
- Local commit only; cached upstream unverified remotely. No push or publication.

## Reviewed Local Commit Allowlist

- src/commands/init.ts
- src/commands/skill.ts
- src/commands/skill_mirror.ts
- src/commands/upgrade_projections.ts
- src/commands/upgrade_transaction.ts
- src/util/git_metadata.ts
- tests/commands/skill_git_metadata.test.ts
- tests/commands/cli_onboarding.test.ts
- tests/commands/init_manifest_ownership.test.ts
- tests/commands/upgrade_approval.test.ts
- tests/commands/upgrade_identity.test.ts
- tests/commands/upgrade_safety.test.ts
- .mdkg/artifacts/goal-86/bug-59-baseline.json
- .mdkg/artifacts/goal-86/bug-59-full-verification.json
- .mdkg/artifacts/goal-86/bug-59-installed-verification.json
- .mdkg/work/bug-59-refuse-native-git-metadata-as-a-skill-mirror-destination-even-with-force.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- .mdkg/work/chk-636-verify-native-git-metadata-exclusion-from-skill-mirrors.md

## Follow-up Refs

- root:bug-60; root:test-488; root:task-828; root:goal-86; root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-59-baseline.json
- .mdkg/artifacts/goal-86/bug-59-full-verification.json
- .mdkg/artifacts/goal-86/bug-59-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
