---
id: chk-520
type: checkpoint
title: Published v0.5.1 registry tarball and temporary consumer proof
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-445]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-445]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

npm serves mdkg@0.5.1 as latest with the approved 190-file tarball and exact SHA-1/integrity. Isolated install at /private/tmp/mdkg-v051-registry.Evt0S0 resolved mdkg 0.5.1 and passed archive help, root-qualified qid compression, --all --ws root selection evidence, archive verify, and graph validation. Isolated /private/tmp/mdkg-v050-upgrade.FBlGJI upgraded 0.5.0 to 0.5.1, preserved all managed assets, exposed seven loop seeds, and validated with zero warnings after index.

# Scope Covered

- Completed node: test-445 (Published v0.5.1 registry tarball and temporary install are verified)
- Node type: test
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: test-445
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of test-445 was recorded through the structured task lifecycle.
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
