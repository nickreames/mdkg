---
id: test-292
type: test
title: manifest capability index search and command compatibility contract
status: todo
priority: 1
epic: epic-196
parent: goal-37
tags: [manifest, capability-index, search, cli, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-578]
context_refs: []
evidence_refs: []
aliases: [manifest-index-search-contract, spec-command-compatibility-contract, manifest.md, manifest.md-legacy-spec.md, spec.md-compatibility-alias]
skills: []
cases: [capability-kind-manifest, legacy-kind-spec, search-manifest-md, search-spec-md]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Prove capability indexing, search, and manifest/spec command output remain
useful for both canonical and legacy terms.

# Target / Scope

- `task-578`

# Preconditions / Environment

Build and index are current after canonical and legacy fixtures are added.

# Test Cases

- `mdkg capability list` includes canonical manifest records.
- Legacy `SPEC.md` records remain discoverable during compatibility.
- `mdkg capability search "MANIFEST.md legacy SPEC.md" --json` returns
  relevant records.
- `mdkg capability search "spec.md compatibility alias" --json` remains useful.
- `mdkg manifest` command output is manifest-first.
- The retained `mdkg spec` command path clearly labels legacy behavior or
  redirects to manifest-first terminology for one compatibility release.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- If `kind: spec` must remain in JSON for compatibility, record the migration
  shape and expose manifest metadata alongside it.
