---
id: test-294
type: test
title: manifest scaffold template init and upgrade compatibility contract
status: done
priority: 1
epic: epic-197
parent: goal-37
tags: [manifest, scaffold, template, init, upgrade, cli]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-580]
context_refs: []
evidence_refs: []
aliases: [manifest-scaffold-template-contract, mdkg-new-spec-legacy-contract]
skills: []
cases: [new-manifest-scaffold, new-spec-alias, init-agent-manifest, upgrade-dry-run-manifest]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Prove new scaffold, init, upgrade, and template paths produce canonical
`MANIFEST.md` output while legacy aliases remain intentional.

# Target / Scope

- `task-580`

# Preconditions / Environment

Temporary workspaces are available for init/upgrade/scaffold smoke tests.

# Test Cases

- Canonical manifest scaffold emits `MANIFEST.md`.
- Legacy `mdkg new spec` behavior follows `task-574` policy and does not
  silently create misleading output.
- Fresh `mdkg init --agent` assets use manifest-first language where relevant.
- `mdkg upgrade --json` dry-run reports manifest template changes safely.
- Legacy SPEC fixture/template support remains available for compatibility
  tests only.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Avoid updating generated docs before scaffold behavior is proven.
