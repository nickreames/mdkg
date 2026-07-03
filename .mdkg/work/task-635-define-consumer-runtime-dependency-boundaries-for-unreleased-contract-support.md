---
id: task-635
type: task
title: define consumer runtime dependency boundaries for unreleased contract support
status: todo
priority: 1
tags: [goal-48, runtime-boundary, release]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Define how Omni Room runtime consumers may depend on mdkg contract-profile
support before, during, and after a generic mdkg release.

The plan must prevent runtime from requiring unreleased mdkg flags or schema
fields unless they are explicitly marked experimental/local and bounded to the
consumer repo.

# Acceptance Criteria

- Stable runtime dependency requires an actual released mdkg package version
  resolved during the later execution pass, not hardcoded in this planning
  goal.
- Experimental/local runtime consumption is allowed only with explicit caveats,
  fallback behavior, and no public contract promise.
- Runtime remains responsible for enforcing Omni Room-specific policy until
  generic mdkg validators expose accepted behavior.
- Root/subgraph refresh, accepted SHA decisions, package release, and runtime
  adoption are separate gates.
- No downstream repo is mutated by this mdkg planning goal.

# Files Affected

- Planning updates under `.mdkg/work/**`.
- Future downstream handoffs may be created only when an explicit owner asks for
  them.

# Implementation Notes

- Capture the difference between generic mdkg semantic mirrors and runtime
  canonical execution state.
- Keep product/backend economics, sandbox provider semantics, and runtime
  execution policy out of the generic mdkg contract unless intentionally exposed
  as refs-only metadata.

# Test Plan

- `test-332`
- Review downstream handoff language for no hardcoded future version and no
  unreleased hard dependency.

# Links / Artifacts

- `goal-48`
- `test-332`
