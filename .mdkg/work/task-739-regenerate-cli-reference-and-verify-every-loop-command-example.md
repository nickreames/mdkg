---
id: task-739
type: task
title: Regenerate CLI reference and verify every loop command example
status: todo
priority: 1
epic: epic-239
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-738]
blocks: [task-740, test-405, test-406]
refs: [test-405, test-406, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, epic-239, dec-74, prop-8, task-710, task-737, task-738]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Make generated descriptors/reference output the single syntax authority and
prove every hand-written loop example remains executable or observational as
documented.

# Acceptance Criteria

- Regenerate the CLI command matrix and docs reference from current command
  descriptors using repository-owned scripts.
- Verify `new loop` plus `loop list/show/fork/plan/next/runs` public help and JSON
  envelopes match the v0.5.0 release candidate.
- Parse or execute safely every loop command shown on mdkg.dev/docs, including
  the full security walkthrough sequence.
- Ensure dry-run examples are observational and use current flags
  (`--pack-profile` versus `--profile` must follow live help).
- Fail docs checks on invented `loop run`, `resume`, `execute`, `note add`, or
  unsupported answer commands.
- Keep generated references gated from dormant public output where required,
  without weakening repository docs/source truth.
- Preserve existing goal and Omni semantic-file command/reference behavior.

# Files Affected

- Descriptor-generated `CLI_COMMAND_MATRIX.md` and docs reference outputs
- Command-example validation fixtures/scripts
- Focused docs contract tests

# Implementation Notes

- Inspect live `node dist/cli.js help` output before locking examples.
- Use placeholder identities and temporary workspaces; do not mutate the root
  graph while parsing public examples.
- Generated files should change only through canonical generation commands.

# Test Plan

Run `npm run cli:check`, `npm run cli:contract`, `npm run docs:check`,
`test-405`, and `test-406`; compare generated output and execute examples in a
temporary fixture with ID/dry-run assertions.

# Links / Artifacts

- `CLI_COMMAND_MATRIX.md`
- `test-405`
- `test-406`
