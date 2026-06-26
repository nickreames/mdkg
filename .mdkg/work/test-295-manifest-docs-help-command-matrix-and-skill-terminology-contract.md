---
id: test-295
type: test
title: manifest docs help command matrix and skill terminology contract
status: todo
priority: 1
epic: epic-197
parent: goal-37
tags: [manifest, docs, help, skills, command-matrix]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-581]
context_refs: []
evidence_refs: []
aliases: [manifest-docs-help-contract, manifest-skill-terminology-contract]
skills: []
cases: [docs-prefer-manifest, legacy-spec-note, skill-manifest-language, generated-cli-reference]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Prove documentation, command help, generated references, and skills explain
manifest-first behavior while preserving legacy SPEC searchability.

# Target / Scope

- `task-581`

# Preconditions / Environment

Docs and generated command reference have been refreshed from current source.

# Test Cases

- README and docs prefer `MANIFEST.md`.
- Migration note says `SPEC.md` is a legacy alias for one compatibility
  release.
- CLI help and command matrix do not imply manifests execute shell commands.
- `author-mdkg-skill` and mirrored skill docs use manifest-first terminology.
- `docs:check`, `cli:check`, and skill validation pass.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Keep deliberate `SPEC.md` mentions for compatibility and migration only.
