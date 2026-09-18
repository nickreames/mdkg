---
id: chk-622
type: checkpoint
title: Verify graph-owned transport admission before import effects
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-45-local-verification.json]
relates: [bug-45]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-837, test-488, task-828, test-487, task-839]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
scope: [bug-45]
created: 2026-09-18
updated: 2026-09-18
---
# Summary

Local Bug45 remedy verified:167 installed scenarios each on Node24.15/24.18/26 macOS arm64;154 focused source tests; independent configured-output bypass reproduced and fixed. Preserved historical/private controls and protected state. Linux, Task828, full ladder and final seal remain open.

# Scope Covered

- Completed node: bug-45 (Restoring a historical-format bundle can install active Git metadata)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-45
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-45 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Five source files and two regression files establish complete transport
  admission, including automatic root-config cache destinations. Exact hashes
  and the eleven-path local commit allowlist are in the attached receipt.
- Original72/106 failures and57/167 expanded first-candidate failures are
  resolved. The latter include the independently found output-destination gap
  and three parent-identified optional-label compatibility controls.
- Historical/private assets and custom caches remain usable. No active Git
  payload execution, general payload trust or final security clearance is claimed.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: three pre-existing stale imported-bundle warnings remain. The
  generated index is refreshed after this evidence batch; protected Demo3,
  selected Goal73 and runtime DB hashes match.

# Known Issues / Follow-ups

- Goal86 stays active; Bug46 is the next security-remediation candidate.
  Test487/488, Task828, the full ladder and exact final artifact seal remain
  open. Goal85 stays paused. No remote Git, publish or provider action.
- Main base d44831b6 was53 ahead of cached origin/main with nothing staged.
  Only the attributable eleven-path unit is commit-eligible; derived SQLite
  remains owned/generated and unstaged. No unknown work was absorbed.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-45-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
