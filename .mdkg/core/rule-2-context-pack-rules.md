---
id: rule-2
type: rule
title: mdkg context pack rules (selection, ordering, verbose, checkpoints)
tags: [agents, mdkg, pack, spec]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# mdkg context pack rules

A **context pack** is a deterministic export that bundles the root node plus relevant linked nodes, ordered for agent execution and constraint compliance.

Packs are the core feature that turns a Markdown graph into a repeatable “what to read before you code” artifact.

## Goals

- Deterministic: same repo state + same command → same pack ordering and contents.
- Relevant: include the minimum set needed to execute the work well.
- Safe: enforce limits to prevent runaway packs.
- Flexible: export to Markdown / JSON / TOON / XML.

## Command (conceptual)

`mdkg pack <id-or-qid> [--depth N] [--verbose] [--edges ...] [--ws <alias>] [--format md|json|toon|xml] [--out <path>]`

Notes:
- CLI normalizes to lowercase before processing.
- Packs are generated using the global index (auto-reindexed if stale).

## Node selection

### Root node
The root node is always included.

### Default depth
Default traversal depth is `2` unless overridden.

### Default edges
By default, traversal includes:
- `parent`
- `epic`
- `relates`

Non-edge references and metadata fields like `refs`, `links`, and `artifacts` are searchable and included in pack exports, but they are NOT traversed by default unless their corresponding graph edge keys are selected.

Optional edges (include only when requested via `--edges`):
- `blocked_by`
- `blocks`
- `prev`
- `next`

`--edges` adds to the default edge set; duplicates are ignored.

### Traversal method
- BFS traversal from the root to the specified depth.
- Nodes are de-duplicated by `qid` (qualified ID) in global mode.

## Ordering rules

Ordering is designed to maximize agent usefulness and rule compliance.

### Task-root ordering (recommended default)

1) Root `task-*` / `bug-*`
2) Immediate context:
   - `parent` (if present)
   - `epic` (if present)
   - related `chk-*` (checkpoint summaries) when present
   - blockers/blocked-by nodes when they are immediate (depth=1) and included via `--edges`
3) Architecture and constraints:
   - `edd-*`
   - `dec-*`
   - `rule-*`
4) Product requirements:
   - `prd-*`
5) Supporting docs:
   - `prop-*` (and any future supporting types)
6) Work graph neighbors (if included):
   - blockers, blocks, prev/next chain, related tasks/bugs

### Non-task root ordering (fallback)

If the root is not a `task-*` or `bug-*`, the root is still first. Remaining nodes are ordered by type priority:

1) `edd-*`
2) `dec-*`
3) `rule-*`
4) `prd-*`
5) `prop-*`
6) `epic-*`
7) `feat-*`
8) `task-*`
9) `bug-*`
10) `chk-*`

### Tie-breakers (stable determinism)

Within each group:
1) type priority (as listed above)
2) numeric ID ascending (use the trailing number in `<prefix>-<number>` when present; otherwise treat as infinity)
3) title lexicographic (final tie-break)

## Verbose mode (`--verbose`)

Verbose mode is intended for “fresh agent sessions” and MUST add baseline rules even if not directly linked.

When `--verbose` is enabled:
- include IDs listed in `.mdkg/core/core.md` (one per line)
- pinned core inclusion MUST obey pack limits
- IDs are resolved as `id` or `qid`; ambiguous matches should warn and be skipped unless a qualified ID is provided

If a pinned core ID does not exist, pack generation should warn but continue.

## Checkpoints (compression nodes)

Checkpoints (`chk-*`) are phase summaries that reduce context sprawl.

### Recommended checkpoint frontmatter fields
- `scope: [id, id, ...]` (IDs covered by the checkpoint)

### Pack behavior with checkpoints
- If the root node relates to a checkpoint, include the checkpoint early (immediate context).
- Optional future behavior (not required for v1): `--prefer-checkpoints`
  - when enabled, if many “done” nodes are in scope and a checkpoint covers them, include the checkpoint instead of the underlying nodes (while still including core constraints like rules/decisions as needed).

## Limits

Default limits (configurable):
- `max_nodes: 25`
- `max_bytes: 2,000,000` for Markdown output

When a limit is hit:
- the root node MUST remain included
- higher-priority types (`edd/dec/rule/prd`) should be favored over low-priority neighbors
- pack metadata must record that truncation occurred
- `max_bytes` is enforced for Markdown output; other formats ignore byte limits in v1

## Export formats

### Markdown (`--format md`)
Markdown packs MUST include:
- a pack header with metadata (root, depth, verbose, node count, truncation flags)
- an ordered “included nodes” list
- each node content separated by a stable divider
- node headers should include: `qid`, `type`, `title`, `status` (if any), `priority` (if any), `path`, and the searchable frontmatter lists `links` and `artifacts`

Node bodies should exclude the full raw frontmatter by default to reduce noise, but the header MUST surface key searchable fields (at minimum: `links` and `artifacts`, plus `refs` when present). A future flag like `--include-frontmatter` may include the full raw frontmatter.

### JSON (`--format json`)
JSON packs MUST include:
- `meta` (root, generation timestamp, depth, verbose, truncation info)
- `nodes` array in the same order as Markdown packs
- each node includes:
  - `qid`, `id`, `workspace`, `type`, `title`, `status`, `priority` (if any), `path`
  - `frontmatter` (parsed restricted subset, including `links`, `artifacts`, `refs`, and `aliases` when present)
  - `body` (content excluding frontmatter)

### TOON (`--format toon`)
TOON packs SHOULD mirror JSON semantics:
- meta
- ordered nodes
- node fields as above

Exact TOON encoding is defined by the project’s TOON spec adoption.

### XML (`--format xml`)
XML packs SHOULD mirror JSON semantics:
- `<pack>` root element with `<meta>` and `<nodes>`
- `<nodes>` contains ordered `<node>` elements
- node fields align with JSON exporter
- list fields are represented as repeated child elements
- body content must be safely encoded

## Determinism requirements

Given the same repo state and command flags:
- included node set must be identical
- ordering must be identical
- only timestamps in metadata may differ between runs
