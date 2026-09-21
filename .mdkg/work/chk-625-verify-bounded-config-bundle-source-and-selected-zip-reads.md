---
id: chk-625
type: checkpoint
title: Verify bounded config bundle source and selected ZIP reads
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-48-current-validation.json, .mdkg/artifacts/goal-86/bug-48-installed-verification.json]
relates: [bug-48]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, test-487, task-828, task-838, bug-46, bug-47, bug-49]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-624]
aliases: []
skills: []
scope: [bug-48]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

Local Bug48 verified:164 focused and90 installed cases pass; full1647 discovery has1614 passes/33 sandbox OS-proof failures, all38 affected-family cases pass natively. Retain both receipts. Linux final review and exact release seal remain open; no blocked scan context accessed.

# Scope Covered

- Completed node: bug-48 (Inspecting repository config or bundle sources can block on special files)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-48
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-48 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Config uses a fixed8MiB contained read; source freshness streams only after
  payload validation; selected ZIP paths are admitted and bounded on the same
  nonblocking descriptor. Explicit external/linked regular ZIPs remain valid.
- One completed independent Bug48 review cycle identified the remaining ZIP
  leaf-substitution path; this continuation corrected it and tested the fix.
  No second scan, blocked-context access or historical evidence recovery occurred.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written
- npm run build and build:test passed. Focused164/164; installed30/30 each on
  Node24.15.0/24.18.0/26.0.0 macOS arm64. Full manifest discovery executed1647:
  1614 pass/33 sandbox OS-proof failures. The unchanged38-case interrupted-writer
  family passed natively afterward. Both outcomes and log hashes are retained.
- CLI/docs/CI-projection checks passed; full graph validation passed with zero
  errors/three preserved stale-bundle warnings; changed-only passed with zero
  errors/warnings; all five generated-index projections verified fresh;
  git diff --check passed. Protected hashes match, runtime has five released
  leases and zero active leases/queues/messages; no mutation lock remains.
- Installed candidate9ec001408ccc8f3549b0768e163e5a638f2bf60b3545d024787f0bc84f43a786
  matched all230 source/installed file hashes before and after tests. This is
  intermediate offline qualification with lifecycle scripts skipped, not a seal.

## Pass / Fail Status

- status: done

## Known Warnings

- Three pre-existing stale imported-bundle warnings remain. No refresh authorized.
- Linux, independent final review, coverage/full release ladder and seal remain
  open. Windows unqualified. Earlier published-version impact is not assessed.

# Known Issues / Follow-ups

- Goal86 active, Goal85 paused, release NOT_READY. Bug46/47 native feasibility
  planning is approved, but dependency/distribution adoption is not. The next
  safe independent source remedy is Bug49; do not reopen blocked scan context.
- Custody accepted from main85226b5 (55 ahead/0 behind cached origin/main);
  no remote check. Local commit only. No runtime writer lease was acquired;
  transient mutation locks are released by commands. The goal pointer is not
  a runtime lease or a claim that all release gates passed.
- Selected Goal73 SHA256 f996926a868b7c06fb29311fb69c48d862e9dc354404f777df93e1c5443b07ab;
  runtime DB b1f2bfb3c9ebd254d520eb7f47c12c2fa18daf691056fe97ba1890f94d013a81;
  protected Demo3 bundle741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b.
  These must match final bookends. Generated .mdkg/index/mdkg.sqlite stays unstaged.

## Exact Local Commit Allowlist

- src/core/config.ts
- src/commands/bundle.ts
- src/util/zip.ts
- tests/commands/bundle_state.test.ts
- tests/commands/source_read_admission.test.ts
- tests/core/config_read_admission.test.ts
- tests/util/zip_file_read.test.ts
- tests/fixtures/source-read-admission.cjs
- .mdkg/artifacts/goal-86/bug-48-current-validation.json
- .mdkg/artifacts/goal-86/bug-48-installed-verification.json
- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/work/bug-48-inspecting-repository-config-or-bundle-sources-can-block-on-special-files.md
- .mdkg/work/goal-86-complete-mdkg-0-6-0-remediation-and-launch-qualification.md
- .mdkg/work/task-828-independently-verify-all-mdkg-0-6-0-publication-blocker-fixes.md
- .mdkg/work/task-838-bind-release-fixtures-to-isolated-git-state-owned-cleanup-and-immutable-candidat.md
- .mdkg/work/test-488-verify-fresh-standard-security-remedies-and-adjacent-qualification-corrections.md
- .mdkg/work/chk-624-capture-security-findings-partial-remediation-and-evidence-custody-gates.md
- .mdkg/work/chk-625-verify-bounded-config-bundle-source-and-selected-zip-reads.md

The earlier uncommitted chk624 inventory belongs to this same accepted custody;
its history is retained and its recovery recommendation explicitly superseded.
No raw scan files, caches, runtime payloads or unrelated work are included.
Skill coverage: pursue-mdkg-goal, fix-finding, source-grounded-diagnose-and-fix,
verify-close-and-checkpoint and local Git preflight. New skill candidates: none.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/security-findings-checkpoint-20260918.json
- .mdkg/artifacts/goal-86/bug-48-current-validation.json
- .mdkg/artifacts/goal-86/bug-48-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
