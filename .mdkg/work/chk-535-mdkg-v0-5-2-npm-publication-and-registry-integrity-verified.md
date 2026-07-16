---
id: chk-535
type: checkpoint
title: mdkg v0.5.2 npm publication and registry integrity verified
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-756]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-756]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

Published mdkg@0.5.2 from invocation HEAD 95f35b93 with source release commit 867ac709. Registry latest and dist-tag latest are 0.5.2; publication time 2026-07-16T05:04:37.374Z; tarball size 425431 bytes; unpacked size 2291554 bytes; 191 files; shasum 8226872a6c797382265a13382edea5b7a9c1e033; integrity sha512-a01iaKqgw3fv7YRi/0E1bWE0polds76ccGyOCMVzyBf35ySZHSjlTIA2DG5CgjZw2TqxKSgcVZxazrOjcB333g==. Fresh registry download matched the dry-run identity and included dist/cli.js, dist/command-contract.json, dist/commands/git_materialize.js, README.md, CLI_COMMAND_MATRIX.md, CHANGELOG.md, and scripts/postinstall.js. npm auth used a temporary npmrc with a literal NPM_TOKEN reference; token was not printed. No push, global install, root upgrade, deploy, or tag occurred in this task. Published failures are fix-forward only.

# Scope Covered

- Completed node: task-756 (publish mdkg v0.5.2 and verify registry artifact integrity)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-756
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of task-756 was recorded through the structured task lifecycle.
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
