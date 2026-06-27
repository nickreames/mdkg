---
id: test-292
type: test
title: manifest capability index search and command compatibility contract
status: done
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
updated: 2026-06-26
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

- PASS: `node --test dist/tests/commands/capability.test.js` covers
  canonical `MANIFEST.md` capability records, legacy `SPEC.md` records,
  manifest metadata, and bridge search aliases.
- PASS: `node --test dist/tests/commands/spec.test.js` covers
  `mdkg manifest list/show/validate`, retained `mdkg spec list/show/validate`,
  manifest-first JSON metadata, and legacy alias help text.
- PASS: `node --test dist/tests/commands/cli.test.js` and
  `node --test dist/tests/commands/cli_help_matrix.test.js` cover CLI help
  routing for `manifest` and `spec`.
- PASS: `npm run smoke:capabilities`.
- PASS: `node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json`
  returned `dec-50`, `edd-54`, and the dogfood `spec.mdkg-cli` record.
- PASS: `node dist/cli.js capability search "spec.md compatibility alias" --json`
  returned `dec-50`, `edd-54`, and the dogfood `spec.mdkg-cli` record.
- PASS: `node dist/cli.js manifest list --json` returned the dogfood
  manifest capability record through the canonical command surface.

# Notes / Follow-ups

- Compatibility shape selected: capability records keep `kind: spec` for
  existing consumers and expose `manifest.semantic_kind`,
  `manifest.source_basename`, `manifest.compatibility_mode`, `manifest.legacy`,
  `manifest.deprecated`, and command-family metadata alongside it.
