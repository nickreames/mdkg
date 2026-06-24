---
id: edd-36
type: edd
title: mdkg.dev pass 2 Starlight docs IA and content model
tags: [mdkg-dev, docs, starlight, ia]
owners: []
links: [https://mdkg-docs.vercel.app/]
artifacts: [mdkg_preview_polish_pass2]
relates: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
aliases: [mdkg-dev-pass-2-docs-ia]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

The docs must read as public product documentation, not as renderer/scaffold notes. Starlight remains the implementation, but public copy should focus on mdkg concepts and workflows.

# Architecture

Docs navigation should organize around:

- Start Here: install and quickstart.
- Concepts: source of truth, local-first and low-dependency, repository layout, Plan -> Work -> Evidence, work node types, reference types, glossary.
- Guides: give an agent a work node, build a context pack, create a handoff, create a research spike, record checkpoint evidence, validate before closeout, use skills with agent harnesses.
- Reference: CLI reference, node types, frontmatter fields, output formats.
- Advanced Alpha: read-only MCP, demo repos, subgraphs, bundles, archives, graph movement, project DB and queues.
- Project: changelog, roadmap, public alpha contract.

# Data Model

Public docs should distinguish:

- Canonical Markdown graph files.
- Generated/search/index artifacts.
- Source docs and examples.
- Internal evidence nodes and noindex/private review artifacts.

# APIs / Interfaces

- Existing Starlight routing and build commands remain the docs interface.
- Generated CLI reference should derive from command contract metadata when available; manual placeholder duplication should be avoided.

# Failure Modes

- Public docs mention Starlight/GitBook implementation details instead of mdkg.
- Claims Evidence Matrix appears as user-facing navigation.
- `/docs` on the marketing site becomes a second docs home instead of being removed or redirected.

# Testing Strategy

- Build docs.
- Validate nav and route inventory.
- Check no public renderer/scaffold language.
- Check docs pages cover P0/P1/P2/P3 story expectations.

# Links / References

- `goal-32`
- `task-510`
- `task-513`
- `prd-7`

# Observability

# Security / privacy

# Rollout plan
