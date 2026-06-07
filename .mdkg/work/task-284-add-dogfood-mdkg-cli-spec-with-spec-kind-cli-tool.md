---
id: task-284
type: task
title: add dogfood mdkg CLI SPEC with spec_kind cli_tool
status: done
priority: 1
epic: epic-55
parent: goal-9
prev: task-283
next: task-285
tags: [spec, dogfood, cli]
owners: []
links: []
artifacts: []
relates: [goal-9, epic-55, test-109]
blocked_by: [task-283]
blocks: [task-285, test-109]
refs: [edd-15, dec-26]
aliases: [mdkg-cli-tool-spec, dogfood-cli-spec]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Create a concrete mdkg CLI SPEC node so the live repo has a real `kind: spec`
capability record.

# Acceptance Criteria

- SPEC has `spec_kind: cli_tool`.
- SPEC references command matrix, validation checks, security boundaries, and work contract linkage.
- `capability list --kind spec` returns the dogfood SPEC after indexing.

# Files Affected

- `.mdkg/work`

# Implementation Notes

- The dogfood SPEC should describe the CLI capability surface, not a roadmap.

# Test Plan

- `node dist/cli.js index`
- `node dist/cli.js capability list --kind spec --json`
- `node dist/cli.js capability search "mdkg cli tool spec" --json`

# Links / Artifacts

- `test-109`

# Implementation Evidence

Completed on 2026-06-06.

## Added Graph Records

- `.mdkg/work/mdkg-cli/SPEC.md`
  - `id: spec.mdkg-cli`
  - `type: spec`
  - `spec_kind: cli_tool`
  - describes the reusable mdkg CLI capability surface, command matrix links,
    local project DB queue/event boundaries, single-writer expectations,
    security/privacy boundaries, validation checks, and closeout evidence.
- `.mdkg/work/mdkg-cli/validate/WORK.md`
  - `id: work.mdkg-cli.validate`
  - `type: work`
  - `agent_id: spec.mdkg-cli`
  - provides the strict `work_contracts: [validate/WORK.md]` target required by
    the SPEC.

## Verification Evidence

- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `node dist/cli.js capability list --kind spec --json`: returned one record,
  `root:spec.mdkg-cli`.
- `node dist/cli.js capability search "mdkg cli tool spec" --kind spec --json`:
  returned `root:spec.mdkg-cli`.
- `node dist/cli.js capability list --kind work --json`: returned
  `root:work.mdkg-cli.validate`.
- `git diff --check`: passed.

## Follow-ups

- `task-285` must add `spec_kind` to projected capability metadata; the current
  capability record proves the SPEC exists but does not yet expose `spec_kind`
  in the `spec` projection.
- `test-109` remains open until `task-285` proves the projected metadata.
