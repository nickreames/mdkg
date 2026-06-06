---
id: epic-46
type: epic
title: SPEC schema section semantics and frontmatter contract
status: done
priority: 1
tags: [spec, schema, frontmatter, sections]
owners: []
links: []
artifacts: [.mdkg/templates/specs/base.SPEC.md, .mdkg/templates/default/spec.md]
relates: [goal-8, task-266, task-267, task-268, test-99]
blocked_by: []
blocks: [task-266, task-267, task-268, test-99]
refs: [edd-14, dec-21, dec-24]
aliases: [spec-section-contract, spec-frontmatter-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define the generic SPEC contract that all later templates and validators should
honor.

# Goal

Make SPEC section and frontmatter rules decision-complete before implementation.

# Scope

- Required and optional section semantics.
- Canonical frontmatter keys.
- Compatibility and extension policy.

# Milestones

- Complete `task-266`, `task-267`, `task-268`, and `test-99`.

# Acceptance Criteria

- Required and optional sections have clear semantics.
- Frontmatter keys have a canonical meaning and compatibility policy.
- Markdown remains the canonical authoring surface.
- No downstream product naming is introduced.

# Out of Scope

- Source parser or validator implementation.

# Risks

- Vague section names create README-like specs instead of enforceable
  contracts.

# Closeout Evidence

- `task-266`, `task-267`, and `task-268` are done.
- `test-99` is done and records section/frontmatter validation evidence.
- `chk-44`, `chk-45`, and `chk-46` record the audit, section, and
  frontmatter closeout summaries.
- `node dist/cli.js capability search "SPEC section contract" --json` and
  `node dist/cli.js capability search "SPEC frontmatter contract" --json`
  resolve the generic `edd-14` design anchor.
- Source parser/validator implementation remains deferred.

# Links / Artifacts

- `goal-8`
- `.mdkg/templates/specs/base.SPEC.md`
