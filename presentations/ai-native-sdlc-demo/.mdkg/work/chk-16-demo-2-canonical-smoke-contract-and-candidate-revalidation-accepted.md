---
id: chk-16
type: checkpoint
title: Demo 2 canonical smoke contract and candidate revalidation accepted
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-48]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-48]
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Replaced the stale fixture-only Demo 2 route sentinel with positive static, noindex, provenance, output-registry, unlisted, and zero-JavaScript coverage. All affected smoke families passed serially; candidate and fallback hashes remain unchanged.

# Scope Covered

- Completed node: task-48 (Reconcile the canonical Demo 2 smoke contract and revalidate the accepted candidate)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-48
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of task-48 was recorded through the structured task lifecycle.
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

- artifacts/demo-002/smoke-contract-receipt.json
- artifacts/demo-002/candidate-revalidation.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
