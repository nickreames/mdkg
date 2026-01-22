---
id: rule-1
type: rule
title: mdkg conventions (naming, ids, frontmatter, status, priority, templates)
tags: [conventions, mdkg, spec]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-22
---

# mdkg conventions

This rule defines the file-first conventions for a local Markdown knowledge graph managed by **mdkg**.

## Principles

- Markdown files are the source of truth.
- Identity is the `id` in frontmatter, not the path or filename.
- Graph edges are explicit in frontmatter and reference IDs.
- Anything that must be searchable (external URLs, refs, artifacts) should be stored in frontmatter.
- Document bodies are for narrative detail; frontmatter is for indexing and graph structure.
- Everything is lowercase on disk (IDs, types, filenames, enums).
- The CLI may accept any case but MUST normalize to lowercase before processing.
- Frontmatter must be strict and valid (or the graph breaks).
- Body structure is template-guided and flexible (warnings, not hard failures).
- Templates are global (root-only) in v1.

## Root-only operation

mdkg commands are intended to run at the repo root.

- Root is defined by `./.mdkg/config.json`.
- No directory-walking “workspace discovery” at runtime.
- Workspaces are explicitly registered in `.mdkg/config.json`.

## Workspaces

A workspace is a registered project area (usually a subdirectory). Workspace docs live near code:

- `<workspace>/.mdkg/`

Workspaces are indexed by the root indexer according to `.mdkg/config.json`.

Qualified IDs exist for global uniqueness in the index:

- `qid = <workspace_alias>:<id>`
- example: `root:task-1`, `e2e:bug-3`

Local IDs remain unqualified in files.

## File naming

Canonical filename format:

`<prefix>-<number>-<slug>.md`

Rules:
- `<prefix>` MUST be lowercase.
- `<number>` MUST be an integer with no zero padding.
- `<slug>` SHOULD be lowercase kebab-case.
- Renames are allowed; identity remains stable via frontmatter `id`.

## Node types and prefixes

Design + core:
- `rule-*` — rules and conventions
- `prd-*` — product requirements document
- `edd-*` — engineering design document
- `dec-*` — decision record (generic, not only architecture)
- `prop-*` — proposal (early-stage)

Work:
- `epic-*`
- `feat-*` (optional)
- `task-*`
- `bug-*`
- `chk-*` — checkpoint (phase summary / compression node)

## IDs

Canonical ID format:

`<prefix>-<number>`

Examples:
- `task-183`
- `edd-14`
- `dec-3`
- `chk-1`

IDs MUST be lowercase and unique within a workspace. Global uniqueness is achieved via qualified IDs in the global index.

## Status

Work items store status in frontmatter only (no status directories).

Work status enum:
- `backlog`
- `blocked`
- `todo`
- `progress`
- `review`
- `done`

## Priority

Work items MAY include:

- `priority: 0..9`

Meaning:
- `0` = breaking / urgent (must be addressed immediately)
- `9` = later / lowest urgency

Priority is used as a default ranking when no explicit `prev/next` chain is present.

## Frontmatter (restricted subset)

Frontmatter MUST be the first lines of the file:

- begins with `---`
- ends with the next `---`

Allowed forms per line:

`key: value`

Keys:
- lowercase snake_case: `[a-z][a-z0-9_]*`

Values:
- string (rest of line)
- boolean: `true` / `false`
- list: `[a, b, c]` (comma-separated; items trimmed)
- empty lists SHOULD be written as `[]` for list fields

Disallowed:
- nested maps
- multiline values
- duplicate keys

## Required fields

All nodes MUST include:
- `id`
- `type`
- `title`
- `created` (YYYY-MM-DD)
- `updated` (YYYY-MM-DD)

Work items (`epic/feat/task/bug/chk/test`) MUST include:
  - `status`

Work items MAY include:
  - `priority`

Optional searchable metadata

All nodes MAY include:
- `tags: [a, b, c]`
- `owners: [a, b, c]`
- `links: [ref, ref]` (any searchable reference string; may include URLs)
- `artifacts: [ref, ref]` (build outputs, releases, commits, PRs, tarballs, etc.)
- `refs: [id, id]` (non-edge references to other nodes)
- `aliases: [text, text]` (extra searchable terms)

`dec-*` MUST include:
- `status: proposed|accepted|rejected|superseded`

## Graph edges

Edges reference IDs (or qualified IDs when cross-workspace).

Supported edge keys:
- `epic: epic-#`
- `parent: feat-#`
- `relates: [id, id]`
- `refs: [id, id]` (non-edge references; searchable but not traversed by default)
- `blocked_by: [id, id]`
- `blocks: [id, id]`
- `prev: id`
- `next: id`

Notes:
- Reverse relationships (e.g., “children of epic”) are derived by indexing.
- `prev/next` SHOULD be used for explicit “immediate next” flows.
- Priority SHOULD be used for triage when chain is absent or incomplete.

## Templates

Templates are global in v1 and live at:

- `.mdkg/templates/<set>/<type>.md`

Template sets (recommended):
- `default`
- `minimal`
- `verbose`

Templates are filled by token substitution (no template engine dependency). Optional scalar fields (like `epic`, `parent`, `prev`, `next`) should be omitted when empty; list fields should default to `[]`.

Body headings are guidance only. Frontmatter is strictly validated.

## Checkpoints

Checkpoints (`chk-*`) are first-class nodes used to summarize completed phases and compress context.

They SHOULD include:
- a summary of outcomes
- verification/testing notes
- key decisions referenced
- searchable links and artifacts in frontmatter (see `links` and `artifacts`)
- a `scope` list in frontmatter when possible (IDs covered)

## Index and cache

The cache is enabled by default.

- Root global index lives at `.mdkg/index/global.json`
- Index is rebuilt automatically when stale unless disabled by flag/config.
- `.mdkg/index/` is generated and MUST be gitignored.

## Safety guidance (high level)

mdkg content may include sensitive notes. Ensure production artifacts don’t include `.mdkg/`:
- prefer publishing only `dist/` via package.json `files`
- consider `.npmignore` / `.dockerignore` excludes
