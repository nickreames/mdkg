---
id: task-386
type: task
title: design graph clone fork import taxonomy
status: done
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, clone, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-7]
blocks: [task-387, task-388]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Design clone, fork, and import terminology and command boundaries.

This task establishes the 0.3.5 command contract for whole-graph reuse. The
implementation should add a new public `mdkg graph ...` namespace rather than
overloading `bundle` or `subgraph`.

# Acceptance Criteria

- Separate-repo clone preserves IDs and validates the destination graph.
- Separate-repo fork preserves IDs, can select a start goal, and records a
  fork-specific receipt for demo/operator handoff.
- Same-repo template import rewrites IDs and links deterministically before
  authored files are committed.
- Template import can select the rewritten start goal only after validation.
- Subgraph sync/materialize remain read-only child-graph orchestration
  surfaces and are not reintroduced as authored import commands.

# Files Affected

- src/**
- CLI_COMMAND_MATRIX.md
- .mdkg/work/**

# Implementation Notes

- Public command family:
  - `mdkg graph clone <source> --target <path> [--json]`
  - `mdkg graph fork <source> --target <path> [--start-goal <goal-id>] [--json]`
  - `mdkg graph import-template <source> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]`
- `source` may be a bundle path or a directory containing `.mdkg`. Directory
  sources should be converted internally through the same bundle file-selection
  rules so clone/import behavior matches bundle transport behavior.
- Clone/fork:
  - preserve all local IDs because the target is a separate ID namespace.
  - require a root-contained target path.
  - refuse non-empty targets unless a future explicit overwrite flag is added.
  - never mutate the source repo or source bundle.
  - copy authored graph content, committed archive sidecars/caches, managed
    templates, selected docs, and config needed for a valid destination graph.
  - do not copy runtime DB files, `.mdkg/pack/`, existing `.mdkg/bundles/`,
    `.mdkg/subgraphs/`, generated indexes, or raw archive source copies.
  - run destination `index` and `validate` before returning success.
- Import-template:
  - treats the current repo as the destination namespace.
  - defaults to dry-run behavior unless `--apply` is supplied.
  - uses the mutation lock for apply.
  - builds a deterministic ID map for every imported colliding numeric ID.
  - rewrites internal refs, blockers, `scope_refs`, `active_node`, and body-local
    qid/id mentions where safely structured by existing graph parsing helpers.
  - writes into a staging directory, validates the staged graph, then atomically
    writes authored files on apply.
  - rejects imports that would overwrite non-imported local authored files after
    rewriting.
  - if `--select-goal` is passed, requires `--start-goal` to resolve to a goal
    in the imported graph and selects the rewritten goal only after validation.
- Receipt shape must include:
  - `action`
  - `ok`
  - `mode`: `clone`, `fork`, `import_template_dry_run`, or `import_template_applied`
  - `source`
  - `target`
  - `source_hash`
  - `preserved_ids` or `rewritten_ids`
  - `rewritten_refs`
  - `skipped_paths`
  - `start_goal`
  - `selected_goal`
  - `validation`
  - `warnings`
- Implementation should extract reusable internal helpers instead of copying
  logic directly from `bundle`, `subgraph`, or `fix ids`.
- Existing `bundle import` guidance should remain legacy guidance. If help text
  mentions imports, it should point to `mdkg graph import-template`.

# Test Plan

- `test-165` proves separate-repo clone/fork preserves IDs and source immutability.
- `test-166` proves same-repo template import rewrites IDs and links.
- `test-167` proves start-goal selection is explicit and scoped to the cloned or
  imported graph.
- `npm run smoke:graph-clone` should pack/install mdkg, create source and
  destination temp repos, exercise clone/fork/import-template through installed
  CLI commands only, then run `index`, `validate`, `goal current`, `goal next`,
  `search`, `show`, and `pack`.

# Links / Artifacts

- spike-7
- chk-153
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-18 --json`
