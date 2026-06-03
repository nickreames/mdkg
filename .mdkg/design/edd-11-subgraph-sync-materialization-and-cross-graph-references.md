---
id: edd-11
type: edd
title: subgraph sync materialization and cross graph references
tags: [subgraph, bundle, materialize, orchestration, references]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-22, epic-38]
refs: [rule-3, edd-10]
aliases: [subgraph-sync-materialize, cross-graph-refs]
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Root orchestration graphs need to keep child graph snapshots fresh without
treating extracted bundles as source repos and without mutating child mdkg
Markdown. This design adds two root-owned operations:

- `mdkg subgraph sync` builds configured child bundles from clean child Git
  repos and stores the bundles in the root graph.
- `mdkg subgraph materialize` extracts configured bundles into generated
  inspection trees that are ignored by indexing and validation.

It also makes prefix refs such as `child_repo:work.generate-image` valid graph
references when the target subgraph is configured and loaded.

# Architecture

Subgraph bundle ZIPs remain the transport. The root config owns subgraph
identity, visibility, freshness, permissions, and target bundle paths.

`subgraph refresh` remains reload-only. `subgraph sync` is the explicit command
that inspects child Git state, builds bundles from `source_path`, verifies the
result, and updates root-owned bundle/config metadata. Child repos remain the
only mutation owners for their graph content.

Materialized views live under `.mdkg/subgraphs/<alias>` by convention. They are
generated inspection output, not workspaces. Local scanners, indexers,
validators, packers, bundle builders, and SQLite hydration must ignore them.

# Data model

Existing `subgraphs.<alias>` config remains the semantic surface:

- `source_path`: root-relative child Git repo path.
- `source_repo`: updated by sync to `<branch>@<sha>`.
- `sources[].path`: root-owned bundle output path.
- `sources[].expected_profile`: bundle profile to build and verify.

Materialized view marker:

```json
{
  "tool": "mdkg",
  "kind": "subgraph_materialization",
  "alias": "child_repo",
  "bundle_path": ".mdkg/bundles/private/subgraphs/child_repo.mdkg.zip",
  "bundle_hash": "sha256:...",
  "profile": "private",
  "source_repo": "main@...",
  "source_git_head": "...",
  "generated_at": "...",
  "mdkg_version": "..."
}
```

# APIs / interfaces

New command surface:

- `mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]`
- `mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]`

Cross-graph refs:

- `alias:id` and `alias:portable.id` are subgraph qids when `alias` is a
  configured subgraph alias.
- `scheme://...` remains an external URI ref.
- Relationship/reference fields may target subgraph qids.
- Root-authored ownership fields should not make child nodes parents of local
  work; child-internal ownership remains valid inside projected bundles.

# Failure modes

- Missing `source_path`, outside-root paths, non-Git paths, missing `.mdkg`, or
  dirty tracked child changes fail sync unless `--allow-dirty` is supplied.
- `sync --all` reports every alias and exits nonzero when any alias fails.
- Materialize refuses to replace existing directories unless `--clean` is set
  and the directory contains a mdkg materialization marker.
- ZIP entries with absolute paths or `..` segments are rejected.
- Validation fails strict refs to missing enabled subgraph targets.

# Observability

JSON receipts include updated, skipped, errors, warnings, old/new bundle hashes,
old/new `source_repo`, dirty state, stale state, and materialized paths.

# Security / privacy

Root sync never commits, pushes, pulls, checkouts, resets, or edits child repos.
Materialized views are local inspection output and are ignored by default.
Public bundle/pack visibility enforcement continues to fail closed on private
or internal subgraph references.

# Testing strategy

Use unit, CLI, and packed temp-repo smoke tests with a root repo and two child
Git submodules. Prove dry-run safety, clean/dirty sync behavior, bundle hash
updates after committed child changes, safe materialization, scan exclusion, and
capability resolution after sync.

# Rollout plan

Ship as the next pre-v1 `0.1.x` release. Keep `subgraph refresh` semantics
unchanged. Do not publish until all tests, smoke scripts, publish readiness
checks, and dry-run publish pass.
