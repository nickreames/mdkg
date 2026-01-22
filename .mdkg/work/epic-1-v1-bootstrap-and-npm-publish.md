---
id: epic-1
type: epic
title: v1 bootstrap and npm publish
status: done
priority: 1
tags: [mdkg, release, v1]
owners: []
links: [npm:mdkg]
artifacts: []
relates: [dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, dec-7, edd-1]
blocked_by: []
blocks: []
refs: [rule-1, rule-2, rule-3, rule-4, rule-5, rule-6]
aliases: []
created: 2026-01-06
updated: 2026-01-22
---

# Goal

Ship mdkg v1 as a usable CLI (Node 18+, TypeScript, zero runtime deps) with:

- root-only operation
- registered workspaces
- global indexing + search
- deterministic context packs
- validation + formatting
- next (chain + priority)
- checkpoints
- published to npm

# Scope

Included:

- repo scaffolding (package.json, tsconfig, src layout)
- `.mdkg` rules/design docs/templates/work items (dogfooding)
- CLI commands for v1
- npm publish safety (files whitelist)
- minimal smoke tests / scripts

# Out of Scope

- sqlite/postgres indexing (life git layer)
- per-workspace template overrides
- UI application
- external integrations (MCP server, etc.)

# Milestones

- M1: repo + build pipeline + CLI skeleton
- M2: config + workspace registry + strict frontmatter parser
- M3: indexer + global cache + search/list/show
- M4: pack (md/json/toon) + verbose core inclusion
- M5: validate + format
- M6: next (chain + priority)
- M7: checkpoints and pack integration
- M8: publish v1 to npm + create checkpoint

# Risks

- Strict frontmatter means small mistakes can block indexing (mitigated by `mdkg format` and clear errors)
- Zero runtime dependencies increases implementation burden (keep scope tight)
- Pack determinism and ordering must be consistent (centralize ordering logic)

# Links / Artifacts

Core rules:

- rule-1
- rule-2
- rule-3
- rule-4
- rule-5
- rule-6

Design:

- edd-1
- dec-1
- dec-2
- dec-3
- dec-4
- dec-5
- dec-6
- dec-7

Next tasks:

- task-1
- task-2
- task-3
