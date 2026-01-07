---
id: edd-1
type: edd
title: mdkg cli and index architecture (v1)
tags: [mdkg, cli, index, architecture]
created: 2026-01-06
updated: 2026-01-06
---

# mdkg CLI and index architecture (v1)

## Overview

mdkg is a **TypeScript** CLI targeting **Node 18+** with **zero runtime dependencies**.

It manages a local Markdown knowledge graph stored across:
- the root workspace: `./.mdkg/`
- registered subdirectory workspaces: `<workspace>/.mdkg/` (docs live near code)

The CLI operates at repo root using:
- `.mdkg/config.json` as canonical configuration
- `.mdkg/index/global.json` as the authoritative cached index

Key goals:
- deterministic behavior
- fast search and traversal
- strict frontmatter parsing
- powerful context pack generation

## Root-only flow

All commands assume they are invoked from the repo root unless `--root` is provided.

Root validity check:
- `./.mdkg/config.json` must exist
- if missing: error with instructions (or suggest `mdkg init`)

## Configuration

Config lives at:
- `./.mdkg/config.json`

It includes:
- `schema_version`
- workspace registry
- index settings (auto reindex, tolerant mode)
- pack defaults and limits
- global templates location and default set
- work enums (status, priority bounds)

Config loading:
- strict validation of required keys
- schema migrations supported via version upgrade functions

## Workspace registry

Workspaces are explicit in config:
- alias → `{ path, enabled, mdkg_dir }`

Rules:
- aliases are lowercase and unique
- paths are relative to repo root
- `mdkg_dir` defaults to `.mdkg`

Docs live near code:
- workspace docs are in `<workspace_path>/.mdkg/...`

No runtime discovery:
- only configured workspaces are indexed and searched
- indexing scans registered workspace doc roots

## Indexing

### Source locations

Index inputs include:
- root `.mdkg/core|design|work` markdown files
- each workspace’s `.mdkg/core|design|work` markdown files

Templates are **not indexed** as nodes.

### Frontmatter parsing

Frontmatter uses a restricted subset (see rule-1 and rule-6). Parsing must be strict.

On invalid frontmatter:
- default indexing fails (exit code 2 or 4 depending on implementation)
- optional tolerant mode skips invalid nodes and continues with warnings

### Node model

Each markdown file becomes a node:
- `id`, `type`, `title`, `created`, `updated`
- optional searchable metadata: `tags`, `owners`, `links`, `artifacts`, `refs`, `aliases`
- work metadata: `status`, `priority`
- graph edges: `epic`, `parent`, `relates`, `blocked_by`, `blocks`, `prev`, `next`
- note: `refs` is a searchable reference list but is NOT traversed by default pack traversal
- note: `links` and `artifacts` store any searchable reference strings (may include URLs)

### Global uniqueness and qualified IDs

In the global index, every node has:
- `qid = <ws_alias>:<id>`
- `ws = <ws_alias>`
- `path = relative path to markdown file`

Edges are normalized to qualified IDs internally:
- local edge references without `ws:` are assumed to be in the same workspace as the node
- qualified edges (`ws:id`) resolve across workspaces

Ambiguity handling:
- if a qualified reference cannot be resolved: validation error
- if a user queries an unqualified ID that exists in multiple workspaces: CLI errors and suggests qualified IDs

### Index output format (global.json)

Root index output path:
- `./.mdkg/index/global.json`

Recommended structure:

- `meta`:
  - tool version
  - schema_version
  - generated_at
  - root path
  - included workspaces
- `workspaces`:
  - alias → `{ path, enabled }`
- `nodes`:
  - `qid` → node record:
    - `id`, `qid`, `ws`, `type`, `title`, `status`, `priority`, `created`, `updated`, `tags`, `owners`, `links`, `artifacts`, `refs`, `aliases`, `path`
    - `edges` (qualified)
- `reverse_edges`:
  - precomputed reverse adjacency by edge type for fast queries:
    - children of epic
    - blocked graph
    - prev/next chain linkers
- `aliases` (optional):
  - numeric ID counters or convenience lookups

## Staleness and auto reindex

Default behavior:
- commands requiring graph data check if `global.json` is stale:
  - global missing → stale
  - config mtime newer than global → stale
  - any `*.md` in registered `.mdkg/` docs folders newer than global → stale

If stale:
- auto rebuild index unless `--no-reindex` or config disables auto reindex

v1 keeps this simple using file mtimes. A file manifest may be introduced later if performance demands it.

## Commands architecture

Implementation approach:
- `src/cli.ts` routes to `src/commands/*.ts`
- shared logic in `src/core`, `src/graph`, `src/templates`, `src/pack`

Each command should:
1) enforce root (or resolve `--root`)
2) load config (migrate if needed)
3) ensure index ready (auto reindex if stale)
4) perform action
5) output deterministically
6) exit with stable code per rule-3

## Packs architecture

Pack generation uses:
- global index nodes/edges
- BFS traversal with configurable depth and edge selection
- deterministic ordering (rule-2)
- `--verbose` includes pinned core docs from `.mdkg/core/core.md`
- pack node headers must surface key searchable fields (at minimum: `links` and `artifacts`, plus `refs` when present)

Exports:
- Markdown (human/agent)
- JSON (programmatic agent)
- TOON (agent / structured)

Packs must enforce limits and record truncation metadata.

## Validation

Validation checks:
- strict frontmatter parsing
- required fields present by type (rule-6)
- status/priority enums valid
- edges resolve to existing nodes
- cycles in `prev/next` chains (warn or error; v1 recommend error for cycles)
- duplicate IDs in a workspace (error)
- ambiguous unqualified IDs for user queries (CLI error, not index error)

## Formatting

Formatting is conservative:
- normalizes frontmatter output format (key order, list formatting)
- enforces lowercase for keys and enums
- leaves body content unchanged where possible
- may normalize newline endings

## Security and publish safety

- `.mdkg/index/` is generated and must be gitignored
- npm package publishes only `dist/`, `README.md`, `LICENSE` via `files` whitelist
- `.mdkg/` docs never published in npm package