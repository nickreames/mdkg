---
id: chk-585
type: checkpoint
title: Verify compact CLI onboarding and reviewed upgrade guidance
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-32-verification.json]
relates: [bug-32]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-83, goal-84, task-828, test-483]
evidence_refs: []
aliases: []
skills: []
scope: [bug-32]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Owner mdkg-project-agent under root:goal-84/root:goal-83. 1338 ordinary tests, 37 focused checks, ten installed cases each on Node 24.18.0 and 26.0.0 pass; build, CLI/docs, release contracts and graph checks pass. Exact hashes, seventeen-path commit scope and shared subgraph diagnostic-only custody: .mdkg/artifacts/goal-84/bug-32-verification.json. Final task-828 security review and full installed/release qualification remain open. Preserve selected Goal 73, runtime DB, Demo 3 and separate bug-17 changes. No remote, publish, provider, canonical migration or bundle refresh; no runtime lease. Skill candidates none.

# Scope Covered

- Completed node: bug-32 (Align CLI quickstart and repair hints with reviewed upgrade authority)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-32
- CLI help and upgrade diagnostics; compact bundled command guidance;
  generated CLI reference/contract summary and focused regression tests.
- Exact seventeen-path allowlist is in the verification artifact. Only the
  diagnostic hunk in shared subgraph.ts is included; bug-17 transport changes
  and the mixed tracked SQLite projection remain uncommitted.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-32 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- Full graph validation preserves three stale imported-bundle warnings;
  changed-only validation has no errors/warnings. No protected bundle refresh.
- Final independent security review and full installed/release qualification
  remain open; development tarball metadata is not a final 0.6.0 seal.

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-32-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
