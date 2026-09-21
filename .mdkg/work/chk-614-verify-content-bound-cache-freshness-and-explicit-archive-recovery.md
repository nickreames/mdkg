---
id: chk-614
type: checkpoint
title: Verify content-bound cache freshness and explicit archive recovery
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-42-local-verification.json]
relates: [bug-42]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-86, goal-84, dec-96]
evidence_refs: []
aliases: []
skills: []
scope: [bug-42]
created: 2026-09-15
updated: 2026-09-15
---
# Summary

Bug42 is locally verified, not release-qualified. All1,515 discovered source tests
and143 focused tests pass. One unchanged intermediate package passes242 installed
CLI-only cases and84 actual read-only APFS checks on each required Node runtime.
Goal85 remains paused; final0.6.0, Linux, Standard/diff, full-ladder and seal gates
remain open. Bug43 is the next scoped blocker.

# Scope Covered

- Completed node: bug-42 (Prevent copied legacy JSON caches from overriding current authored metadata)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Fourteen source/test paths are individually hashed in the receipt: node/skill/
  capability cache admission, parse-time archive integrity evidence, explicit
  archive compression selection and corresponding source/installed regressions.
- Bug42, Goal86 evidence, task827/test480 successor requirements and the requirement
  matrix; supported event/index/SQLite projections only. No bundle refresh.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

Derived caches now bind current authored inputs instead of trusting mtime order.
One captured read binds skill metadata, headings and hashes. Archive validity
transitions invalidate node admission even without sidecar changes. Explicit
compression selects current sidecars and preflights writes without stale-cache
dependence. No identity migration, new public flags or consumer-specific behavior.

# Verification / Testing

## Command Evidence

- Build and complete manifest-backed test discovery:1,515/1,515 passed,0 skipped.
- Focused source checks:143/143 passed. CLI/docs/contract/workflow parity passed.
- Same226-file intermediate tarball:242+84 cases per Node24.15.0/24.18.0/26.0.0,
  macOS arm64; actual mounted writes refuse EROFS, files and staging unchanged.
- Full graph validation:0 errors/3 preserved stale-subgraph warnings after index.
  Final post-checkpoint graph/SQLite/diff and protected bookends are in the receipt.
- Parent reproduced and fixed both independent review findings; strict opt-out
  and compression regressions are covered. Invalidated runs/packages are retained
  as failed/intermediate evidence, never promoted to pass.

## Pass / Fail Status

- status: locally verified; final-artifact-pass=false; publication NOT_READY

## Known Warnings

- Three intentionally preserved stale imported bundles; no refresh authority.
- Package metadata still0.5.2; the intermediate artifact is not the final seal.

# Known Issues / Follow-ups

- Bug43, tasks835/836 and finalized release inputs remain. Test480/487, task837,
  task828, task829, task830 and chk570 still require complete final evidence.
- A read-only local Docker capability check found a running linux/arm64 engine,
  but no cached official Node image or completed Linux/isolation qualification.
- Content freshness adds bounded read/parsing cost; timing samples are not SLAs.
- Fifteen owned synthetic fixture roots removed; diagnostics/artifacts retained,
  APFS image detached. No canonical data or unknown path removed.

## Follow-up Refs

- bug-43, task-827, test-480, test-487, task-828, task-837, goal-85

# Links / Artifacts

- .mdkg/artifacts/goal-86/observational-boundary-verification.json
- .mdkg/artifacts/goal-86/bug-42-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
