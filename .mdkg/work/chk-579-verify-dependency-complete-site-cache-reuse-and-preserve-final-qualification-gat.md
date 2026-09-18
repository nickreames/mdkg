---
id: chk-579
type: checkpoint
title: Verify dependency-complete site cache reuse and preserve final qualification gates
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [bug-25]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-25]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Owner mdkg-project-agent: four failing-before regressions; 13 focused tests each on Node 24.18.0 and 26.0.0; shared-cache runtime separation and two real Astro builds/two hits verified. Build, 1130 source tests plus 26 contracts, CLI/docs/graph/SQLite/diff pass. Root-level tests ran separately; final task-828/829 and release seal remain open. No public-copy, bundle, provider or remote mutation. Protected state and partial bug-17 work preserved.

# Scope Covered

- Completed node: bug-25 (Invalidate site build caches on external source dependencies)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-25
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-25 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-behavioral-audit.json
- .mdkg/artifacts/goal-84/bug-25-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
