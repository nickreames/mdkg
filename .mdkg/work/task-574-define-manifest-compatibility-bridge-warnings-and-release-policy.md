---
id: task-574
type: task
title: define MANIFEST compatibility bridge warnings and release policy
status: todo
priority: 1
epic: epic-194
parent: goal-37
prev: task-573
tags: [manifest, spec, compatibility, deprecation, policy]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, dec-26, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-compatibility-bridge, spec-deprecation-policy, manifest-release-policy]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Record and enforce the compatibility bridge before source edits. This task
turns `edd-54` and `dec-50` into concrete implementation policy for command
names, warning text, transitional frontmatter, and release-window expectations.

# Acceptance Criteria

- `mdkg manifest ...` is recorded as the canonical future command family.
- `mdkg spec ...` remains as a legacy alias for one compatibility release with
  manifest-first output and deprecation labeling.
- Exact warning text is recorded for legacy `SPEC.md` files.
- Policy is explicit for `MANIFEST.md` with `type: spec`: accept for one
  compatibility release, emit a warning, and normalize internally to manifest
  semantics.
- Compatibility window is named as one compatibility release in release notes
  or task evidence.
- Duplicate `MANIFEST.md` plus `SPEC.md` handling is specified as a validation
  error, not a warning.

# Files Affected

- `.mdkg/design/dec-50-manifest-md-is-canonical-and-spec-md-is-legacy-alias.md`
- implementation notes in this task or follow-up checkpoint
- later release notes and docs tasks

# Implementation Notes

- Recommended legacy warning shape:
  `SPEC.md is legacy; MANIFEST.md is the canonical manifest filename. Rename
  this file before the compatibility release closes.`
- Transitional bridge warning shape:
  `MANIFEST.md uses legacy type: spec; use type: manifest before the
  compatibility release closes.`
- Do not use "spec" as the primary noun in new public docs unless describing
  the legacy bridge.

# Test Plan

- `mdkg show dec-50 --json`
- `mdkg show goal-37 --json`
- Future implementation proves this policy via `test-290` and `test-291`.

# Links / Artifacts

- `edd-54`
- `dec-50`
- `test-290`
- `test-291`
