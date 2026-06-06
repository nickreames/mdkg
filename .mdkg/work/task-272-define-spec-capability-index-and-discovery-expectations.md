---
id: task-272
type: task
title: define SPEC capability index and discovery expectations
status: done
priority: 1
epic: epic-48
parent: goal-8
tags: [spec, capability-index, discovery]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-48, test-101]
blocked_by: [task-271]
blocks: [task-276]
refs: [edd-14]
aliases: [spec-capability-index-discovery]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how SPEC files should appear in capability list/search/show outputs.

# Acceptance Criteria

- Indexing extracts title, kind, capabilities, resources, projection targets,
  validation checks, and source refs.
- Search terms include `SPEC section contract`, `runtime agent manifest`,
  `orchestrator agent`, and projection concepts.
- Imported subgraph SPECs remain read-only.

# Test Plan

- `mdkg capability search "SPEC section contract" --json`
- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "orchestrator agent" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Define index expectations before source indexer work starts.
- Current `capability list --kind spec` returns zero records in this repo
  because no concrete `SPEC.md` nodes are committed yet. The existing
  capability system already supports `kind: spec`, searches aliases/headings,
  and includes read-only subgraph source metadata.

# Capability Index Contract

Future SPEC capability records should be deterministic cache projections from
Markdown, not a new source of truth. `SPEC.md` remains durable source;
`.mdkg/index/capabilities.json` and `.mdkg/index/mdkg.sqlite` remain generated
cache surfaces.

## Current Behavior To Preserve

- `mdkg capability list/search/show/resolve` remains read-only.
- Capability commands may rebuild stale cache indexes, but they must not mutate
  source graph files.
- Normal work nodes remain excluded from capability records.
- Capability records include source metadata such as workspace, visibility,
  kind, id, qid, path, headings, refs, source hash, and `indexed_at`.
- Subgraph records remain read-only imported planning context.

## Future SPEC Record Fields

Future `kind: spec` capability records should expose:

- card identity: `id`, `qid`, `workspace`, `visibility`, `path`, `title`,
  `tags`, `aliases`, `refs`, `links`, `artifacts`, `updated`, `source_hash`,
  and `headings`;
- frontmatter routing fields from `task-268`: `version`, `role`,
  `runtime_mode`, `work_contracts`, `requested_capabilities`, `skill_refs`,
  `tool_refs`, `model_refs`, `wasm_component_refs`, `runtime_image_refs`,
  `subagent_refs`, `resource_profile`, and `update_policy`;
- parsed body-derived summaries where implemented later: capability ids,
  resource URI hints, authority boundary, resource boundary, projection
  targets, validation checks, closeout evidence, queue/event semantics, and
  single-writer policy;
- optional diagnostic summary from `task-271`, such as counts by severity, but
  not full validation execution.

Body-derived fields must be deterministic and conservative. If the parser
cannot identify a field confidently, it should omit the field or include a
warning diagnostic rather than inventing structure.

## Search Expectations

`mdkg capability search` should match future SPEC records by:

- title, id, qid, path, tags, refs, aliases, and headings;
- frontmatter routing fields;
- requested capabilities and linked skill/tool/model/runtime/subagent refs;
- parsed capability ids and optional generic URI hints;
- projection targets and validation-check terms;
- agent vocabulary such as `orchestrator agent`, `worker agent`, `reviewer
  agent`, `summarizer agent`, `graph project agent`, and `runtime agent
  manifest`;
- design concepts such as `SPEC section contract`, `SPEC validation
  diagnostics`, and `projection drift policy`.

Search should stay conjunctive by query terms unless a future search task
explicitly changes the matching model.

## List, Show, And Resolve Expectations

- `capability list --kind spec --json` should list concrete SPEC records once
  concrete `SPEC.md` files exist.
- `capability show <spec-id> --json` should show the SPEC record, selected
  routing fields, source metadata, and any indexed summaries.
- `capability resolve` should rank local fresh readable SPECs above stale or
  imported records, while still allowing subgraph SPECs as read-only planning
  context.
- `--visibility` filters apply to SPEC records exactly as they do for skills,
  work, core, and design capability records.
- `--fresh-only` excludes stale imported subgraph records.

## Imported Subgraph Policy

Imported SPEC records may be searched, shown, resolved, and packed as context,
but durable edits must happen in the source workspace. Future command output
should preserve source metadata:

- imported/read-only status;
- original qid, workspace, and path;
- bundle path and hash when available;
- stale status and warnings;
- permissions such as `read`.

If a future command proposes a repair for an imported SPEC, the repair should
identify the owning source workspace instead of mutating the materialized or
cached copy.

## Validation Boundary

Capability indexing is not validation. It may expose summaries and diagnostic
counts, but `mdkg validate` and future `mdkg spec validate` remain the
validation gates. Capability search should not silently hide invalid SPECs
unless visibility or permissions require it; invalid records should remain
discoverable enough to repair when parsing succeeds.

# Links / Artifacts

- `goal-8`
- `epic-48`
