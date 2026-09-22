---
id: chk-632
type: checkpoint
title: Verify safe loop seed admission before node creation
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-55-baseline.json, .mdkg/artifacts/goal-86/bug-55-full-verification.json, .mdkg/artifacts/goal-86/bug-55-installed-verification.json]
relates: [bug-55]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-56]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-631]
aliases: []
skills: []
scope: [bug-55]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

1879 full tests and 189 installed cases pass; blocked context untouched; release remains NOT_READY

# Scope Covered

- Completed node: bug-55 (Creating a loop can read an external file through a linked seed template)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- new-loop pre-write guidance admission, shared loop-seed loader and loop
  catalog/direct-seed callers; synthetic regression suite and sanitized evidence.
- Bug55/Goal86 lifecycle and required generated projections. The tracked SQLite
  cache remains preserved dirty custody, excluded from the local commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Preserve title-only suggestions, direct-selection isolation, sorting and absent
  catalogs. Use existing contained readers and capped template limits.
- One writer on main; no blocked context, historical scan recovery, remote Git,
  provider/deployment, publication or bundle refresh.

# Implementation Summary

- Validate the seed catalog before reservation/writes and reuse that output
  snapshot. Reject linked paths, special files and malformed guidance without
  authored/index/selection/runtime/Git-index changes or external opens.
- Independent prepatch and candidate source reviews; candidate reported no
  concrete bypass/regression. Not final Task828 release acceptance.

# Verification / Testing

## Command Evidence

- Full discovered suite:1879/1879 pass,0 fail/skip;422940ms,Node26/macOS arm64.
- Seed safety:63 pass; nearby compatibility:109 pass.
- Exact installed candidate:63 each on Node24.15.0/24.18.0/26.0.0;189 total.
- CLI/docs/workflow, full/changed graph, SQLite and diff checks pass.
- Intermediate tarball SHA256:
  9d55271507571235d2e3c5d7257dd7e8f8abc7abdff8e20a9cd800fe9ac4f024.
  All231 installed files unchanged. This artifact is not the final release seal.

## Pass / Fail Status

- status: done

## Known Warnings

- Three pre-existing stale imported-bundle warnings remain; no refresh.
- Linux and final independent review/qualification remain unverified here.

# Known Issues / Follow-ups

- Ten of14 retained findings have local remedies. Bugs46/47/56/57, adjacent
  Bugs58-60, Task828, platform coverage, full ladder/coverage and seal remain open.
- Bug56 still owns complete resource/provenance reuse acceptance. Static seed
  containment does not close Bug47's concurrent ancestor substitution race.
- Protected selected Goal73, runtime DB and Demo3 bundle hashes match entry;
  five released runtime leases, zero queue/messages, no held mutation/Git lock.
- Goal86 remains active; Goal85 paused; release NOT_READY. Next: Bug56.
- Skill coverage reused; new candidates:none. No skill authoring.

## Follow-up Refs

- root:bug-56; root:test-488; root:task-828; root:goal-86; root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-55-baseline.json
- .mdkg/artifacts/goal-86/bug-55-full-verification.json
- .mdkg/artifacts/goal-86/bug-55-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
