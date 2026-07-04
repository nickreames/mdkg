---
id: task-643
type: task
title: update contract-profile docs generated references changelog and release notes
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, docs, changelog, release-notes]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-640, task-641, task-642]
blocks: [task-644, test-335]
refs: [task-634, task-636]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Update repo and public documentation surfaces after source behavior is proven.

# Acceptance Criteria

- README, `CLI_COMMAND_MATRIX.md`, generated command docs, docs site source,
  examples/fixtures, `CHANGELOG.md`, and release notes describe the implemented
  `0.4.1` behavior.
- Docs distinguish `contract_profile`, `resource_profile`, WORK `kind`,
  WORK_ORDER `artifact_policy`, RECEIPT `redaction_policy`, `receipt_kind`, and
  `redaction_class`.
- Docs state that Omni Room owns runtime policy, queue execution, final receipt
  normalization, and downstream adoption.
- Generated docs are refreshed through existing generators, not hand-edited.
- Every publish-bound change is mapped to the `0.4.1` changelog/release notes.

# Files Affected

- README and command matrix.
- Generated docs source/output.
- Docs site source and release notes data.
- Changelog and examples/fixtures.

# Implementation Notes

- Public docs may claim only behavior already implemented and tested in this
  repo.
- Keep version references aligned with `package.json` when the implementation
  bumps to `0.4.1`.

# Test Plan

- `npm run docs:check`
- `npm run cli:check`
- `npm run cli:contract`
- `node scripts/assert-publish-ready.js`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:demo-graph`

# Links / Artifacts

- `task-634`
- `task-636`
