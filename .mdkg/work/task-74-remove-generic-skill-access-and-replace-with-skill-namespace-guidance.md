---
id: task-74
type: task
title: remove generic skill access and replace with skill namespace guidance
status: done
priority: 1
epic: epic-10
tags: [v0_5, cli, skills, ux]
owners: []
links: []
artifacts: [src/commands/list.ts, src/commands/search.ts, src/commands/show.ts, src/cli.ts, README.md, llms.txt, AGENT_PROMPT_SNIPPET.md]
relates: [dec-13, dec-12, test-38, epic-10]
blocked_by: []
blocks: [test-38]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Remove the unpublished generic skill access paths and make `mdkg skill ...` the only supported skill discovery and display surface.

# Acceptance Criteria

- source docs and mdkg graph reflect the intended contract for this task
- referenced runtime/docs artifacts are updated or tracked explicitly
- linked validation/test nodes can be used to audit completion

# Files Affected

- see `artifacts` in frontmatter for the primary files touched or planned

# Implementation Notes

- keep behavior deterministic and local-first
- prefer one canonical interface per workflow over parallel teaching paths

# Test Plan

- satisfy the linked `test-*` contract for this task
- rerun `mdkg validate` after node or doc updates

# Links / Artifacts

- epic linkage and frontmatter artifacts are the source of truth for this planning record
