---
id: chk-522
type: checkpoint
title: Global v0.5.1 real root archive ownership proof
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-447]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-447]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

Global /opt/homebrew/bin/mdkg resolves to registry mdkg 0.5.1. Real-root archive compress --all selected only workspace root, compressed eight local archives, and excluded 27 imported projections with reason read_only_imported_subgraph. All eight raw source hashes, all eight ZIP hashes, and all eight bundle hashes match the sealed baseline. Child HEADs/trees and root gitlinks are unchanged; clean child repos remain clean; projects/omni-templates remains acknowledged untracked no-touch state; no materialized subgraph directory exists. The only root changes are eight owned archive sidecars advancing updated from 2026-07-13 to 2026-07-15. Archive verify passed 8/8. Root validate passed with zero errors and the same 214 historical heading plus nine stale-subgraph warnings.

# Scope Covered

- Completed node: test-447 (Global v0.5.1 compress all proof mutates only root-owned archive outputs)
- Node type: test
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: test-447
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of test-447 was recorded through the structured task lifecycle.
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

- No artifacts were attached by the completion command.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
