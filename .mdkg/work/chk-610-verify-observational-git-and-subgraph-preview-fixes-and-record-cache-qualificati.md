---
id: chk-610
type: checkpoint
title: Verify observational Git and subgraph preview fixes and record cache qualification blocker
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/observational-boundary-verification.json]
relates: [bug-35, bug-40, bug-42]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-86, goal-84, dec-96]
evidence_refs: [chk-609]
aliases: []
skills: []
scope: [bug-35, bug-40]
created: 2026-09-15
updated: 2026-09-15
---
# Summary

Bug35 and Bug40 are locally verified and closed. Goal86 remains NOT_READY:
the mounted semantic qualification exposed Bug42, and all final platform,
security, release-ladder and artifact-sealing obligations remain open.

# Scope Covered

- root:bug-35: four observational Git helpers force optional-lock suppression
  regardless of caller environment; existing hardened git inspect is unchanged.
- root:bug-40: subgraph sync preview checks format without a mutation lock and
  cannot create missing output parents. Actual sync keeps its lock and outputs.
- root:bug-42: new failed qualification, not included in this completion scope.

## Changed Surfaces

- Source: src/commands/bundle.ts, src/commands/subgraph.ts,
  src/commands/validate.ts and src/graph/subgraphs.ts. Preserve accepted partial
  Bug17 transport changes in the overlapping bundle/subgraph files.
- Regressions: tests/fixtures/git-observation.cjs,
  tests/commands/git_observation.test.ts and scripts/smoke-git-boundary.js.
- Scoped graph records, sanitized evidence and required index/event projections.
  The evidence artifact binds the exact source and regression hashes.

## Boundaries

- Explicit Goal86 Run; mdkg-project-agent is the single canonical writer.
- No remote Git, staging, commits, publication, providers or deployments occurred.
  Canonical bundles, runtime DB, selection and Git index retain their baseline
  hashes. Synthetic Git and APFS mutations occurred only in owned temporary fixtures.
- The APFS image was detached. No canonical branch/worktree or graph migration,
  bundle/subgraph refresh, host service or global configuration change occurred.

# Decisions Captured

- Intermediate installed evidence is not final-artifact or platform clearance.
- The broader mounted qualification remains failed; do not reinterpret per-fixture
  collector labels as passes when its explicit qualification_pass is false.
- Bug42 enters the existing bounded remediation lane after Bug41, before finalized
  package inputs. This does not waive or reopen completed historical evidence.

# Implementation Summary

CLI-only fixtures exercise standalone repositories, real linked worktrees,
submodules and separate gitdirs, dirty/staged controls, unset/overridden caller
policy, absent caches, unsupported formats, competing locks and missing parents.
Native Git positive controls establish that the fixtures can observe index writes.
Inventories plus selected synchronous mutation traps are bounded evidence, not
a universal syscall audit or configured-helper security guarantee (Bug41).

# Verification / Testing

## Command Evidence

- Build and test build passed. Full `node scripts/test-built.js`: 1,409 passed,
  zero failed/skipped on Node24.18.0. This preceded a test-only lock-timeout
  restoration; all three later installed runs exercised that correction.
- One intermediate 222-file tarball, still version0.5.2, SHA256
  112a1313af33aa20fbcdb12e08a1918216a1f4e087e39ce4523a22bae5381db8:
  each Node24.15.0,24.18.0,26.0.0 passed 288 observation cases,
  26 removed-invocation refusals and16 retained-inspection controls on macOS.
  Prepack was skipped for this intermediate fixture only; it is not the final seal.
- Read-only APFS:12 variants and126 CLI reads per runtime, plus packs/MCP.
  EROFS probes, complete inventory preservation and sync previews passed;
  four metadata failures per runtime remain (12 total), owned by Bug42.
- CLI parity and documentation checks passed (63 files,470 examples,zero failures).
  Post-checkpoint required index regeneration: full graph zero errors/three
  preserved stale-import warnings; changed-only zero errors/warnings; all five
  SQLite/index projections fresh; git diff --check passed.

## Pass / Fail Status

- Bug35/40 local remedies: pass. Wider installed semantic qualification: fail.
- Final0.6.0 artifact, Linux, fresh Standard and independent diff: unverified.

## Known Warnings

- Three inherited stale imported-subgraph warnings remain intentionally preserved.
- Copied legacy JSON caches can hide current authored metadata on show/search,
  including SQLite-configured graphs; no cache repair was used to hide the failure.

# Known Issues / Follow-ups

Continue Bug17 transport completion using its preserved partial patch and fresh
source-only candidate intake. Then Bug39/41/42, writer compatibility/recovery,
installed/platform acceptance, draft metadata, fresh security review, full ladder
and exact artifact sealing remain. Goal85 stays paused for separate approval.

## Follow-up Refs

- bug-17, bug-39, bug-41, bug-42, task-835, task-836, task-837, test-487,
  task-826, task-827, task-828, task-829, task-830 and goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-35-readonly-git-index-reproduction.json
- .mdkg/artifacts/goal-84/bug-35-affected-versions.json
- .mdkg/artifacts/goal-86/observational-boundary-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
