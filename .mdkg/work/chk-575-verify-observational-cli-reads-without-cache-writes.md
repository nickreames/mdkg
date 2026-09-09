---
id: chk-575
type: checkpoint
title: Verify observational CLI reads without cache writes
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-21-verification.json]
relates: [bug-21]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-21]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

bug-21 was marked done through the mdkg task lifecycle.

Local outcome: legacy and v2 inspection no longer persist authored/imported
caches; next and automatic pack skill discovery no longer write caches. Explicit
indexing and no-cache in-memory derivation remain supported. Configuration
auto_reindex=false is respected by the five affected commands. No v2 ambiguity
or mutation authority was broadened.

Evidence: 23 installed regression tests each on Node 26.0.0 and 24.18.0, all
passing without skips. Published 0.5.2 is integrity-verified and reproduces
24/24 unexpected-write cases. Final full suite: 1059 source and 26 release/
security-contract tests pass; 19 focused legacy pack/show controls pass. Three
test fixtures now index explicitly, retaining all original assertions. Build,
CLI/docs parity, graph full/changed-only, SQLite verification and diff checks
pass. Full graph has three existing stale-subgraph age warnings, not zero.

Changed source: src/graph/index_cache.ts and commands list, next, pack, search,
show. Added tests/commands/observational_reads.test.ts; adjusted only explicit
cache setup in pack.test.ts, show_errors.test.ts and show_nodes.test.ts. Audit
nodes/evidence and required index projections are owned mdkg changes. This
milestone joins audit chk-574 in the reviewed local commit unit. Exclude the
partial bug-17 source/test/node/artifact unit and generated SQLite from staging.

Protected selected Goal 73, runtime DB and Demo 3 bundle hashes are unchanged;
the partial bug-17 patch retains its prior hashes. No new runtime lease was
acquired; transient mdkg locks release after each command. Canonical main began
at d09dd2a1f9d6f2a6692ce08fad339498b9b4dd05, 18 ahead of cached origin/main.
Only local explicit-path commit authority is used; no fresh remote verification,
push, provider, deployment, bundle refresh or publication.

This is local fix completion, not test-483/task-828 independent acceptance or
the 0.6.0 artifact seal. Six behavioral fixes, bug-17 compatibility, installed
family/runtime qualification, final review, metadata and release ladder remain.
Next independent remedy: bug-22 pack identity export. Skill coverage:
pursue-mdkg-goal, build-pack-and-execute-task, source-grounded-diagnose-and-fix,
verify-close-and-checkpoint and safe-git-publication-preflight. Candidates: none.

# Scope Covered

- Completed node: bug-21 (Keep legacy graph inspection and dry-run commands observational)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-21
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-21 was recorded through the structured task lifecycle.
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
- .mdkg/artifacts/goal-84/bug-21-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
