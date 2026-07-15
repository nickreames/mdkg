---
id: chk-521
type: checkpoint
title: Real root no-touch archive and subgraph baseline
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-446]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-446]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

Approved real-root baseline captured at /private/tmp/mdkg-goal71-root-baseline. Root HEAD fe2a2fe66b09f91384ab2808324007a98805542a; status is only dirty projects/mdkg plus untracked clean projects/omni-templates. Protected archive manifest: 16 files, digest 6320ffbbf638401fe5444a93ab4adc5d3dd82c09654477e2a6cc4b2eaeb4c836. Eight local ZIP manifest digest 08b059b3050973e47558c162ced57645a0169633d3e6e3bc8a69cff91380defa. Eight bundle manifest digest e67e9c407cfaf3fbdecb79919c8d4197acb97e7245e48caedcc92c7a55ed1270. Child-state manifest digest 63a74ca11c7791d42a3a597be8911733c7fd8bd4fe634e344e74cb08080058bb. No materialized subgraph directory exists. v0.5.1 read-only status/validate passed with zero errors; seven stale subgraphs and historical heading warnings are separately recorded.

# Scope Covered

- Completed node: test-446 (Real root baseline classifies unrelated state and proves no-touch hashes)
- Node type: test
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: test-446
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of test-446 was recorded through the structured task lifecycle.
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
