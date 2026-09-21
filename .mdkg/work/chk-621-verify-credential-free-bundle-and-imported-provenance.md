---
id: chk-621
type: checkpoint
title: Verify credential-free bundle and imported provenance
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-44-local-verification.json]
relates: [bug-44]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-837, test-488, task-828, task-839]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
scope: [bug-44]
created: 2026-09-18
updated: 2026-09-18
---
# Summary

Local Bug44 remedy verified:49 installed scenarios each on Node24.15/24.18/26 macOS arm64;67 focused source tests plus final fixture extension; independent review gaps reproduced and fixed. No final release clearance; Linux, Task828, full ladder and seal remain.

# Scope Covered

- Completed node: bug-44 (Public bundle export can disclose credentials embedded in the origin URL)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-44
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-44 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.
- Six source files and three regression files implement the shared descriptor
  boundary; exact hashes and thirteen-path local commit allowlist are in the
  attached receipt. Original historical bundles/configuration remain unchanged.
- The one independent candidate review found two gaps; parent reproductions
  failed20/47 before refinement. Both were corrected, with49 installed scenarios
  passing on each required Node runtime on macOS arm64. This is not a second
  independent acceptance or final-artifact seal.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: three pre-existing stale imported-bundle warnings remain. Protected
  Demo3, selected Goal73 and runtime DB before/after hashes match. No refresh.

# Known Issues / Follow-ups

- Goal86 remains active; Bug45 is the next security-remediation candidate.
  Linux, test488, Task828, complete ladder and exact final seal remain open.
  Goal85 remains paused. Broad docs polish is later; release-critical guidance
  stays required under Task839. No push/publication/provider/consumer action.
- Main base923b3675 was52 ahead of cached origin/main with no staged work before
  this unit. The derived SQLite index remains owned/generated and excluded from
  the local commit; no unknown dirty path was absorbed.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-44-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
