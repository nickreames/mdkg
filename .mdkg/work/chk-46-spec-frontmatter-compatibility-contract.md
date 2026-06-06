---
id: chk-46
type: checkpoint
title: SPEC frontmatter compatibility contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-268-define-canonical-spec-frontmatter-and-compatibility-rules.md]
relates: [task-268]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-268]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-268` defined the canonical SPEC frontmatter and compatibility contract
for goal-8. The contract preserves current parser/template behavior while
separating required keys, optional keys, extension policy, unknown-key
diagnostics, capability indexing expectations, and migration rules.

# Scope Covered

- Required SPEC frontmatter keys and enum values.
- Optional canonical keys accepted by the current template schema.
- Capability indexing expectations for SPEC routing fields.
- Unknown-key severity policy.
- Compatibility and migration policy for default and richer SPEC templates.
- Downstream-only product-specific extension policy.

# Decisions Captured

- Canonical mdkg SPEC frontmatter remains closed-schema.
- `status`, `priority`, and `skills` remain work-node concepts, not SPEC
  frontmatter.
- Downstream extension keys require downstream-local template schemas and must
  not be promoted into canonical mdkg generic examples.
- The current `mdkg new spec` scaffold remains compatibility source until a
  later implementation task changes it.

# Implementation Summary

Only mdkg graph/design state changed. `task-268` now carries the frontmatter
contract, and `edd-14` gained the `spec-frontmatter-contract` discovery alias.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js capability search "SPEC frontmatter contract" --json`
- `node dist/cli.js capability search "SPEC section contract" --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-269` must define layout, naming, and template taxonomy.
- `task-270` must specify future validation diagnostics and command surface.
- `test-99` remains the frontmatter/section completeness validation node.

# Links / Artifacts

- `goal-8`
- `task-268`
- `epic-46`
- `edd-14`
